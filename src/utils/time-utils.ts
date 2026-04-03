import { formatRelative, fromUnixTime, type Locale } from "date-fns"
import { ar, enUS } from "date-fns/locale"

import i18n from "~/i18n/config"
import { LangCodeEnum, type LangCodeType } from "~/i18n/language.constants"

const DATE_FNS_LOCALES = {
  [LangCodeEnum.EN]: enUS,
  [LangCodeEnum.AR]: ar,
} as const

function getCurrentLocale(): Locale {
  const code = (i18n.language || LangCodeEnum.EN) as LangCodeType
  return (DATE_FNS_LOCALES[code] as Locale) || enUS
}

function fmtRelative(
  date: string | number | Date,
  base: Date = new Date(),
): string {
  return formatRelative(date, base, { locale: getCurrentLocale() })
}

export function formatUnixTime(unixSeconds: number): Date {
  return fromUnixTime(unixSeconds)
}

export function formatRelativeTime(timestamp: string): string {
  return fmtRelative(new Date(timestamp))
}
