/**
 * Verification tests for garment-dhu-calculator
 *
 * Cross-verified against OnlineClothingStudy example:
 *   Checker checks 250 garments, finds 20 defective pieces with 35 defects.
 *   DHU = (35/250) × 100 = 14
 *
 * Run: npm test
 */

const {
  calculateDHU,
  calculateDHUByType,
  aggregateDailyDHU,
  classifyDHU,
} = require('./index');

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function assertClose(actual, expected, label, tolerance = 0.001) {
  if (Math.abs(actual - expected) < tolerance) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}\n    expected: ~${expected}\n    actual:   ${actual}`);
    failed++;
  }
}

function assertThrows(fn, label) {
  try {
    fn();
    console.log(`  ✗ ${label} (expected throw)`);
    failed++;
  } catch (_) {
    console.log(`  ✓ ${label}`);
    passed++;
  }
}

console.log('\n=== calculateDHU (basic) ===');
// OnlineClothingStudy example: 35 defects in 250 garments = DHU 14
assertClose(calculateDHU({ defectsFound: 35, garmentsInspected: 250 }), 14, 'OnlineClothingStudy: 35/250 = DHU 14');
assertClose(calculateDHU({ defectsFound: 0, garmentsInspected: 100 }), 0, '0 defects = DHU 0');
assertClose(calculateDHU({ defectsFound: 5, garmentsInspected: 100 }), 5, '5 defects in 100 = DHU 5');
assertClose(calculateDHU({ defectsFound: 50, garmentsInspected: 200 }), 25, '50/200 = DHU 25');

console.log('\n=== calculateDHUByType ===');
const byType = calculateDHUByType({
  garmentsInspected: 250,
  defectsByType: { 'broken-stitch': 12, 'sizing': 8, 'color-shade': 15 },
});
assertClose(byType.total, 14.0, 'Total DHU = 14');
assertClose(byType.byType['broken-stitch'], 4.8, 'Broken stitch DHU = 4.8');
assertClose(byType.byType['sizing'], 3.2, 'Sizing DHU = 3.2');
assertClose(byType.byType['color-shade'], 6.0, 'Color shade DHU = 6.0');
assertEqual(byType.totalDefects, 35, 'Total defects = 35');

console.log('\n=== aggregateDailyDHU (across multiple checkers) ===');
const daily = aggregateDailyDHU([
  { defectsFound: 12, garmentsInspected: 80, checker: 'Sita' },
  { defectsFound: 18, garmentsInspected: 120, checker: 'Ram' },
  { defectsFound: 5, garmentsInspected: 50, checker: 'Gita' },
]);
assertEqual(daily.totalDefects, 35, 'Total defects = 35');
assertEqual(daily.totalGarments, 250, 'Total garments = 250');
assertClose(daily.dhu, 14.0, 'Aggregate DHU = 14');
assertClose(daily.byChecker['Sita'], 15.0, 'Sita DHU = 15 (12/80 × 100)');
assertClose(daily.byChecker['Ram'], 15.0, 'Ram DHU = 15 (18/120 × 100)');
assertClose(daily.byChecker['Gita'], 10.0, 'Gita DHU = 10 (5/50 × 100)');

console.log('\n=== classifyDHU (industry benchmarks) ===');
assertEqual(classifyDHU(3), 'EXCELLENT', '3% → EXCELLENT');
assertEqual(classifyDHU(5), 'EXCELLENT', '5% → EXCELLENT (boundary)');
assertEqual(classifyDHU(8), 'GOOD', '8% → GOOD');
assertEqual(classifyDHU(10), 'GOOD', '10% → GOOD (boundary)');
assertEqual(classifyDHU(14), 'ACCEPTABLE', '14% → ACCEPTABLE');
assertEqual(classifyDHU(20), 'POOR', '20% → POOR');
assertEqual(classifyDHU(30), 'CRITICAL', '30% → CRITICAL');

console.log('\n=== Input validation ===');
assertThrows(() => calculateDHU({ defectsFound: -1, garmentsInspected: 100 }), 'Throws on negative defects');
assertThrows(() => calculateDHU({ defectsFound: 10, garmentsInspected: 0 }), 'Throws on zero garments');
assertThrows(() => calculateDHUByType({ defectsByType: null, garmentsInspected: 100 }), 'Throws on null defectsByType');
assertThrows(() => aggregateDailyDHU([]), 'Throws on empty records');
assertThrows(() => classifyDHU(-5), 'Throws on negative DHU');

console.log(`\n${passed}/${passed + failed} tests passed.${failed > 0 ? ' ' + failed + ' FAILED.' : ''}`);
process.exit(failed > 0 ? 1 : 0);
