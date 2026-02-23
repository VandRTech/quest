import { Router } from 'express';
import { QuestionnaireStore } from './models/Questionnaire';
import { pickCharacter } from '@tatvaops/core';
import { config } from './config';
import { postCompletion } from './webhook';
import { router as adminRouter } from './admin.routes';
import { generateProjectSummary, ProjectSummary } from './summary-generator';
import { getCharacter } from './engine/characterRegistry';
import {
  extractDatapointsFromMessage,
  applyExtracted,
  generateAssistantReply,
} from './engine/conversation';
import { getRequiredFieldsForService } from './engine/coverage-policy';

export const router = Router();

/** Service-specific intro label for first reply (dynamic flow for all services) */
const SERVICE_OPENING_LABELS: Record<string, string> = {
  residential_interiors: 'interior design',
  commercial_interiors: 'commercial interiors',
  commercial_construction: 'commercial construction',
  property_development: 'property development',
  residential_construction: 'residential construction',
  home_automation: 'home automation',
  painting: 'painting',
  solar_services: 'solar',
  electrical_services: 'electrical',
  irrigation_automation: 'irrigation',
  event_management: 'event',
  farm_infrastructure: 'farm infrastructure',
  plumbing_services: 'plumbing',
};

function getOpeningForService(service: string, character: { name?: string; language?: { openingPhrases?: string[] } }): string {
  const name = character.name?.split(' ')[0] || 'Aadhya';
  const fromCharacter = character.language?.openingPhrases?.[0];
  if (fromCharacter && service === 'residential_interiors') return fromCharacter;
  const label = SERVICE_OPENING_LABELS[service] || service.replace(/_/g, ' ');
  return `Hi! I'm ${name}, your ${label} consultant.`;
}

/** Flatten parameters for summary/webhook: unwrap { value, confidence } to plain values */
function flattenParameters(parameters: Record<string, any>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(parameters || {})) {
    if (val == null) continue;
    const v = typeof val === 'object' && val !== null && 'value' in val ? val.value : val;
    out[key] = String(v);
  }
  return out;
}

// Health
router.get('/', (_req, res) => { res.json({ name: 'questionnaire', version: '1.0.0' }); return; });
router.use('/admin', adminRouter);

