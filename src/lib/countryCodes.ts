import { countries } from "countries-list";

export interface CountryCodeOption {
  /** e.g. "+91" */
  dialCode: string;
  /** e.g. "India" */
  name: string;
  /** ISO 3166-1 alpha-2, e.g. "IN" */
  code: string;
}

/**
 * All country calling codes from countries-list, sorted by country name.
 * Use for country code dropdowns.
 */
export const countryCodeOptions: CountryCodeOption[] = Object.entries(countries)
  .map(([code, data]) => ({
    code,
    name: data.name,
    dialCode: data.phone?.[0] != null ? `+${data.phone[0]}` : "",
  }))
  .filter((c) => c.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));
