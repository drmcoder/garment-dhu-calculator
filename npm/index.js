/**
 * DHU (Defects Per Hundred Units) Calculator for Garment Industry QC.
 *
 * DHU = (Total defects found / Total garments inspected) × 100
 *
 * CRITICAL distinction: DHU counts DEFECTS (not defective pieces).
 * One defective garment can have multiple defects — all counted.
 *
 * Standard daily QC metric reported across the garment industry.
 *
 * Reference: https://scanerp.pro/blog/reduce-rejection-rate-dhu-garment-factory.html
 *
 * @example
 *   const { calculateDHU } = require('garment-dhu-calculator');
 *   const dhu = calculateDHU({ defectsFound: 35, garmentsInspected: 250 });
 *   // → 14 (DHU%)
 */

function calculateDHU({ defectsFound, garmentsInspected }) {
  if (typeof defectsFound !== 'number' || defectsFound < 0) {
    throw new Error('defectsFound must be a non-negative number');
  }
  if (typeof garmentsInspected !== 'number' || garmentsInspected <= 0) {
    throw new Error('garmentsInspected must be a positive number');
  }
  return (defectsFound / garmentsInspected) * 100;
}

/**
 * Calculate DHU breakdown by defect type.
 *
 * @example
 *   calculateDHUByType({
 *     garmentsInspected: 250,
 *     defects: { 'broken stitch': 12, 'sizing': 8, 'color shade': 15 }
 *   })
 *   // → { total: 14, byType: { 'broken stitch': 4.8, 'sizing': 3.2, 'color shade': 6 } }
 */
function calculateDHUByType({ defectsByType, garmentsInspected }) {
  if (!defectsByType || typeof defectsByType !== 'object') {
    throw new Error('defectsByType must be an object mapping defect-type → count');
  }
  if (typeof garmentsInspected !== 'number' || garmentsInspected <= 0) {
    throw new Error('garmentsInspected must be a positive number');
  }
  const byType = {};
  let totalDefects = 0;
  for (const [defectType, count] of Object.entries(defectsByType)) {
    if (typeof count !== 'number' || count < 0) {
      throw new Error(`Defect count for "${defectType}" must be a non-negative number`);
    }
    byType[defectType] = (count / garmentsInspected) * 100;
    totalDefects += count;
  }
  return {
    total: (totalDefects / garmentsInspected) * 100,
    byType,
    totalDefects,
    garmentsInspected,
  };
}

/**
 * Aggregate DHU across multiple inspection records (a day's worth).
 *
 * @example
 *   aggregateDailyDHU([
 *     { defectsFound: 12, garmentsInspected: 80, checker: 'Sita' },
 *     { defectsFound: 18, garmentsInspected: 120, checker: 'Ram' },
 *     { defectsFound: 5, garmentsInspected: 50, checker: 'Gita' }
 *   ])
 *   // → { totalDefects: 35, totalGarments: 250, dhu: 14, byChecker: {...} }
 */
function aggregateDailyDHU(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('records must be a non-empty array');
  }
  let totalDefects = 0;
  let totalGarments = 0;
  const byChecker = {};
  for (const record of records) {
    if (!record || typeof record.defectsFound !== 'number' || typeof record.garmentsInspected !== 'number') {
      throw new Error('Each record must have numeric defectsFound and garmentsInspected');
    }
    totalDefects += record.defectsFound;
    totalGarments += record.garmentsInspected;
    if (record.checker) {
      if (!byChecker[record.checker]) {
        byChecker[record.checker] = { defects: 0, garments: 0 };
      }
      byChecker[record.checker].defects += record.defectsFound;
      byChecker[record.checker].garments += record.garmentsInspected;
    }
  }
  // Convert checker totals to DHU
  const byCheckerDHU = {};
  for (const [name, data] of Object.entries(byChecker)) {
    byCheckerDHU[name] = data.garments > 0
      ? (data.defects / data.garments) * 100
      : 0;
  }
  return {
    totalDefects,
    totalGarments,
    dhu: totalGarments > 0 ? (totalDefects / totalGarments) * 100 : 0,
    byChecker: byCheckerDHU,
  };
}

/**
 * Industry benchmark thresholds for DHU classification.
 * Use to flag whether a day's DHU is good/acceptable/poor.
 */
const DHU_BENCHMARKS = {
  excellent: 5,   // DHU ≤ 5%
  good: 10,       // DHU ≤ 10%
  acceptable: 15, // DHU ≤ 15%
  poor: 25,       // DHU ≤ 25%
  critical: Infinity, // DHU > 25%
};

function classifyDHU(dhu) {
  if (typeof dhu !== 'number' || dhu < 0) {
    throw new Error('dhu must be a non-negative number');
  }
  if (dhu <= DHU_BENCHMARKS.excellent) return 'EXCELLENT';
  if (dhu <= DHU_BENCHMARKS.good) return 'GOOD';
  if (dhu <= DHU_BENCHMARKS.acceptable) return 'ACCEPTABLE';
  if (dhu <= DHU_BENCHMARKS.poor) return 'POOR';
  return 'CRITICAL';
}

module.exports = {
  calculateDHU,
  calculateDHUByType,
  aggregateDailyDHU,
  classifyDHU,
  DHU_BENCHMARKS,
};
