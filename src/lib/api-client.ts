import {
  ADS_PAGE_SIZE,
  CATEGORY_FIELDS_PARAMS,
  OLX_BASE_URL,
  SEARCH_AUTH,
  SEARCH_INDICES,
  SEARCH_URL,
} from "~/constants/apis"
import { LangCodeEnum, type LangCodeType } from "~/i18n/language.constants"
import { apiFetch, apiFetchNdjson } from "~/lib/fetch"
import type { Ad, AdImage, AdParameter, Location } from "~/types/ad"
import type {
  MSearchResponse,
  RawAd,
  RawCategory,
  RawCategoryField,
  RawCategoryFieldsResponse,
  RawLocation,
} from "~/types/api"
import type { Category, CategoryField, FieldChoice } from "~/types/category"
import type { FilterState } from "~/types/filters"
import { formatUnixTime } from "~/utils/time-utils"

// ─── Category transformers ────────────────────────────────────────────────────

function transformCategory(raw: RawCategory, lang: LangCodeType): Category {
  const children = (raw.children ?? []).map((c) => transformCategory(c, lang))
  return {
    id: raw.externalID,
    nameEn: raw.name,
    nameAr: raw.name_l1 ?? raw.name,
    name: lang === LangCodeEnum.AR ? (raw.name_l1 ?? raw.name) : raw.name,
    parentId: raw.parentID ? String(raw.parentID) : null,
    children,
    iconUrl: raw.iconUrl,
  }
}

export async function fetchCategories(
  lang: LangCodeType = LangCodeEnum.EN,
): Promise<Category[]> {
  const data = await apiFetch<RawCategory[] | { categories: RawCategory[] }>(
    `${OLX_BASE_URL}/categories`,
  )
  const list: RawCategory[] = Array.isArray(data)
    ? data
    : (data.categories ?? [])
  return list.map((c) => transformCategory(c, lang))
}

// ─── Category fields transformer ─────────────────────────────────────────────

function transformField(raw: RawCategoryField): CategoryField {
  const choices: FieldChoice[] = (raw.choices ?? []).map((c) => ({
    value: String(c.value),
    label: c.label,
  }))
  return {
    name: raw.name,
    fieldType: raw.fieldType as CategoryField["fieldType"],
    label: raw.label,
    isMandatory: raw.isMandatory ?? false,
    displayPriority: raw.displayPriority ?? 0,
    groupIndex: raw.groupIndex ?? 0,
    choices: choices.length > 0 ? choices : undefined,
    min: raw.min,
    max: raw.max,
    unit: raw.unit,
  }
}

export async function fetchCategoryFields(): Promise<
  Record<string, CategoryField[]>
> {
  const data = await apiFetch<RawCategoryFieldsResponse>(
    `${OLX_BASE_URL}/categoryFields?${CATEGORY_FIELDS_PARAMS}`,
  )
  const result: Record<string, CategoryField[]> = {}
  for (const [id, fields] of Object.entries(data)) {
    result[id] = (fields ?? [])
      .map(transformField)
      .sort((a, b) => a.displayPriority - b.displayPriority)
  }
  return result
}

// ─── msearch ─────────────────────────────────────────────────────────────────

interface MSearchQuery {
  index: (typeof SEARCH_INDICES)[keyof typeof SEARCH_INDICES]
  body: Record<string, unknown>
}

async function msearch<T>(
  queries: MSearchQuery[],
): Promise<MSearchResponse<T>> {
  const ndjson = `${queries
    .map(
      (q) => `${JSON.stringify({ index: q.index })}\n${JSON.stringify(q.body)}`,
    )
    .join("\n")}\n`

  return apiFetchNdjson<MSearchResponse<T>>(SEARCH_URL, ndjson, {
    Authorization: SEARCH_AUTH,
  })
}

// ─── Ad transformer ───────────────────────────────────────────────────────────

const OLX_IMAGE_BASE = "https://images.olx.com.lb/thumbnails"

function photoUrl(photoId: number, size = "400x300"): string {
  return `${OLX_IMAGE_BASE}/${photoId}-${size}.jpeg`
}

