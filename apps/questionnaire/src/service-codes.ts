/**
 * Service code to internal service id mapping.
 * Character resolution is driven by service code first; fallback when code is unknown or character lookup fails.
 */
export const SERVICE_CODE_TO_ID: Record<string, string> = {
  CIRC01: 'residential_construction',
  IRRI01: 'residential_interiors',
  IRPW02: 'painting',
  CIEL03: 'electrical_services',
  CIPL02: 'plumbing_services',
  SESR01: 'solar_services',
  PSEM01: 'event_management',
  RPPD01: 'property_development',
  HASH01: 'home_automation',
  AAFI01: 'farm_infrastructure',
  AAIA02: 'irrigation_automation',
};

/** Service code → character display name (used when core registry lookup fails). */
export const SERVICE_CODE_TO_CHARACTER_NAME: Record<string, string> = {
  CIRC01: 'Arvind Narayan',
  IRRI01: 'Aadhya Rao',
  IRPW02: 'Manjunath Gowda',
  CIEL03: 'Vivek Shetty',
  CIPL02: 'Ramesh Gowda',
  SESR01: 'Kavya Nair',
  PSEM01: 'Ananya Rao',
  RPPD01: 'Aditya Shekhar',
  HASH01: 'Riya Mehta',
  AAFI01: 'Harish Kulkarni',
  AAIA02: 'Raghav Srinivasan',
};

/** Internal id to service code (for response or UI) */
export const SERVICE_ID_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_CODE_TO_ID).map(([code, id]) => [id, code])
);

/**
 * Normalize input: if it's a known service code, return that code and resolved serviceId; otherwise treat as internal id.
 */
export function normalizeServiceInput(service: string): { code: string | null; serviceId: string } {
  const raw = String(service || '').trim();
  const upper = raw.toUpperCase();
  const serviceId = SERVICE_CODE_TO_ID[upper] ?? raw;
  const code = SERVICE_CODE_TO_ID[upper] ? upper : null;
  return { code, serviceId };
}

/**
 * Resolve service from request: accept either code (CIRC01) or internal id (residential_construction).
 * Primary path: service code → internal id. Fallback: unknown value used as-is (treated as internal id).
 */
export function resolveServiceId(service: string): string {
  const { serviceId } = normalizeServiceInput(service);
  return serviceId;
}

/**
 * Get character display name from service code first; fallback to default.
 * Accepts either service code (CIRC01) or internal id (residential_construction).
 * Character register mapping is driven by service code; fallback = core/default name.
 */
export function getDisplayNameByServiceCode(service: string, defaultName: string): string {
  const { code, serviceId } = normalizeServiceInput(service);
  const codeForLookup = code ?? (SERVICE_ID_TO_CODE[serviceId] || null);
  if (codeForLookup && SERVICE_CODE_TO_CHARACTER_NAME[codeForLookup])
    return SERVICE_CODE_TO_CHARACTER_NAME[codeForLookup];
  return defaultName;
}