// Start questionnaire (dynamic flow uses app registry character with datapoints – same flow for all services)
router.post('/questionnaires', async (req, res) => {
  const { service, channel, userRef } = req.body || {};
  if (!service) return res.status(422).json({ error: 'service is required' });

  let coreCharacter: { id: string; name?: string };
  try {
    coreCharacter = pickCharacter(service as any);
  } catch {
    coreCharacter = { id: config.WHATSAPP_CHARACTER_DEFAULT || 'aadhya', name: 'Aadhya Rao' };
  }
  const dynamicCharacterId =
    getCharacter(coreCharacter.id) ? coreCharacter.id : (config.WHATSAPP_CHARACTER_DEFAULT || 'aadhya');

  const newDoc = await QuestionnaireStore.create({
    service,
    characterId: dynamicCharacterId,
    channel,
    userRef,
    status: 'collecting',
    parameters: {},
    transcript: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Use service's character name for display (so UI shows Shreya for Commercial, Ramesh for Plumbing, etc.)
  const rawName = coreCharacter.name || getCharacter(dynamicCharacterId)?.name || 'Aadhya Rao';
  const displayName = rawName.includes(' - ') ? rawName.split(' - ')[0].trim() : rawName;
  await QuestionnaireStore.save(newDoc);
  res.status(201).json({
    id: newDoc.id,
    service,
    character: displayName,
    nextQuestion: '', // Intro comes from backend with first reply, not from create
  });
  return;
});

// Continue questionnaire (dynamic extraction + natural follow-up)
router.post('/questionnaires/:id/messages', async (req, res) => {
  const doc = await QuestionnaireStore.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  const { text } = req.body || {};
  if (!text) return res.status(422).json({ error: 'text is required' });

  // Append user turn
  doc.transcript.push({ role: 'user', text, ts: new Date() });
  doc.updatedAt = new Date();

  // Resolve character: use app registry (has datapoints) with fallback for dynamic flow
  const character =
    getCharacter(doc.characterId) ||
    getCharacter(config.WHATSAPP_CHARACTER_DEFAULT || 'aadhya');
  if (!character) {
    return res.status(500).json({ error: 'Character not available for dynamic flow' });
  }

  // Extract datapoints from natural message (multi-slot in one message)
  const extracted = await extractDatapointsFromMessage(text, doc, character);
  applyExtracted(doc, extracted);

  // When user agrees to schedule a call ("yes" / "sure" / "ok"), set contact_pref and ensure callback_time so we can complete
  const lastBotMsg = doc.transcript?.filter(m => m.role === 'assistant').pop()?.text || '';
  const agreedToCall = /\b(yes|sure|ok|yeah|yep)\b/i.test(text.trim()) &&
    /schedule|connect|call you|give you a call|call right away|quick chat|when would|looking forward|we'll connect|connecting with you/i.test(lastBotMsg);
  if (agreedToCall) {
    if (!doc.parameters) doc.parameters = {};
    if (!(doc.parameters as any).contact_pref) {
      (doc.parameters as any).contact_pref = { value: 'phone', confidence: 0.9, ts: new Date().toISOString() };
    }
    if (!(doc.parameters as any).callback_time && /right away|asap|very soon|soon\b|connecting with you/i.test(lastBotMsg)) {
      (doc.parameters as any).callback_time = { value: /right away|asap/i.test(lastBotMsg) ? 'now' : 'soon', confidence: 0.9, ts: new Date().toISOString() };
    }
  }

  // Generate natural assistant reply (asks only for missing / uncertain)
  const { reply: generatedReply, isComplete } = await generateAssistantReply(doc, character, {
    lastUserMessage: text,
  });

  // First assistant reply: use service's character name for intro (e.g. "Hi! I'm Shreya, your commercial interiors consultant")
  let reply = generatedReply;
  const hasNoAssistantMessagesYet = !doc.transcript.some((m: { role: string }) => m.role === 'assistant');
  if (hasNoAssistantMessagesYet) {
    let serviceCharacter: { name?: string } | null = null;
    try {
      serviceCharacter = pickCharacter(doc.service as any);
    } catch {
      serviceCharacter = null;
    }
    const openingCharacter = serviceCharacter ? { name: serviceCharacter.name } : character;
    const opening = getOpeningForService(doc.service, openingCharacter);
    reply = `${opening.trim()} ${reply.trim()}`.replace(/\s+/g, ' ').trim();
  }

  doc.transcript.push({ role: 'assistant', text: reply, ts: new Date() });
  await QuestionnaireStore.save(doc);

  if (isComplete) {
    doc.status = 'completed';
    await QuestionnaireStore.save(doc);

    let summary: ProjectSummary | null = null;
    const flatParams = flattenParameters(doc.parameters);
    try {
      summary = await generateProjectSummary(doc.service, flatParams);
    } catch (err) {
      console.error('[error] Failed to generate project summary:', err);
    }

    if (config.QUESTIONNAIRE_WEBHOOK_URL) {
      void postCompletion(config.QUESTIONNAIRE_WEBHOOK_URL, {
        questionnaireId: doc.id,
        service: doc.service,
        parameters: doc.parameters,
        summary,
        characterId: doc.characterId,
        userRef: doc.userRef,
        channel: doc.channel,
        completedAt: new Date().toISOString(),
      });
    }
    return res.json({
      id: doc.id,
      status: 'completed',
      parameters: doc.parameters,
      summary,
      nextQuestion: reply,
    });
  }

  const requiredIds = getRequiredFieldsForService(doc.service);
  const hasValue = (key: string) => {
    const v = (doc.parameters || {})[key];
    if (v == null) return false;
    return typeof v === 'object' && v !== null && 'value' in v ? v.value != null : true;
  };
  const missingCritical = requiredIds.filter((id) => !hasValue(id));

  res.json({
    id: doc.id,
    status: 'collecting',
    nextQuestion: reply,
    nextMessage: reply,
    collected: doc.parameters,
    parameters: doc.parameters,
    missingCritical,
    askedParam: undefined,
    parameterLabel: '',
    options: [],
    mediaUpload: true,
    mediaTypes: ['png', 'jpeg', 'jpg', 'pdf'],
    allowMultiple: false,
  });
  return;
});