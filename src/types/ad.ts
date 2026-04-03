export interface AdImage {
  url: string
  id?: string
}

export interface AdParameter {
  key: string
  value: string
  valueLabel?: string
}

export interface Ad {
  id: string
  title: string
  price: number | null
  currency: string
  timestamp: string
  categoryId: string
  categoryName: string
  locationId: string
  locationName: string
  locationRegion?: string
  images: AdImage[]
  parameters: AdParameter[]
  description?: string
  isElite: boolean
  isVerified: boolean
  slug?: string
}

export interface Location {
  externalID: string
  name: string
  level: number
  parentIds: string[]
}
