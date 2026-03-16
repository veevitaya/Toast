import type { RankedCandidate } from "./rankingEngine";

export interface ConfidenceResult {
  score: number;
  label: string;
}

const CONFIDENCE_LABELS = [
  { threshold: 0.85, label: "Very strong fit" },
  { threshold: 0.70, label: "Strong fit" },
  { threshold: 0.50, label: "Likely fit" },
  { threshold: 0, label: "Worth trying" },
];

export function computeConfidence(
  primary: RankedCandidate,
  runnerUp: RankedCandidate | null,
  userDataCompleteness: number,
  contextClarity: number
): ConfidenceResult {
  let confidence = 0;

  const margin = runnerUp
    ? Math.min(1, (primary.score - runnerUp.score) * 5)
    : 0.3;
  confidence += margin * 0.35;

  confidence += userDataCompleteness * 0.25;

  confidence += contextClarity * 0.25;

  const longTermContext = primary.breakdown.longTermFit + primary.breakdown.contextFit;
  const consistency = Math.min(1, longTermContext);
  confidence += consistency * 0.15;

  confidence = Math.max(0, Math.min(1, confidence));

  const label = CONFIDENCE_LABELS.find(l => confidence >= l.threshold)?.label || "Worth trying";

  return { score: confidence, label };
}

export function computeUserDataCompleteness(
  hasTasteDna: boolean,
  eventCount: number,
  hasContextPatterns: boolean,
  hasMealMemory: boolean
): number {
  let completeness = 0;
  if (hasTasteDna) completeness += 0.3;
  if (eventCount > 0) completeness += Math.min(0.3, eventCount * 0.01);
  if (hasContextPatterns) completeness += 0.2;
  if (hasMealMemory) completeness += 0.2;
  return Math.min(1, completeness);
}

export function computeContextClarity(
  hasDaypart: boolean,
  hasMood: boolean,
  hasArea: boolean,
  hasWeather: boolean
): number {
  let clarity = 0;
  if (hasDaypart) clarity += 0.4;
  if (hasMood) clarity += 0.3;
  if (hasArea) clarity += 0.2;
  if (hasWeather) clarity += 0.1;
  return Math.min(1, clarity);
}
