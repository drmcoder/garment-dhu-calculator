# garment-dhu-calculator

**DHU (Defects Per Hundred Units) calculator for garment industry quality control.**

The standard daily QC metric used across CMT factories worldwide. Built and used in production by [Scan ERP](https://scanerp.pro).

## Install

```bash
npm install garment-dhu-calculator
```

## What is DHU?

**DHU = (Total defects found / Total garments inspected) × 100**

CRITICAL distinction: DHU counts **defects**, not defective pieces. One garment can have multiple defects — all are counted.

Example: A checker inspects 250 garments, finds 20 defective pieces with 35 total defects.
DHU = (35 / 250) × 100 = **14**

## Usage

```js
const {
  calculateDHU,
  calculateDHUByType,
  aggregateDailyDHU,
  classifyDHU,
} = require('garment-dhu-calculator');

// Basic DHU
calculateDHU({ defectsFound: 35, garmentsInspected: 250 });
// → 14

// DHU broken down by defect type
calculateDHUByType({
  garmentsInspected: 250,
  defectsByType: { 'broken-stitch': 12, 'sizing': 8, 'color-shade': 15 },
});
// → { total: 14, byType: { 'broken-stitch': 4.8, 'sizing': 3.2, 'color-shade': 6 }, totalDefects: 35 }

// Daily aggregate across multiple checkers
aggregateDailyDHU([
  { defectsFound: 12, garmentsInspected: 80, checker: 'Sita' },
  { defectsFound: 18, garmentsInspected: 120, checker: 'Ram' },
  { defectsFound: 5, garmentsInspected: 50, checker: 'Gita' },
]);
// → { totalDefects: 35, totalGarments: 250, dhu: 14, byChecker: { Sita: 15, Ram: 15, Gita: 10 } }

// Industry benchmark classification
classifyDHU(14); // → 'ACCEPTABLE'
classifyDHU(3);  // → 'EXCELLENT'
classifyDHU(30); // → 'CRITICAL'
```

## Industry benchmarks

| DHU range | Classification |
|-----------|----------------|
| ≤ 5%      | EXCELLENT      |
| ≤ 10%     | GOOD           |
| ≤ 15%     | ACCEPTABLE     |
| ≤ 25%     | POOR           |
| > 25%     | CRITICAL       |

## Related

- [garment-aql-calculator](https://www.npmjs.com/package/garment-aql-calculator) — ISO 2859-1 AQL sampling
- [garment-smv-calculator](https://www.npmjs.com/package/garment-smv-calculator) — SMV / SAM calculation
- [garment-piece-rate](https://www.npmjs.com/package/garment-piece-rate) — piece-rate payment

## License

MIT © Santosh Rijal / [Scan ERP](https://scanerp.pro)
