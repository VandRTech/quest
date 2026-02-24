/**
 * Summary Generator - Generates structured 6-section summary from collected parameters
 */

import { geminiAPIClient } from '@tatvaops/ai';
import { serviceParameters } from './parameters';
import { getParameterLabelsForService } from './service-parameters';
import { QuestionnaireDoc, SixPointSummary } from './models/Questionnaire';
import type { Message } from './models/Questionnaire';

export interface ProjectSummary {
  projectOverview: string;
  scopeOfWork: string;
  clientRequirements: string;
  technicalSpecs: string;
  timeline: string;
  specialConsiderations: string;
  estimatedScope: string;
  /** One clear line: what to do first to initiate the project (call client, site visit, proposal, etc.) */
  initiationNextStep?: string;
}

const serviceDisplayNames: Record<string, string> = {
  residential_interiors: 'Residential Interiors',
  commercial_interiors: 'Commercial Interiors & Fit-Out',
  commercial_construction: 'Commercial Construction',
  property_development: 'Property Development',
  residential_construction: 'Residential Construction',
  home_automation: 'Home Automation',
  painting: 'Painting & Finishes',
  solar_services: 'Solar Services',
  electrical_services: 'Electrical Services',
  irrigation_automation: 'Irrigation Automation',
  event_management: 'Event Management',
  farm_infrastructure: 'Farm Infrastructure',
  plumbing_services: 'Plumbing Services',
};

const paramLabelMap: Record<string, string> = {
  project_type: 'Project type',
  rooms: 'Rooms / BHK',
  size_sqft: 'Area (sqft)',
  style: 'Style',
  budget: 'Budget',
  timeline: 'Timeline',
  contact_pref: 'Contact preference',
  callback_time: 'Callback time',
  must_haves: 'Must-haves',
  avoid: 'Avoid',
  notes: 'Notes',
  site_ready: 'Site ready',
  moodboard_refs: 'Moodboard refs',
  preferred_start: 'Preferred start',
  plot_size_sqft: 'Plot size (sqft)',
  floors: 'Number of floors',
  has_soil_test: 'Soil test',
  has_approvals: 'Approvals',
  space_use: 'Space use',
  brand_theme: 'Brand / theme',
  occupancy: 'Occupancy',
  construction_type: 'Construction type',
  delivery_phase: 'Delivery phase',
  contract_type: 'Contract type',
  num_units: 'Number of units',
  delivery_model: 'Delivery model',
  automation_scope: 'Automation scope',
  current_systems: 'Current systems',
  surface_type: 'Surface type',
  area_scope: 'Area scope',
  paint_type: 'Paint type',
  roof_type: 'Roof type',
  capacity_kw: 'Capacity (kW)',
  grid_type: 'Grid type',
  scope_type: 'Scope',
  load_requirement: 'Load requirement',
  current_system: 'Current system',
  safety_audit: 'Safety audit',
  water_source: 'Water source',
  current_issues: 'Current issues',
  property_age: 'Property age',
  land_size_sqft: 'Land size (sqft)',
  crop_type: 'Crop type',
  event_type: 'Event type',
  guest_count: 'Guest count',
  venue_type: 'Venue type',
  primary_use: 'Primary use',
  power_avail: 'Power availability',
};

export async function generateProjectSummary(
  service: string,
  parameters: Record<string, string>,
  transcript?: Message[]
): Promise<ProjectSummary> {
  const serviceName = serviceDisplayNames[service] || service.replace(/_/g, ' ');
  const params = serviceParameters[service] || [];
  const serviceLabels = getParameterLabelsForService(service);

  const paramSummary = Object.entries(parameters)
    .map(([key, value]) => {
      const label = serviceLabels[key] || paramLabelMap[key] || params.find(p => p.id === key)?.label || key.replace(/_/g, ' ');
      return `- ${label}: ${value}`;
    })
    .join('\n');

  // 1-2 line summary purely from conversation (when transcript provided)
  if (transcript && transcript.length > 0) {
    const conversationText = transcript
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const systemPrompt = `You are a project consultant. Write a single 1-2 line summary of what the client needs and what was agreed.

CONVERSATION (what was actually said):
${conversationText}

COLLECTED DATA (for reference only – do not list; use only what was discussed):
${paramSummary}

SERVICE: ${serviceName}

RULES:
- Output exactly 1-2 short lines. No more.
- Base the summary purely on what was said in the conversation. Use the client's words and specifics (numbers, preferences, timeline) where they mentioned them.
- No generic filler like "as discussed" or "the client is interested in". Be concrete: e.g. "3BHK interior, 4L budget, modern style, call tomorrow."
- Return JSON only: { "summary": "your 1-2 line summary here" }`;

    try {
      const response = await geminiAPIClient.generateText({
        model: 'gemini-2.5-flash',
        system: systemPrompt,
        user: 'Generate the 1-2 line summary JSON from the conversation.',
        temperature: 0.2,
      });

      const responseText = String(response.data);
      let jsonStr = responseText;
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();

      const parsed = JSON.parse(jsonStr);
      const oneLiner = (parsed.summary || '').trim() || `${serviceName} inquiry – details from conversation.`;

      const callbackTime = parameters.callback_time || '';
      const contactPref = parameters.contact_pref || 'phone';
      const defaultNextStep =
        callbackTime && contactPref
          ? `Call client ${callbackTime} via ${contactPref}.`
          : `Follow up via ${contactPref || 'phone'}.`;

      return {
        projectOverview: oneLiner,
        scopeOfWork: oneLiner,
        clientRequirements: oneLiner,
        technicalSpecs: '--',
        timeline: parameters.timeline || parameters.timelineExpectation || '--',
        specialConsiderations: '--',
        estimatedScope: [parameters.budget && `Budget: ${parameters.budget}`, parameters.size_sqft && parameters.size_sqft].filter(Boolean).join(' | ') || '--',
        initiationNextStep: defaultNextStep,
      };
    } catch (err) {
      console.error('Error generating conversation summary:', err);
      return generateFallbackSummary(service, parameters, true);
    }
  }

  // No transcript: short fallback from params only
  return generateFallbackSummary(service, parameters, true);
}

