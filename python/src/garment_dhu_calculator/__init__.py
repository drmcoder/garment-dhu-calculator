"""
DHU (Defects Per Hundred Units) Calculator for Garment Industry QC.

DHU = (Total defects found / Total garments inspected) × 100

CRITICAL distinction: DHU counts DEFECTS (not defective pieces).
One defective garment can have multiple defects — all counted.

Standard daily QC metric reported across the garment industry.

Reference: https://scanerp.pro/blog/reduce-rejection-rate-dhu-garment-factory.html
"""

from typing import Dict, List, Optional, TypedDict

__version__ = "1.0.0"

# Industry benchmark thresholds for DHU classification
DHU_BENCHMARKS = {
    "excellent": 5,     # DHU ≤ 5%
    "good": 10,         # DHU ≤ 10%
    "acceptable": 15,   # DHU ≤ 15%
    "poor": 25,         # DHU ≤ 25%
    # > 25 → CRITICAL
}


def calculate_dhu(defects_found: float, garments_inspected: float) -> float:
    """
    Calculate DHU (Defects Per Hundred Units).

    Args:
        defects_found: Total number of defects (not defective pieces — one piece can have many).
        garments_inspected: Total garments checked.

    Returns:
        DHU as a percentage.

    Example:
        >>> calculate_dhu(35, 250)
        14.0
    """
    if not isinstance(defects_found, (int, float)) or defects_found < 0:
        raise ValueError("defects_found must be a non-negative number")
    if not isinstance(garments_inspected, (int, float)) or garments_inspected <= 0:
        raise ValueError("garments_inspected must be a positive number")
    return (defects_found / garments_inspected) * 100


def calculate_dhu_by_type(
    defects_by_type: Dict[str, float],
    garments_inspected: float,
) -> dict:
    """
    Calculate DHU breakdown by defect type.

    Args:
        defects_by_type: Map of defect-type → count.
        garments_inspected: Total garments checked.

    Returns:
        dict with `total`, `by_type`, `total_defects`, `garments_inspected`.

    Example:
        >>> r = calculate_dhu_by_type({"broken-stitch": 12, "sizing": 8, "color-shade": 15}, 250)
        >>> r["total"]
        14.0
        >>> r["by_type"]["broken-stitch"]
        4.8
    """
    if not isinstance(defects_by_type, dict):
        raise ValueError("defects_by_type must be a dict mapping defect-type → count")
    if not isinstance(garments_inspected, (int, float)) or garments_inspected <= 0:
        raise ValueError("garments_inspected must be a positive number")

    by_type = {}
    total_defects = 0
    for defect_type, count in defects_by_type.items():
        if not isinstance(count, (int, float)) or count < 0:
            raise ValueError(f'Defect count for "{defect_type}" must be a non-negative number')
        by_type[defect_type] = (count / garments_inspected) * 100
        total_defects += count

    return {
        "total": (total_defects / garments_inspected) * 100,
        "by_type": by_type,
        "total_defects": total_defects,
        "garments_inspected": garments_inspected,
    }


def aggregate_daily_dhu(records: List[dict]) -> dict:
    """
    Aggregate DHU across multiple inspection records (a day's worth).

    Args:
        records: List of dicts with `defects_found`, `garments_inspected`, optional `checker`.

    Returns:
        dict with `total_defects`, `total_garments`, `dhu`, `by_checker`.

    Example:
        >>> r = aggregate_daily_dhu([
        ...     {"defects_found": 12, "garments_inspected": 80, "checker": "Sita"},
        ...     {"defects_found": 18, "garments_inspected": 120, "checker": "Ram"},
        ...     {"defects_found": 5, "garments_inspected": 50, "checker": "Gita"},
        ... ])
        >>> r["dhu"]
        14.0
        >>> r["by_checker"]["Sita"]
        15.0
    """
    if not isinstance(records, list) or len(records) == 0:
        raise ValueError("records must be a non-empty list")

    total_defects = 0
    total_garments = 0
    by_checker: Dict[str, Dict[str, float]] = {}

    for record in records:
        if not isinstance(record, dict):
            raise ValueError("Each record must be a dict")
        defects = record.get("defects_found")
        garments = record.get("garments_inspected")
        if not isinstance(defects, (int, float)) or not isinstance(garments, (int, float)):
            raise ValueError("Each record must have numeric defects_found and garments_inspected")

        total_defects += defects
        total_garments += garments

        checker = record.get("checker")
        if checker:
            if checker not in by_checker:
                by_checker[checker] = {"defects": 0, "garments": 0}
            by_checker[checker]["defects"] += defects
            by_checker[checker]["garments"] += garments

    by_checker_dhu = {
        name: (data["defects"] / data["garments"]) * 100 if data["garments"] > 0 else 0
        for name, data in by_checker.items()
    }

    return {
        "total_defects": total_defects,
        "total_garments": total_garments,
        "dhu": (total_defects / total_garments) * 100 if total_garments > 0 else 0,
        "by_checker": by_checker_dhu,
    }


def classify_dhu(dhu: float) -> str:
    """
    Classify a DHU value against industry benchmarks.

    Returns one of: 'EXCELLENT', 'GOOD', 'ACCEPTABLE', 'POOR', 'CRITICAL'.

    Example:
        >>> classify_dhu(3)
        'EXCELLENT'
        >>> classify_dhu(14)
        'ACCEPTABLE'
        >>> classify_dhu(30)
        'CRITICAL'
    """
    if not isinstance(dhu, (int, float)) or dhu < 0:
        raise ValueError("dhu must be a non-negative number")
    if dhu <= DHU_BENCHMARKS["excellent"]:
        return "EXCELLENT"
    if dhu <= DHU_BENCHMARKS["good"]:
        return "GOOD"
    if dhu <= DHU_BENCHMARKS["acceptable"]:
        return "ACCEPTABLE"
    if dhu <= DHU_BENCHMARKS["poor"]:
        return "POOR"
    return "CRITICAL"


__all__ = [
    "calculate_dhu",
    "calculate_dhu_by_type",
    "aggregate_daily_dhu",
    "classify_dhu",
    "DHU_BENCHMARKS",
]
