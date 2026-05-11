# garment-dhu-calculator

**DHU (Defects Per Hundred Units) calculator for garment industry quality control.**

Daily QC metric used across CMT factories worldwide. Built and used in production by [Scan ERP](https://scanerp.pro) — a 100+ machine garment factory ERP in Nepal.

## Two languages, same logic

| Language | Install | Source |
|----------|---------|--------|
| Node.js / TypeScript | `npm install garment-dhu-calculator` | [npm/](./npm/) |
| Python 3.7+         | `pip install garment-dhu-calculator` | [python/](./python/) |

## Formula

```
DHU = (Total defects found / Total garments inspected) × 100
```

**Critical**: DHU counts *defects*, not defective pieces. One garment can have multiple defects — all are counted.

Example: 250 garments, 35 defects → DHU = 14.

## API surface (identical in both languages)

- `calculateDHU` / `calculate_dhu` — basic DHU
- `calculateDHUByType` / `calculate_dhu_by_type` — breakdown by defect type
- `aggregateDailyDHU` / `aggregate_daily_dhu` — across multiple checkers
- `classifyDHU` / `classify_dhu` — industry benchmark classification

## Industry benchmarks

| DHU range | Classification |
|-----------|----------------|
| ≤ 5%      | EXCELLENT      |
| ≤ 10%     | GOOD           |
| ≤ 15%     | ACCEPTABLE     |
| ≤ 25%     | POOR           |
| > 25%     | CRITICAL       |

## License

MIT © Santosh Rijal / [Scan ERP](https://scanerp.pro)

## Related

- [garment-aql-calculator](https://github.com/drmcoder/garment-aql-calculator) — ISO 2859-1 AQL sampling
- [garment-line-efficiency](https://github.com/drmcoder/garment-line-efficiency)
- [garment-fabric-consumption](https://github.com/drmcoder/garment-fabric-consumption)
- [garment-cmt-cost](https://github.com/drmcoder/garment-cmt-cost)
- [garment-smv-calculator](https://www.npmjs.com/package/garment-smv-calculator)
- [garment-piece-rate](https://www.npmjs.com/package/garment-piece-rate)
