export type DHUClassification = 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'CRITICAL';

export interface DHUByTypeResult {
  total: number;
  byType: Record<string, number>;
  totalDefects: number;
  garmentsInspected: number;
}

export interface DailyDHURecord {
  defectsFound: number;
  garmentsInspected: number;
  checker?: string;
}

export interface DailyDHUResult {
  totalDefects: number;
  totalGarments: number;
  dhu: number;
  byChecker: Record<string, number>;
}

export function calculateDHU(params: {
  defectsFound: number;
  garmentsInspected: number;
}): number;

export function calculateDHUByType(params: {
  defectsByType: Record<string, number>;
  garmentsInspected: number;
}): DHUByTypeResult;

export function aggregateDailyDHU(records: DailyDHURecord[]): DailyDHUResult;

export function classifyDHU(dhu: number): DHUClassification;

export const DHU_BENCHMARKS: {
  excellent: number;
  good: number;
  acceptable: number;
  poor: number;
  critical: number;
};
