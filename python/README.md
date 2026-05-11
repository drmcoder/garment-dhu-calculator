# garment-dhu-calculator

**DHU (Defects Per Hundred Units) calculator for garment industry quality control.**

The standard daily QC metric used across CMT factories worldwide. Built and used in production by [Scan ERP](https://scanerp.pro).

## Install

```bash
pip install garment-dhu-calculator
```

## What is DHU?

**DHU = (Total defects found / Total garments inspected) × 100**

CRITICAL distinction: DHU counts **defects**, not defective pieces. One garment can have multiple defects — all are counted.

Example: A checker inspects 250 garments, finds 20 defective pieces with 35 total defects.
DHU = (35 / 250) × 100 = **14**

## Usage

```python
from garment_dhu_calculator import (
    calculate_dhu,
    calculate_dhu_by_type,
    aggregate_daily_dhu,
    classify_dhu,
)

# Basic DHU
calculate_dhu(defects_found=35, garments_inspected=250)
# → 14.0

# DHU broken down by defect type
calculate_dhu_by_type(
    defects_by_type={"broken-stitch": 12, "sizing": 8, "color-shade": 15},
    garments_inspected=250,
)
# → {"total": 14.0, "by_type": {"broken-stitch": 4.8, "sizing": 3.2, "color-shade": 6.0}, ...}

# Daily aggregate across multiple checkers
aggregate_daily_dhu([
    {"defects_found": 12, "garments_inspected": 80, "checker": "Sita"},
    {"defects_found": 18, "garments_inspected": 120, "checker": "Ram"},
    {"defects_found": 5, "garments_inspected": 50, "checker": "Gita"},
])
# → {"total_defects": 35, "total_garments": 250, "dhu": 14.0,
#    "by_checker": {"Sita": 15.0, "Ram": 15.0, "Gita": 10.0}}

# Industry benchmark classification
classify_dhu(14)  # → 'ACCEPTABLE'
classify_dhu(3)   # → 'EXCELLENT'
classify_dhu(30)  # → 'CRITICAL'
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

- [garment-aql-calculator](https://pypi.org/project/garment-aql-calculator/) — ISO 2859-1 AQL sampling
- [garment-smv-calculator](https://pypi.org/project/garment-smv-calculator/) — SMV / SAM calculation
- [garment-piece-rate](https://pypi.org/project/garment-piece-rate/) — piece-rate payment

## License

MIT © Santosh Rijal / [Scan ERP](https://scanerp.pro)
