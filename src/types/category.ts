export interface Category {
  id: string
  nameEn: string
  nameAr: string
  name: string // resolved to current language
  parentId: string | null
  children: Category[]
  iconUrl?: string
}

export type FieldType =
  | "Range"
  | "SingleChoiceEnum"
  | "MultipleChoiceEnum"
  | "Boolean"

export interface FieldChoice {
  value: string
  label: string
}

export interface CategoryField {
  name: string
  fieldType: FieldType
  label: string
  isMandatory: boolean
  displayPriority: number
  groupIndex: number
  choices?: FieldChoice[]
  min?: number
  max?: number
  unit?: string
}