function generateFallbackSummary(
  service: string,
  parameters: Record<string, string>,
  shortOneTwoLine?: boolean
): ProjectSummary {
  const serviceName = serviceDisplayNames[service] || service.replace(/_/g, ' ');
  const area = parameters.size_sqft || parameters.areaSqft || parameters.carpetAreaSqft || parameters.builtUpAreaSqft ||
               parameters.plotSize || parameters.totalAreaSqft || parameters.availableRoofAreaSqft || parameters.plot_size_sqft || parameters.land_size_sqft || '';
  const budget = parameters.budget || parameters.budgetRange || parameters.budgetTier || parameters.budgetBrandFlexibility || '';
  const timeline = parameters.timeline || parameters.timelineExpectation || parameters.installationTimeline ||
                   parameters.accessTimeline || '';
  const spaceType = parameters.project_type || parameters.spaceType || parameters.propertyType || parameters.projectType ||
                    parameters.homeType || parameters.eventType || '';

  const initiationNextStep =
    parameters.callback_time && parameters.contact_pref
      ? `Call client ${parameters.callback_time} via ${parameters.contact_pref}.`
      : `Follow up via ${parameters.contact_pref || 'phone'}.`;

  if (shortOneTwoLine) {
    const line = [serviceName, spaceType, area && `${area} sqft`, budget && `${budget}`, timeline].filter(Boolean).join(' · ');
    const oneLiner = line || `${serviceName} project.`;
    return {
      projectOverview: oneLiner,
      scopeOfWork: oneLiner,
      clientRequirements: oneLiner,
      technicalSpecs: '--',
      timeline: timeline || '--',
      specialConsiderations: '--',
      estimatedScope: [area && `Size: ${area}`, budget && `Budget: ${budget}`].filter(Boolean).join(' | ') || '--',
      initiationNextStep,
    };
  }

  return {
    projectOverview: `${serviceName} project${spaceType ? ` for ${spaceType}` : ''}${area ? `, ${area}` : ''}`,
    scopeOfWork: '--',
    clientRequirements: `Budget: ${budget || 'Not specified'} | Timeline: ${timeline || 'Flexible'}`,
    technicalSpecs: '--',
    timeline: timeline || '--',
    specialConsiderations: '--',
    estimatedScope: `${area || 'Size not specified'} | ${budget || 'Budget not specified'}`,
    initiationNextStep,
  };
}

// ============================================================================
// 6-POINT SUMMARY GENERATOR (Auto-generated on conversation completion)
// ============================================================================

