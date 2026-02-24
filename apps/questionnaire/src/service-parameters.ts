/**
 * Per-service 9 required + 9 optional parameters (development and sale ready).
 * Single source of truth for coverage policy and conversation datapoints.
 */
import type { CharacterDatapoint } from './types/character';

type ParamDef = { id: string; label: string; hint: string };

function def(id: string, label: string, hint: string): ParamDef {
  return { id, label, hint };
}

/** 9 required + 9 optional per service. All labels and hints are service-specific. */
const SERVICE_PARAMS: Record<string, { required: ParamDef[]; optional: ParamDef[] }> = {
  residential_interiors: {
    required: [
      def('project_type', 'Type of home (residential interiors)', 'flat/apartment, villa, independent house, penthouse'),
      def('rooms', 'BHK / room count (residential)', '2BHK, 3BHK, 4BHK, specific rooms to design'),
      def('size_sqft', 'Carpet area for interior (sqft)', 'actual or approx carpet area in sqft'),
      def('style', 'Interior style preference', 'modern, traditional, minimal, japandi, contemporary, neo-indian, eclectic'),
      def('budget', 'Interior design + execution budget', 'total in lakhs/INR for design and execution'),
      def('timeline', 'When interior work to be completed', 'days, weeks, or months to completion'),
      def('contact_pref', 'How to reach you', 'phone call, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today evening, tomorrow, specific time'),
      def('preferred_start', 'When you want interior work to start', 'ASAP, next month, after monsoon, etc.'),
    ],
    optional: [
      def('must_haves', 'Must-haves for this interior', 'wardrobes, false ceiling, specific materials, colors'),
      def('avoid', 'What to avoid in this interior', 'materials, colors, or elements they don’t want'),
      def('site_ready', 'Is the site ready for interior work', 'yes/no – possession, demolition done'),
      def('storage_needs', 'Storage requirements', 'wardrobes, lofts, modular storage, shoe rack'),
      def('lighting_pref', 'Lighting preference', 'warm white, cool white, natural, dimmable'),
      def('notes', 'Special focus (residential interior)', 'kids room, pooja room, home office, pet-friendly'),
      def('moodboard_refs', 'Inspiration / moodboard', 'Pinterest links, reference images, mood'),
      def('special_zones', 'Priority zones', 'living room, master bedroom, kitchen, balcony'),
      def('material_preference', 'Material preference (interior)', 'wood, laminate, veneer, tiles, marble'),
    ],
  },
  residential_construction: {
    required: [
      def('project_type', 'Type of construction (residential)', 'villa, independent house, duplex, row house'),
      def('plot_size_sqft', 'Plot size or built-up area (sqft)', 'plot area and/or built-up in sqft'),
      def('floors', 'Number of floors (G+?)', 'G+1, G+2, G+3, etc.'),
      def('budget', 'Full construction budget', 'total in lakhs/INR for complete build'),
      def('timeline', 'Construction completion timeline', 'target months to complete build'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('has_soil_test', 'Soil test completed for plot', 'yes/no – soil test done for foundation'),
      def('has_approvals', 'Building plan / sanctions', 'yes/no – sanctioned plan or approval status'),
    ],
    optional: [
      def('material_grade', 'Construction material grade', 'standard, premium, luxury – finish level'),
      def('foundation_type', 'Foundation type', 'isolated, combined, raft – if known'),
      def('sustainability', 'Green / sustainability needs', 'rainwater harvesting, solar-ready, eco materials'),
      def('notes', 'Other construction requirements', 'Vastu, specific room sizes, etc.'),
      def('preferred_start', 'When to start construction', 'ASAP, after rains, next quarter'),
      def('location', 'Site location (city/area)', 'city and area for site visit'),
      def('power_water_avail', 'Power and water at site', 'electricity connection, water source availability'),
      def('contractor_pref', 'Contractor / execution preference', 'self, contractor, turnkey'),
      def('other_construction', 'Any other construction detail', 'boundary, compound, etc.'),
    ],
  },
  commercial_interiors: {
    required: [
      def('project_type', 'Type of commercial space', 'office, retail, restaurant, clinic, salon, showroom, coworking'),
      def('size_sqft', 'Carpet area for fit-out (sqft)', 'usable interior area in sqft'),
      def('space_use', 'Primary use of the space', 'workplace, retail, F&B, healthcare, hospitality'),
      def('budget', 'Commercial fit-out budget', 'total in lakhs/INR for interior fit-out'),
      def('timeline', 'Fit-out / move-in timeline', 'target completion or move-in date'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('brand_theme', 'Brand or visual theme', 'brand guidelines, colors, logo usage, vibe'),
      def('occupancy', 'Occupancy / headcount', 'number of employees, seats, or visitors'),
    ],
    optional: [
      def('must_haves', 'Must-haves for fit-out', 'meeting rooms, pantry, reception, cabin count'),
      def('avoid', 'What to avoid in fit-out', 'materials, styles, or elements'),
      def('furniture_need', 'Furniture in scope', 'included in fit-out or client providing'),
      def('av_need', 'AV and tech in scope', 'screens, video conferencing, sound, WiFi'),
      def('notes', 'Other commercial requirements', 'shift timings, security, access'),
      def('preferred_start', 'When fit-out should start', 'ASAP, after tenant, next month'),
      def('compliance', 'Compliance requirements', 'fire safety, accessibility, local norms'),
      def('special_zones', 'Key zones (commercial)', 'reception, cabins, breakout, server room'),
      def('other_commercial', 'Any other commercial detail', 'signage, branding, etc.'),
    ],
  },
  commercial_construction: {
    required: [
      def('project_type', 'Type of commercial building', 'office building, warehouse, retail, mixed-use, factory shed'),
      def('size_sqft', 'Built-up area (sqft)', 'total built-up or plinth area in sqft'),
      def('budget', 'Commercial construction budget', 'total in lakhs/INR for structure/build'),
      def('timeline', 'Build / handover timeline', 'target completion or phase handover'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('construction_type', 'Construction type', 'new build, extension, shell & core, RCC frame'),
      def('delivery_phase', 'Scope of delivery', 'design only, structure only, MEP, turnkey'),
      def('contract_type', 'Contract type preferred', 'lump sum, item rate, design-build, EPC'),
    ],
    optional: [
      def('mep_scope', 'MEP in scope', 'electrical, plumbing, HVAC, fire fighting – what’s in scope'),
      def('compliance_focus', 'Compliance / codes', 'local building norms, green rating, fire NOC'),
      def('notes', 'Other build requirements', 'loading docks, ceiling height, etc.'),
      def('preferred_start', 'When construction to start', 'ASAP, next quarter, after approval'),
      def('must_haves', 'Must-haves for build', 'crane, basement, specific finishes'),
      def('avoid', 'What to avoid', 'materials, methods, or constraints'),
      def('site_conditions', 'Site conditions', 'soil, water table, access, existing structures'),
      def('vendor_pref', 'Vendor / contractor preference', 'if any preferred or blacklisted'),
      def('other_construction_com', 'Any other commercial build detail', ''),
    ],
  },
  property_development: {
    required: [
      def('project_type', 'Type of development', 'residential project, commercial, mixed-use, plotted, villa layout'),
      def('size_sqft', 'Project scale (sqft)', 'total land/ built-up or per unit in sqft'),
      def('budget', 'Development budget', 'total in lakhs/INR for project/phase'),
      def('timeline', 'Delivery / phase timeline', 'target completion or phase-wise delivery'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('num_units', 'Number of units / plots', 'count of flats, villas, or plots'),
      def('development_phase', 'Current development phase', 'planning, design, execution, delivery'),
      def('delivery_model', 'Delivery model', 'turnkey, milestone-based, joint venture'),
    ],
    optional: [
      def('vendor_pref', 'Vendor / partner preference', 'preferred contractors, consultants'),
      def('compliance_focus', 'Compliance (property dev)', 'RERA, local approvals, environmental'),
      def('notes', 'Other development requirements', 'marketing, sales, handover'),
      def('preferred_start', 'When development to start', 'ASAP, after approval, next financial year'),
      def('must_haves', 'Must-haves for project', 'amenities, specifications, branding'),
      def('avoid', 'What to avoid', 'delays, cost overruns, specific vendors'),
      def('location', 'Project location', 'city, zone, micro-market'),
      def('risk_priorities', 'Risk priorities', 'cost vs time vs quality focus'),
      def('other_property', 'Any other property development detail', ''),
    ],
  },
  home_automation: {
    required: [
      def('project_type', 'Property type (for automation)', 'apartment, villa, independent house'),
      def('rooms', 'Rooms / zones for automation', 'whole home, living + bedrooms, specific rooms'),
      def('property_type', 'Property stage', 'new construction, existing home, under renovation'),
      def('budget', 'Smart home / automation budget', 'total in lakhs/INR for automation system'),
      def('timeline', 'When to complete automation', 'ASAP, with interior, phase-wise'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('automation_scope', 'What to automate', 'lighting, security, climate, curtains, full home'),
      def('current_systems', 'Existing electrical / systems', 'wiring age, DB, existing switches, ACs'),
    ],
    optional: [
      def('lighting_need', 'Smart lighting need', 'dimmers, scenes, color, switches'),
      def('security_need', 'Security automation', 'CCTV, door access, sensors, alarms'),
      def('climate_need', 'Climate / comfort', 'AC control, curtains, sensors'),
      def('notes', 'Other automation requirements', 'voice control, app preference'),
      def('preferred_start', 'When to start automation work', 'ASAP, after interior, next month'),
      def('must_haves', 'Must-haves (automation)', 'voice, app, no cloud, etc.'),
      def('avoid', 'What to avoid', 'brands, cloud-only, wireless-only'),
      def('protocols', 'Preferred protocols', 'Zigbee, Z-Wave, Wi-Fi, wired KNX'),
      def('other_automation', 'Any other automation detail', ''),
    ],
  },
  painting: {
    required: [
      def('project_type', 'Painting project type', 'residential interior, exterior, commercial, both'),
      def('size_sqft', 'Paintable area (sqft)', 'wall + ceiling area or approx sqft to paint'),
      def('surface_type', 'Surface to paint', 'interior walls, ceiling, exterior walls, metal, wood'),
      def('budget', 'Painting work budget', 'total in lakhs/INR for paint + labour'),
      def('timeline', 'When painting to be done', 'completion date or handover'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('area_scope', 'Which areas to paint', 'full house, specific rooms, exterior only, common areas'),
      def('paint_type', 'Type of paint / finish', 'emulsion, enamel, texture, waterproofing, primer'),
    ],
    optional: [
      def('color_preference', 'Color / shade preference', 'specific colors, light/dark, mood'),
      def('brand_preference', 'Paint brand preference', 'Asian Paints, Berger, Dulux, or flexible'),
      def('existing_paint', 'Current paint on surface', 'emulsion, distemper, need scraping'),
      def('notes', 'Other painting requirements', 'child-safe, washable, etc.'),
      def('preferred_start', 'When to start painting', 'ASAP, after repair, next week'),
      def('must_haves', 'Must-haves (painting)', 'odorless, quick dry, warranty'),
      def('avoid', 'What to avoid', 'certain brands, colors, or methods'),
      def('waterproofing_need', 'Waterproofing / exterior', 'terrace, bathroom, exterior waterproofing'),
      def('other_painting', 'Any other painting detail', ''),
    ],
  },
  solar_services: {
    required: [
      def('project_type', 'Solar installation type', 'residential rooftop, commercial, industrial, ground mount'),
      def('roof_type', 'Roof type for solar', 'flat RCC, slant, metal sheet, terrace'),
      def('size_sqft', 'Available roof / area for panels (sqft)', 'unshaded area for panels in sqft'),
      def('budget', 'Solar system budget', 'total in lakhs/INR for panels + inverter + installation'),
      def('timeline', 'When to install solar', 'ASAP, next month, after monsoon'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('capacity_kw', 'Desired solar capacity (kW)', 'target kW or "suggest based on consumption"'),
      def('grid_type', 'Grid connection type', 'on-grid (net meter), off-grid, hybrid with battery'),
    ],
    optional: [
      def('battery_need', 'Battery backup need', 'yes/no – backup during power cut'),
      def('subsidy_interest', 'Subsidy / scheme interest', 'central/state subsidy, PM Surya Ghar'),
      def('notes', 'Other solar requirements', 'export limit, three-phase, etc.'),
      def('preferred_start', 'Preferred installation start', 'ASAP, next quarter'),
      def('consumption_units', 'Current electricity consumption', 'units per month from bill'),
      def('orientation', 'Roof orientation', 'south, east-west, north – if known'),
      def('shade_issues', 'Shade on roof', 'trees, adjacent building, water tank'),
      def('financing', 'Financing need', 'loan, EMI, upfront – how to pay'),
      def('other_solar', 'Any other solar detail', ''),
    ],
  },
  electrical_services: {
    required: [
      def('project_type', 'Electrical work type', 'residential, commercial, industrial'),
      def('scope_type', 'Scope of electrical work', 'full rewiring, new installation, load upgrade, audit'),
      def('budget', 'Electrical work budget', 'total in lakhs/INR for labour + material'),
      def('timeline', 'When to complete electrical work', 'ASAP, with renovation, phase-wise'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('load_requirement', 'Connected / required load (kW)', 'existing sanctioned load or new requirement'),
      def('current_system', 'Current electrical setup', 'wiring age, DB capacity, meter type'),
      def('safety_audit', 'Electrical safety audit needed', 'yes/no – need audit before work'),
    ],
    optional: [
      def('backup_need', 'Backup / inverter need', 'inverter capacity, battery, solar integration'),
      def('automation_need', 'Smart / automation need', 'smart switches, home automation scope'),
      def('notes', 'Other electrical requirements', 'dedicated lines, surge protection'),
      def('preferred_start', 'When to start electrical work', 'ASAP, after demolition'),
      def('property_age', 'Property / building age', 'years – for wiring condition context'),
      def('wiring_type', 'Wiring preference', 'concealed, surface, PVC, FR'),
      def('must_haves', 'Must-haves (electrical)', 'MCB upgrade, earthing, dedicated points'),
      def('avoid', 'What to avoid', 'certain brands, methods'),
      def('other_electrical', 'Any other electrical detail', ''),
    ],
  },
  plumbing_services: {
    required: [
      def('project_type', 'Plumbing work type', 'residential, commercial, society'),
      def('scope_type', 'Scope of plumbing work', 'new plumbing, repair, renovation, bathroom addition'),
      def('budget', 'Plumbing work budget', 'total in lakhs/INR for labour + material'),
      def('timeline', 'When to complete plumbing', 'ASAP, with renovation, specific date'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('water_source', 'Water source at property', 'municipal, borewell, overhead tank, sump'),
      def('current_issues', 'Current plumbing issues', 'leak, low pressure, blockage, no water'),
      def('property_age', 'Property / building age', 'years – for pipe condition and replacement'),
    ],
    optional: [
      def('hot_water_need', 'Hot water requirement', 'geyser count, solar, instant heater'),
      def('filter_need', 'Water filter / purification', 'RO, UV, whole house – if needed'),
      def('notes', 'Other plumbing requirements', 'concealed pipes, chase, etc.'),
      def('preferred_start', 'When to start plumbing work', 'ASAP, after tiling'),
      def('must_haves', 'Must-haves (plumbing)', 'CPVC only, no lead, warranty'),
      def('avoid', 'What to avoid', 'certain materials, open pipes'),
      def('material_pref', 'Pipe material preference', 'CPVC, PVC, PPR, galvanized'),
      def('bathroom_count', 'Number of bathrooms', 'for scope and quote'),
      def('other_plumbing', 'Any other plumbing detail', ''),
    ],
  },
  irrigation_automation: {
    required: [
      def('project_type', 'Irrigation project type', 'farm, garden, lawn, nursery, orchard'),
      def('land_size_sqft', 'Area to irrigate (sqft)', 'total land or plot size in sqft'),
      def('budget', 'Irrigation system budget', 'total in lakhs/INR for drip/sprinkler + automation'),
      def('timeline', 'When to install irrigation', 'ASAP, before season, next month'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('crop_type', 'Crop or plantation type', 'field crop, vegetable, lawn, horticulture, flowers'),
      def('water_source', 'Water source for irrigation', 'borewell, canal, tank, open well, municipal'),
      def('current_system', 'Existing irrigation (if any)', 'none, manual, drip, sprinkler, flood'),
    ],
    optional: [
      def('soil_type', 'Soil type', 'clay, loam, sandy – if known'),
      def('sensor_need', 'Sensor need', 'soil moisture, weather, flow – yes/no'),
      def('notes', 'Other irrigation requirements', 'slope, zones, organic'),
      def('preferred_start', 'When to start irrigation work', 'ASAP, next season'),
      def('must_haves', 'Must-haves (irrigation)', 'drip only, fertigation, mobile control'),
      def('avoid', 'What to avoid', 'overhead in certain areas, etc.'),
      def('power_avail', 'Power at site', 'grid, solar, no power'),
      def('automation_level', 'Automation level', 'manual timer, smart schedule, app control'),
      def('other_irrigation', 'Any other irrigation detail', ''),
    ],
  },
  event_management: {
    required: [
      def('project_type', 'Type of event', 'corporate, wedding, social, product launch, conference'),
      def('event_type', 'Event format', 'conference, wedding, seminar, party, exhibition, award night'),
      def('size_sqft', 'Venue size / scale (sqft)', 'approx venue or seating area in sqft'),
      def('budget', 'Event budget', 'total in lakhs/INR for event management'),
      def('timeline', 'Event date / planning timeline', 'event date or "need to fix date"'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('guest_count', 'Expected guest count', 'approx number of guests or attendees'),
      def('venue_type', 'Venue type', 'indoor, outdoor, hotel, farmhouse, auditorium, lawn'),
    ],
    optional: [
      def('catering_need', 'Catering in scope', 'included in package or separate vendor'),
      def('av_need', 'AV and tech need', 'sound, mics, screen, LED, recording'),
      def('theme', 'Event theme / mood', 'corporate, traditional, theme party'),
      def('notes', 'Other event requirements', 'VIP, protocol, branding'),
      def('preferred_start', 'When to start planning', 'ASAP, months before event'),
      def('must_haves', 'Must-haves (event)', 'certain venue, celebrity, live band'),
      def('avoid', 'What to avoid', 'certain cuisines, venues, or elements'),
      def('vendor_pref', 'Vendor / artist preference', 'preferred or blacklisted'),
      def('other_event', 'Any other event detail', ''),
    ],
  },
  farm_infrastructure: {
    required: [
      def('project_type', 'Farm / agri project type', 'farm, dairy, poultry, mixed agri, aquaculture'),
      def('land_size', 'Land size (sqft or acres)', 'total farm or plot area'),
      def('budget', 'Farm infrastructure budget', 'total in lakhs/INR for structures and setup'),
      def('timeline', 'When to complete farm infra', 'ASAP, before season, phase-wise'),
      def('contact_pref', 'How to reach you', 'phone, WhatsApp, or email'),
      def('callback_time', 'When to call you back', 'now, today, tomorrow, specific time'),
      def('primary_use', 'Primary farm activity', 'main crop, dairy, poultry, mixed'),
      def('water_source', 'Water source on farm', 'borewell, canal, pond, tank, open well'),
      def('power_avail', 'Power at farm', 'grid, solar, generator, no power'),
    ],
    optional: [
      def('irrigation_need', 'Irrigation setup need', 'drip, sprinkler, full irrigation – yes/no'),
      def('greenhouse_need', 'Greenhouse / polyhouse', 'if needed – size or yes/no'),
      def('storage_need', 'Storage requirement', 'godown, cold storage, silo'),
      def('notes', 'Other farm requirements', 'organic, certification, labour'),
      def('preferred_start', 'When to start farm work', 'ASAP, next season'),
      def('must_haves', 'Must-haves (farm infra)', 'shed size, flooring, ventilation'),
      def('avoid', 'What to avoid', 'certain materials, designs'),
      def('structures', 'Structures needed', 'cattle shed, boundary, warehouse, pump house'),
      def('other_farm', 'Any other farm infra detail', ''),
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

/** Service-specific parameter id → display label for UI and summaries. */
export function getParameterLabelsForService(service: string): Record<string, string> {
  const s = SERVICE_PARAMS[service];
  if (!s) return {};
  const out: Record<string, string> = {};
  for (const r of s.required) out[r.id] = r.label;
  for (const o of s.optional) out[o.id] = o.label;
  return out;
}
