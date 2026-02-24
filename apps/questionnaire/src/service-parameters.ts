/**
 * Per-service 9 required + 9 optional parameters (development and sale ready).
 * Single source of truth for coverage policy and conversation datapoints.
 */
import type { CharacterDatapoint } from './types/character';

type ParamDef = { id: string; label: string; hint: string };

function def(id: string, label: string, hint: string): ParamDef {
  return { id, label, hint };
}

/** 9 required + 9 optional per service. Order within required/optional is ask order. */
const SERVICE_PARAMS: Record<string, { required: ParamDef[]; optional: ParamDef[] }> = {
  residential_interiors: {
    required: [
      def('project_type', 'Project type', 'apartment, villa, independent house'),
      def('rooms', 'Rooms / BHK', 'e.g. 2BHK, 3BHK'),
      def('size_sqft', 'Area (sqft)', 'approximate area in square feet'),
      def('style', 'Design style', 'modern, traditional, minimal, japandi, neo-indian'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'completion in days/weeks/months'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call – day and time'),
      def('preferred_start', 'Preferred start', 'when project work should begin'),
    ],
    optional: [
      def('must_haves', 'Must-haves', 'features, materials, colors they want'),
      def('avoid', 'Avoid', 'materials, colors, items to avoid'),
      def('site_ready', 'Site ready', 'yes/no – is site ready for work'),
      def('storage_needs', 'Storage needs', 'wardrobes, lofts, storage'),
      def('lighting_pref', 'Lighting', 'warm / cool / natural'),
      def('notes', 'Notes', 'special focus areas, kids room, etc.'),
      def('moodboard_refs', 'Moodboard', 'links or inspirations'),
      def('special_zones', 'Special zones', 'living room, bedroom, kids room priority'),
      def('material_preference', 'Material preference', 'wood, laminate, etc.'),
    ],
  },
  residential_construction: {
    required: [
      def('project_type', 'Project type', 'villa, apartment, independent house'),
      def('plot_size_sqft', 'Plot size (sqft)', 'plot or built-up area in sqft'),
      def('floors', 'Number of floors', 'e.g. G+1, G+2'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'completion in days/weeks/months'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('has_soil_test', 'Soil test', 'yes/no – soil test done'),
      def('has_approvals', 'Approvals', 'yes/no – plan sanction / approvals'),
    ],
    optional: [
      def('material_grade', 'Material grade', 'standard, premium, etc.'),
      def('foundation_type', 'Foundation type', 'if known'),
      def('sustainability', 'Sustainability', 'rainwater, solar readiness, etc.'),
      def('notes', 'Notes', 'any other requirements'),
      def('preferred_start', 'Preferred start', 'when construction should start'),
      def('location', 'Location', 'city / area if relevant'),
      def('power_water_avail', 'Power & water', 'availability on site'),
      def('contractor_pref', 'Contractor preference', 'if any'),
      def('other_construction', 'Other', 'any other construction details'),
    ],
  },
  commercial_interiors: {
    required: [
      def('project_type', 'Project type', 'office, retail, restaurant, etc.'),
      def('size_sqft', 'Carpet area (sqft)', 'usable area in sqft'),
      def('space_use', 'Space use', 'office, showroom, clinic, etc.'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'completion timeline'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('brand_theme', 'Brand / theme', 'brand guidelines or theme'),
      def('occupancy', 'Occupancy', 'approx number of people / seats'),
    ],
    optional: [
      def('must_haves', 'Must-haves', 'mandatory features or specs'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('furniture_need', 'Furniture', 'in scope or separate'),
      def('av_need', 'AV / tech', 'audio-visual or tech requirements'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when work should start'),
      def('compliance', 'Compliance', 'fire, accessibility, etc.'),
      def('special_zones', 'Special zones', 'reception, cabins, etc.'),
      def('other_commercial', 'Other', 'any other details'),
    ],
  },
  commercial_construction: {
    required: [
      def('project_type', 'Project type', 'office, warehouse, retail, etc.'),
      def('size_sqft', 'Built-up area (sqft)', 'area in sqft'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'completion timeline'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('construction_type', 'Construction type', 'new build, extension, etc.'),
      def('delivery_phase', 'Delivery phase', 'design, build, turnkey'),
      def('contract_type', 'Contract type', 'lump sum, item rate, etc.'),
    ],
    optional: [
      def('mep_scope', 'MEP scope', 'electrical, plumbing, HVAC in scope'),
      def('compliance_focus', 'Compliance', 'local norms, green building'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('site_conditions', 'Site conditions', 'if known'),
      def('vendor_pref', 'Vendor preference', 'if any'),
      def('other_construction_com', 'Other', 'any other details'),
    ],
  },
  property_development: {
    required: [
      def('project_type', 'Project type', 'residential, commercial, mixed'),
      def('size_sqft', 'Project scale (sqft)', 'total or per unit'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'delivery timeline'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('num_units', 'Number of units', 'units or villas count'),
      def('development_phase', 'Phase', 'planning, execution, delivery'),
      def('delivery_model', 'Delivery model', 'turnkey, milestone, etc.'),
    ],
    optional: [
      def('vendor_pref', 'Vendor preference', 'if any'),
      def('compliance_focus', 'Compliance', 'RERA, approvals, etc.'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('location', 'Location', 'city / area'),
      def('risk_priorities', 'Risk priorities', 'cost, time, quality'),
      def('other_property', 'Other', 'any other details'),
    ],
  },
  home_automation: {
    required: [
      def('project_type', 'Project type', 'apartment, villa, independent house'),
      def('rooms', 'Rooms / scope', 'which rooms or whole home'),
      def('property_type', 'Property type', 'new, existing, under construction'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to complete'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('automation_scope', 'Automation scope', 'lighting, security, climate, full'),
      def('current_systems', 'Current systems', 'existing wiring, systems'),
    ],
    optional: [
      def('lighting_need', 'Lighting', 'smart lighting need'),
      def('security_need', 'Security', 'CCTV, access, alarms'),
      def('climate_need', 'Climate', 'AC, curtains, etc.'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key features'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('protocols', 'Protocols', 'preferred – Zigbee, Wi-Fi, etc.'),
      def('other_automation', 'Other', 'any other details'),
    ],
  },
  painting: {
    required: [
      def('project_type', 'Project type', 'residential, commercial, exterior, interior'),
      def('size_sqft', 'Area (sqft)', 'approx paintable area'),
      def('surface_type', 'Surface type', 'walls, ceiling, exterior, etc.'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'completion timeline'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('area_scope', 'Area scope', 'full house, specific rooms'),
      def('paint_type', 'Paint type', 'emulsion, enamel, texture, etc.'),
    ],
    optional: [
      def('color_preference', 'Color preference', 'colors or mood'),
      def('brand_preference', 'Brand preference', 'if any'),
      def('existing_paint', 'Existing paint', 'current finish type'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('waterproofing_need', 'Waterproofing', 'if needed'),
      def('other_painting', 'Other', 'any other details'),
    ],
  },
  solar_services: {
    required: [
      def('project_type', 'Project type', 'residential, commercial, industrial'),
      def('roof_type', 'Roof type', 'flat, slant, metal, etc.'),
      def('size_sqft', 'Roof / area (sqft)', 'available roof or area'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to install'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('capacity_kw', 'Capacity (kW)', 'desired or estimated kW'),
      def('grid_type', 'Grid type', 'on-grid, off-grid, hybrid'),
    ],
    optional: [
      def('battery_need', 'Battery', 'backup / battery need'),
      def('subsidy_interest', 'Subsidy', 'interest in subsidy schemes'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to install'),
      def('consumption_units', 'Consumption', 'approx units per month'),
      def('orientation', 'Orientation', 'roof orientation if known'),
      def('shade_issues', 'Shade', 'trees, shadows'),
      def('financing', 'Financing', 'loan / financing need'),
      def('other_solar', 'Other', 'any other details'),
    ],
  },
  electrical_services: {
    required: [
      def('project_type', 'Project type', 'residential, commercial'),
      def('scope_type', 'Scope', 'rewiring, new, audit, etc.'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to complete'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('load_requirement', 'Load requirement', 'approx load in kW'),
      def('current_system', 'Current system', 'existing wiring / DB'),
      def('safety_audit', 'Safety audit', 'need audit – yes/no'),
    ],
    optional: [
      def('backup_need', 'Backup', 'inverter / backup need'),
      def('automation_need', 'Automation', 'smart electrical need'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('property_age', 'Property age', 'if relevant'),
      def('wiring_type', 'Wiring type', 'concealed, surface'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('other_electrical', 'Other', 'any other details'),
    ],
  },
  plumbing_services: {
    required: [
      def('project_type', 'Project type', 'residential, commercial'),
      def('scope_type', 'Scope', 'new, repair, renovation, etc.'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to complete'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('water_source', 'Water source', 'municipal, borewell, etc.'),
      def('current_issues', 'Current issues', 'leaks, low pressure, etc.'),
      def('property_age', 'Property age', 'if relevant'),
    ],
    optional: [
      def('hot_water_need', 'Hot water', 'geyser, solar, etc.'),
      def('filter_need', 'Water filter', 'if needed'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('material_pref', 'Material preference', 'CPVC, PVC, etc.'),
      def('bathroom_count', 'Bathroom count', 'if relevant'),
      def('other_plumbing', 'Other', 'any other details'),
    ],
  },
  irrigation_automation: {
    required: [
      def('project_type', 'Project type', 'farm, garden, nursery, etc.'),
      def('land_size_sqft', 'Land size (sqft)', 'area to be irrigated'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to install'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('crop_type', 'Crop type', 'main crop or use'),
      def('water_source', 'Water source', 'borewell, canal, tank'),
      def('current_system', 'Current system', 'existing irrigation if any'),
    ],
    optional: [
      def('soil_type', 'Soil type', 'if known'),
      def('sensor_need', 'Sensors', 'soil moisture, weather'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('power_avail', 'Power availability', 'on grid, solar'),
      def('automation_level', 'Automation level', 'timer, smart, etc.'),
      def('other_irrigation', 'Other', 'any other details'),
    ],
  },
  event_management: {
    required: [
      def('project_type', 'Project type', 'corporate, wedding, social, etc.'),
      def('event_type', 'Event type', 'conference, wedding, product launch'),
      def('size_sqft', 'Venue / scale', 'approx size or guest area'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'event date / timeline'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('guest_count', 'Guest count', 'approx number of guests'),
      def('venue_type', 'Venue type', 'indoor, outdoor, hotel, etc.'),
    ],
    optional: [
      def('catering_need', 'Catering', 'in scope or separate'),
      def('av_need', 'AV / tech', 'sound, screen, etc.'),
      def('theme', 'Theme', 'theme or mood'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start planning'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('vendor_pref', 'Vendor preference', 'if any'),
      def('other_event', 'Other', 'any other details'),
    ],
  },
  farm_infrastructure: {
    required: [
      def('project_type', 'Project type', 'farm, dairy, poultry, etc.'),
      def('land_size', 'Land size', 'area in sqft or acres'),
      def('budget', 'Budget', 'budget in lakhs or INR'),
      def('timeline', 'Timeline', 'when to complete'),
      def('contact_pref', 'Contact method', 'phone or email'),
      def('callback_time', 'Callback time', 'when to call'),
      def('primary_use', 'Primary use', 'main activity or crop'),
      def('water_source', 'Water source', 'borewell, canal, etc.'),
      def('power_avail', 'Power availability', 'grid, solar, etc.'),
    ],
    optional: [
      def('irrigation_need', 'Irrigation', 'need irrigation setup'),
      def('greenhouse_need', 'Greenhouse', 'if needed'),
      def('storage_need', 'Storage', 'godown, cold storage'),
      def('notes', 'Notes', 'other requirements'),
      def('preferred_start', 'Preferred start', 'when to start'),
      def('must_haves', 'Must-haves', 'key requirements'),
      def('avoid', 'Avoid', 'what to avoid'),
      def('structures', 'Structures', 'sheds, boundary, etc.'),
      def('other_farm', 'Other', 'any other details'),
    ],
  },
};

function toDatapoint(p: ParamDef, priority: number): CharacterDatapoint {
  return { id: p.id, label: p.label, hint: p.hint, priority };
}

/** Required parameter ids for the service (for coverage). */
export function getRequiredIdsForService(service: string): string[] {
  const s = SERVICE_PARAMS[service];
  if (!s) return [];
  return s.required.map((r) => r.id);
}

/** Optional parameter ids for the service. */
export function getOptionalIdsForService(service: string): string[] {
  const s = SERVICE_PARAMS[service];
  if (!s) return [];
  return s.optional.map((o) => o.id);
}

/** All 18 datapoints (9 required + 9 optional) for the service. Used by conversation and extraction. */
export function getDatapointsForService(service: string): CharacterDatapoint[] {
  const s = SERVICE_PARAMS[service];
  if (!s) return [];
  const required = s.required.map((r) => toDatapoint(r, 1));
  const optional = s.optional.map((o) => toDatapoint(o, 2));
  return [...required, ...optional];
}

/** Check if this service has a defined parameter set (9+9). */
export function hasServiceParams(service: string): boolean {
  return !!SERVICE_PARAMS[service];
}