export async function generateSixPointSummary(doc: QuestionnaireDoc): Promise<SixPointSummary> {
  const serviceName = serviceDisplayNames[doc.service] || doc.service.replace(/_/g, ' ');
  
  // Flatten parameters
  const flatParams: Record<string, string> = {};
  Object.entries(doc.parameters || {}).forEach(([key, val]) => {
    if (typeof val === 'object' && val !== null && 'value' in val) {
      flatParams[key] = String(val.value);
    } else {
      flatParams[key] = String(val);
    }
  });

  // Build parameter summary
  const paramSummary = Object.entries(flatParams)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  // Build conversation summary
  const conversationLength = doc.transcript?.length || 0;
  const userMessages = doc.transcript?.filter(m => m.role === 'user').length || 0;
  
  // Mood analysis
  const moodMeta = doc.conversationMeta;
  const moodSummary = getMoodAnalysisSummary(moodMeta);

  const systemPrompt = `You are an executive assistant creating a concise 6-point summary for a project manager.

SERVICE: ${serviceName}
CHANNEL: ${doc.channel || 'web'}

COLLECTED DATA:
${paramSummary}

CONVERSATION STATS:
- Total turns: ${conversationLength}
- User messages: ${userMessages}
- Duration: ${getConversationDuration(doc)}

MOOD ANALYSIS:
${moodSummary}

Generate a JSON with exactly 6 fields. Each should be 1-2 sentences max:

{
  "clientProfile": "Brief client description - contact preference, communication style, urgency level",
  "projectScope": "What they want - type, size, style in one line",
  "keyRequirements": "Must-haves, special focus areas, things to avoid",
  "budgetTimeline": "Budget and timeline in simple format",
  "conversationInsights": "How the conversation went - was client clear, confused, rushed? Any friction points?",
  "nextSteps": "Recommended follow-up action based on their contact preference and callback time"
}

Be factual and concise. No fluff. Return JSON only.`;

  try {
    const response = await geminiAPIClient.generateText({
      model: 'gemini-2.5-flash',
      system: systemPrompt,
      user: 'Generate the 6-point summary JSON.',
      temperature: 0.25,
    });

    const responseText = String(response.data);
    
    // Extract JSON
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    
    return {
      clientProfile: parsed.clientProfile || '--',
      projectScope: parsed.projectScope || '--',
      keyRequirements: parsed.keyRequirements || '--',
      budgetTimeline: parsed.budgetTimeline || '--',
      conversationInsights: parsed.conversationInsights || '--',
      nextSteps: parsed.nextSteps || '--',
      generatedAt: new Date(),
      moodSummary: moodSummary,
    };
  } catch (error) {
    console.error('Error generating 6-point summary:', error);
    return generateFallbackSixPointSummary(doc, flatParams, moodSummary);
  }
}

function getMoodAnalysisSummary(moodMeta: QuestionnaireDoc['conversationMeta']): string {
  if (!moodMeta || !moodMeta.moodHistory || moodMeta.moodHistory.length === 0) {
    return 'No mood data available';
  }

  const moodCounts: Record<string, number> = {};
  moodMeta.moodHistory.forEach(mood => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const dominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  const frustrationLevel = moodCounts['frustrated'] || 0;
  const positiveLevel = moodCounts['positive'] || 0;
  const totalTurns = moodMeta.moodHistory.length;

  let sentiment = 'neutral';
  if (positiveLevel > totalTurns * 0.5) sentiment = 'positive';
  else if (frustrationLevel > 0) sentiment = 'had friction';
  else if (moodCounts['rushed'] > totalTurns * 0.3) sentiment = 'was rushed';
  else if (moodCounts['uncertain'] > totalTurns * 0.3) sentiment = 'needed guidance';

  return `Dominant mood: ${dominantMood} | Overall sentiment: ${sentiment} | Frustration points: ${frustrationLevel} | Positive moments: ${positiveLevel}`;
}

function getConversationDuration(doc: QuestionnaireDoc): string {
  if (!doc.createdAt || !doc.updatedAt) return 'Unknown';
  
  const start = new Date(doc.createdAt).getTime();
  const end = new Date(doc.updatedAt).getTime();
  const durationMs = end - start;
  
  if (durationMs < 60000) return 'Less than 1 minute';
  if (durationMs < 3600000) return `${Math.round(durationMs / 60000)} minutes`;
  return `${Math.round(durationMs / 3600000)} hours`;
}

function generateFallbackSixPointSummary(
  doc: QuestionnaireDoc,
  params: Record<string, string>,
  moodSummary: string
): SixPointSummary {
  const serviceName = serviceDisplayNames[doc.service] || doc.service.replace(/_/g, ' ');
  
  return {
    clientProfile: `${doc.channel || 'Web'} inquiry | Contact: ${params.contact_pref || 'Not specified'}`,
    projectScope: `${serviceName} - ${params.project_type || params.spaceType || 'Type not specified'} | ${params.rooms || ''} | ${params.size_sqft || params.areaSqft || 'Size not specified'}`,
    keyRequirements: `Style: ${params.style || 'Not specified'} | Focus: ${params.notes || params.must_haves || 'None specified'}`,
    budgetTimeline: `Budget: ${params.budget || params.budgetRange || 'Not specified'} | Timeline: ${params.timeline || 'Flexible'}`,
    conversationInsights: `${doc.transcript?.length || 0} turns | ${moodSummary}`,
    nextSteps: params.callback_time 
      ? `Call client ${params.callback_time} via ${params.contact_pref || 'phone'}`
      : `Follow up via ${params.contact_pref || 'phone'}`,
    generatedAt: new Date(),
    moodSummary: moodSummary,
  };
}

