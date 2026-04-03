// Raw shapes from the wire — never imported by UI directly

export interface RawCategory {
  id: number
  name: string
  name_l1: string
  externalID: string
  parentID?: number | null
  children?: RawCategory[]
  iconUrl?: string
}

export type RawFieldType =
  | "Range"
  | "SingleChoiceEnum"
  | "MultipleChoiceEnum"
  | "Boolean"

export interface RawFieldChoice {
  value: string
  label: string
}

export interface RawCategoryField {
  name: string
  fieldType: RawFieldType
  label: string
  isMandatory?: boolean
  displayPriority?: number
  groupIndex?: number
  choices?: RawFieldChoice[]
  min?: number
  max?: number
  unit?: string
}

export interface RawCategoryFieldsResponse {
  [categoryId: string]: RawCategoryField[]
}

export interface MSearchHit<T> {
  _source: T
}

export interface MSearchResponse<T> {
  responses: Array<{
    hits: {
      total: { value: number }
      hits: Array<MSearchHit<T>>
    }
    error?: unknown
  }>
}

export interface RawAdCategory {
  externalID: string
  id: number
  level: number
  name: string
  name_l1?: string
}

export interface RawAdLocation {
  externalID: string
  id: number
  level: number
  name: string
  name_l1?: string
}

export interface RawAdImage {
  url: string
  id?: string
}

export interface RawPhoto {
  id: number
  externalID?: string
  orderIndex?: number
}

export interface RawAd {
  id: string
  title: string
  price?: number | null
  priceType?: string
  currency?: string
  timestamp: number
  createdAt?: number
  externalID?: string
  category: RawAdCategory[]
  location: RawAdLocation[]
  photos?: RawPhoto[]
  images?: RawAdImage[]
  parameters?: Array<{ key: string; value: string; valueLabel?: string }>
  extraFields?: Record<string, unknown>
  description?: string
  isElite?: boolean
  isVerified?: boolean
  userId?: string
  slug?: string
  status?: string
}

export interface RawLocation {
  externalID: string
  name: string
  level: number
  hierarchy?: Array<{ externalID: string; name?: string }>
}
