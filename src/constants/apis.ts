export const OLX_BASE_URL = "https://www.olx.com.lb/api"
export const SEARCH_URL = "https://search.mena.sector.run/_msearch"
export const SEARCH_AUTH =
  "Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy"

export const SEARCH_INDICES = {
  ADS: "olx-lb-production-ads-en",
  LOCATIONS: "olx-lb-production-locations-en",
} as const

export const CATEGORY_FIELDS_PARAMS = new URLSearchParams({
  includeChildCategories: "true",
  splitByCategoryIDs: "true",
  flatChoices: "true",
  groupChoicesBySection: "true",
  flat: "true",
}).toString()

export const ADS_PAGE_SIZE = 12