function transformAd(raw: RawAd): Ad {
  const images: AdImage[] = (raw.photos ?? [])
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((p) => ({ url: photoUrl(p.id), id: String(p.id) }))
  const parameters: AdParameter[] = (raw.parameters ?? []).map((p) => ({
    key: p.key,
    value: p.value,
    valueLabel: p.valueLabel,
  }))
  const extraPrice = raw.extraFields?.price
  const price =
    typeof extraPrice === "number" && extraPrice > 0
      ? extraPrice
      : (raw.price ?? null)
  const timestamp = formatUnixTime(
    raw.timestamp ?? raw.createdAt ?? 0,
  ).toISOString()
  const leafLocation = raw.location[raw.location.length - 1]
  const leafCategory = raw.category[raw.category.length - 1]
  return {
    id: String(raw.id),
    title: raw.title,
    price: price && price > 0 ? price : null,
    currency: raw.currency ?? "USD",
    timestamp,
    categoryId: String(leafCategory?.externalID ?? ""),
    categoryName: leafCategory?.name ?? "",
    locationId: String(leafLocation?.externalID ?? ""),
    locationName: leafLocation?.name ?? "",
    images,
    parameters,
    description: raw.description,
    isElite: raw.isElite ?? false,
    isVerified: raw.isVerified ?? false,
    slug: raw.slug,
  }
}

// ─── Ads search ──────────────────────────────────────────────────────────────

export interface AdsQueryParams {
  filters: FilterState
  from: number
  size?: number
}

export interface AdsResult {
  ads: Ad[]
  total: number
}

export async function searchAds({
  filters,
  from,
  size = ADS_PAGE_SIZE,
}: AdsQueryParams): Promise<AdsResult> {
  const must: Record<string, unknown>[] = []

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    must.push({ terms: { "category.externalID": filters.categoryIds } })
  } else if (filters.categoryId) {
    must.push({ term: { "category.externalID": filters.categoryId } })
  }
  if (filters.locationId) {
    must.push({ term: { "location.externalID": filters.locationId } })
  }
  if (filters.searchText) {
    must.push({
      multi_match: {
        query: filters.searchText,
        fields: ["title", "description"],
      },
    })
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    const range: Record<string, number> = {}
    if (filters.priceMin !== null) range.gte = filters.priceMin
    if (filters.priceMax !== null) range.lte = filters.priceMax
    must.push({ range: { price: range } })
  }
  for (const [key, value] of Object.entries(filters.dynamicFilters)) {
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) {
      if (value.length > 0) must.push({ terms: { [key]: value } })
    } else {
      must.push({ term: { [key]: value } })
    }
  }

  const query = must.length > 0 ? { bool: { must } } : { match_all: {} }

  const response = await msearch<RawAd>([
    {
      index: SEARCH_INDICES.ADS,
      body: {
        from,
        size,
        track_total_hits: 200000,
        query,
        sort: [{ timestamp: { order: "desc" } }, { id: { order: "desc" } }],
      },
    },
  ])

  const result = response.responses[0]
  if (!result || result.error) throw new Error("ads search returned error")

  return {
    ads: result.hits.hits.map((h) => transformAd(h._source)),
    total: result.hits.total.value,
  }
}

// ─── Single ad fetch ─────────────────────────────────────────────────────────

export async function fetchAdById(id: string): Promise<Ad | null> {
  const response = await msearch<RawAd>([
    {
      index: SEARCH_INDICES.ADS,
      body: {
        size: 1,
        query: { term: { id: Number(id) } },
      },
    },
  ])

  const result = response.responses[0]
  if (!result || result.error) throw new Error("ad fetch returned error")
  const hit = result.hits.hits[0]
  return hit ? transformAd(hit._source) : null
}

// ─── Location search ──────────────────────────────────────────────────────────

function transformLocation(raw: RawLocation): Location {
  return {
    externalID: raw.externalID,
    name: raw.name,
    level: raw.level,
    parentIds: (raw.hierarchy ?? []).map((h) => h.externalID),
  }
}

export async function searchLocations(
  hierarchyId: string,
  level: number,
): Promise<Location[]> {
  const response = await msearch<RawLocation>([
    {
      index: SEARCH_INDICES.LOCATIONS,
      body: {
        from: 0,
        size: 10000,
        track_total_hits: false,
        query: {
          bool: {
            filter: [
              { term: { "hierarchy.externalID.keyword": hierarchyId } },
              { term: { level } },
            ],
          },
        },
        sort: [{ "name.keyword": { order: "asc" } }],
        timeout: "5s",
      },
    },
  ])

  const result = response.responses[0]
  if (!result || result.error)
    throw new Error("locations search returned error")
  return result.hits.hits.map((h) => transformLocation(h._source))
}
