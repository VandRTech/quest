/**
 * Per-service coverage policy: 9 required + 9 optional for each service.
 * Sourced from service-parameters (development and sale ready); fallback for unknown services.
 */
import { getRequiredIdsForService as getRequiredFromServiceParams, getOptionalIdsForService as getOptionalFromServiceParams, hasServiceParams } from '../service-parameters';

export type CoveragePolicy = {
  required: string[];
  optional?: string[];
};

const DEFAULT_REQUIRED = [
  'project_type',
  'rooms',
  'size_sqft',
  'style',
  'budget',
  'timeline',
  'contact_pref',
  'callback_time',
  'preferred_start',
];

const DEFAULT_OPTIONAL = [
  'must_haves',
  'avoid',
  'site_ready',
  'storage_needs',
  'lighting_pref',
  'notes',
  'moodboard_refs',
  'special_zones',
  'material_preference',
];

/**
 * Returns required datapoint ids for the given service (9 mandatory).
 */
export function getRequiredFieldsForService(service: string): string[] {
  if (hasServiceParams(service)) {
    const ids = getRequiredFromServiceParams(service);
    if (ids.length > 0) return ids;
  }
  return DEFAULT_REQUIRED;
}

/**
 * Returns optional datapoint ids for the given service (9 optional).
 */
export function getOptionalFieldsForService(service: string): string[] {
  if (hasServiceParams(service)) {
    const ids = getOptionalFromServiceParams(service);
    if (ids.length > 0) return ids;
  }
  return DEFAULT_OPTIONAL;
}

/**
 * Returns full coverage policy for the service (9 required + 9 optional).
 */
export function getCoveragePolicyForService(service: string): CoveragePolicy {
  return {
    required: getRequiredFieldsForService(service),
    optional: getOptionalFieldsForService(service),
  };
}

/**
 * True if session has values for all required fields for this service.
 */
export function isCoverageSatisfied(
  parameters: Record<string, any>,
  service: string
): boolean {
  const required = getRequiredFieldsForService(service);
  for (const id of required) {
    const val = parameters[id];
    if (val === undefined || val === null) return false;
    if (typeof val === 'object' && val !== null && 'value' in val) {
      if (val.value === undefined || val.value === null) return false;
    }
  }
  return true;
}
