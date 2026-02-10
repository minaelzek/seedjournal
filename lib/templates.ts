import type { Reflection } from "./types";

const validations = [
  "Thank you for sharing that—your feelings make sense.",
  "I hear you. It takes care to pause and write this down.",
  "You showed up for yourself today, and that matters."
];

const nextSteps = [
  "Take one slow breath and unclench your shoulders.",
  "Write down one small win from today.",
  "Choose one task for tomorrow and keep it tiny.",
  "Drink some water, then step away from your screen for two minutes."
];

const inferTheme = (text: string): string => {
  const lower = text.toLowerCase();
  if (/(tired|drain|exhaust|burnout)/.test(lower)) return "It sounds like your energy felt stretched thin.";
  if (/(anxious|worry|stress|overwhelm)/.test(lower)) return "There is a thread of pressure and uncertainty in what you wrote.";
  if (/(grateful|good|proud|win|happy)/.test(lower)) return "I can hear moments of strength and appreciation.";
  if (/(sad|down|lonely|hurt)/.test(lower)) return "This carries a tone of heaviness and care.";
  return "I notice you reflecting with honesty on your day.";
};

const pickByLength = (items: string[], seedText: string): string => {
  return items[seedText.length % items.length];
};

export const buildReflection = (text: string): Reflection => {
  return {
    validation: pickByLength(validations, text),
    theme: inferTheme(text),
    nextStep: pickByLength(nextSteps, text.split(" ").join(""))
  };
};

export const promptSuggestions = [
  "What drained me today?",
  "What did I do well?",
  "One thing I can control is…",
  "What am I avoiding right now?",
  "What helped me feel grounded today?"
];
