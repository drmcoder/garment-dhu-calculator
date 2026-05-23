# garment-dhu-calculator

[![Powered by Scan ERP](https://img.shields.io/badge/Powered%20by-Scan%20ERP-047857)](https://scanerp.pro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DHU (Defects Per Hundred Units) calculator for garment industry quality control.**

Daily QC metric used across CMT factories worldwide. Built and used in production by **[Scan ERP](https://scanerp.pro/)** — a 100+ machine garment factory ERP that tracks DHU in real time from bundle-level damage reports.

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

## Try Scan ERP

This calculator is free. The full ERP that auto-computes DHU from every damage report on the factory floor — with photo evidence and severity classification — is at **[scanerp.pro](https://scanerp.pro/)**.

- [Live demo](https://scanerp.pro/) · 1.4M+ pieces tracked
- [DHU benchmarks 2026](https://scanerp.pro/blog/dhu-benchmarks-garment-factory-2026.html)
- [Reduce rejection rate guide](https://scanerp.pro/blog/reduce-rejection-rate-dhu-garment-factory.html)
- [Free 30-day trial](https://scanerp.pro/#contact)

## License

MIT © Santosh Rijal / [Scan ERP](https://scanerp.pro/)

## Related

- [garment-aql-calculator](https://github.com/drmcoder/garment-aql-calculator) — ISO 2859-1 AQL sampling
- [garment-line-efficiency](https://github.com/drmcoder/garment-line-efficiency)
- [garment-fabric-consumption](https://github.com/drmcoder/garment-fabric-consumption)
- [garment-cmt-cost](https://github.com/drmcoder/garment-cmt-cost)
- [garment-smv-calculator](https://www.npmjs.com/package/garment-smv-calculator)
- [garment-piece-rate](https://www.npmjs.com/package/garment-piece-rate)


## Related Packages — Scan ERP Garment Toolkit

Part of the [Scan ERP open-source garment toolkit](https://scanerp.pro) — production-tested utilities for CMT factory operations, all MIT licensed:

- [aql-sample-size](https://github.com/drmcoder/aql-sample-size) — ISO 2859-1 sample-size lookup (zero-dependency data library)
- [garment-aql-calculator](https://www.npmjs.com/package/garment-aql-calculator) — Full AQL inspection decision engine with pass/fail logic
- [garment-bundle-id](https://www.npmjs.com/package/garment-bundle-id) — Bundle QR code generator + parser (STYLE-LOT-COLOR-SIZE-BUNDLE# format)
- [garment-cmt-cost](https://www.npmjs.com/package/garment-cmt-cost) — CMT cost calculator with 13-country CPM comparison
- [garment-dhu-calculator](https://www.npmjs.com/package/garment-dhu-calculator) — Defects Per Hundred Units with defect-type breakdown + multi-checker aggregation
- [garment-fabric-consumption](https://www.npmjs.com/package/garment-fabric-consumption) — Fabric consumption (knit GSM × area, woven marker length)
- [garment-line-efficiency](https://www.npmjs.com/package/garment-line-efficiency) — Line efficiency, target output, line balance / bottleneck detection
- [garment-piece-rate](https://www.npmjs.com/package/garment-piece-rate) — Piece-rate earnings calculator with bonuses and overtime
- [garment-smv-calculator](https://www.npmjs.com/package/garment-smv-calculator) — Stopwatch SMV/SAM with Westinghouse performance rating

See the curated [awesome-garment-erp](https://github.com/drmcoder/awesome-garment-erp) list for the full Scan ERP ecosystem, or visit [scanerp.pro](https://scanerp.pro) for the production garment manufacturing ERP this toolkit powers.
