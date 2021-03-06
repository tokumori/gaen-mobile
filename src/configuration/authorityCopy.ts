import copy from "./copy.json"

const DEFAULT_LOCALE = "en"
type CopyKey = "welcome_message" | "about" | "legal"
type CopyValues = Record<string, string>
type AuthorityCopyContent = Record<CopyKey, CopyValues>

const loadAuthorityCopy = (forKey: CopyKey): CopyValues => {
  return (copy as AuthorityCopyContent)[forKey] || {}
}

const authorityCopyTranslation = (
  authorityCopyOverrides: CopyValues,
  localeCode: string,
  defaultValue: string,
): string => {
  const overrideCopy =
    authorityCopyOverrides[localeCode] || authorityCopyOverrides[DEFAULT_LOCALE]

  return overrideCopy?.length > 0 ? overrideCopy : defaultValue
}

export { loadAuthorityCopy, authorityCopyTranslation }
