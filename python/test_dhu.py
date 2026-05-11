"""
Verification tests for garment-dhu-calculator (Python).

Cross-verified against OnlineClothingStudy reference:
    Checker checks 250 garments, finds 20 defective pieces with 35 defects.
    DHU = (35/250) × 100 = 14

Run: python test_dhu.py
"""

import math
import sys
sys.path.insert(0, "src")
from garment_dhu_calculator import (
    calculate_dhu,
    calculate_dhu_by_type,
    aggregate_daily_dhu,
    classify_dhu,
)

passed = 0
failed = 0


def assert_equal(actual, expected, label):
    global passed, failed
    if actual == expected:
        print(f"  ✓ {label}")
        passed += 1
    else:
        print(f"  ✗ {label}\n    expected: {expected}\n    actual:   {actual}")
        failed += 1


def assert_close(actual, expected, label, tolerance=0.001):
    global passed, failed
    if math.isclose(actual, expected, abs_tol=tolerance):
        print(f"  ✓ {label}")
        passed += 1
    else:
        print(f"  ✗ {label}\n    expected: ~{expected}\n    actual:   {actual}")
        failed += 1


def assert_throws(fn, label):
    global passed, failed
    try:
        fn()
        print(f"  ✗ {label} (expected exception, did not throw)")
        failed += 1
    except Exception:
        print(f"  ✓ {label}")
        passed += 1


print("\n=== calculate_dhu (basic) ===")
assert_close(calculate_dhu(35, 250), 14, "OnlineClothingStudy: 35/250 = DHU 14")
assert_close(calculate_dhu(0, 100), 0, "0 defects = DHU 0")
assert_close(calculate_dhu(5, 100), 5, "5 defects in 100 = DHU 5")
assert_close(calculate_dhu(50, 200), 25, "50/200 = DHU 25")

print("\n=== calculate_dhu_by_type ===")
by_type = calculate_dhu_by_type(
    defects_by_type={"broken-stitch": 12, "sizing": 8, "color-shade": 15},
    garments_inspected=250,
)
assert_close(by_type["total"], 14.0, "Total DHU = 14")
assert_close(by_type["by_type"]["broken-stitch"], 4.8, "Broken stitch DHU = 4.8")
assert_close(by_type["by_type"]["sizing"], 3.2, "Sizing DHU = 3.2")
assert_close(by_type["by_type"]["color-shade"], 6.0, "Color shade DHU = 6.0")
assert_equal(by_type["total_defects"], 35, "Total defects = 35")

print("\n=== aggregate_daily_dhu (across multiple checkers) ===")
daily = aggregate_daily_dhu([
    {"defects_found": 12, "garments_inspected": 80, "checker": "Sita"},
    {"defects_found": 18, "garments_inspected": 120, "checker": "Ram"},
    {"defects_found": 5, "garments_inspected": 50, "checker": "Gita"},
])
assert_equal(daily["total_defects"], 35, "Total defects = 35")
assert_equal(daily["total_garments"], 250, "Total garments = 250")
assert_close(daily["dhu"], 14.0, "Aggregate DHU = 14")
assert_close(daily["by_checker"]["Sita"], 15.0, "Sita DHU = 15 (12/80 × 100)")
assert_close(daily["by_checker"]["Ram"], 15.0, "Ram DHU = 15 (18/120 × 100)")
assert_close(daily["by_checker"]["Gita"], 10.0, "Gita DHU = 10 (5/50 × 100)")

print("\n=== classify_dhu (industry benchmarks) ===")
assert_equal(classify_dhu(3), "EXCELLENT", "3% → EXCELLENT")
assert_equal(classify_dhu(5), "EXCELLENT", "5% → EXCELLENT (boundary)")
assert_equal(classify_dhu(8), "GOOD", "8% → GOOD")
assert_equal(classify_dhu(10), "GOOD", "10% → GOOD (boundary)")
assert_equal(classify_dhu(14), "ACCEPTABLE", "14% → ACCEPTABLE")
assert_equal(classify_dhu(20), "POOR", "20% → POOR")
assert_equal(classify_dhu(30), "CRITICAL", "30% → CRITICAL")

print("\n=== Input validation ===")
assert_throws(lambda: calculate_dhu(-1, 100), "Throws on negative defects")
assert_throws(lambda: calculate_dhu(10, 0), "Throws on zero garments")
assert_throws(lambda: calculate_dhu_by_type(None, 100), "Throws on None defects_by_type")
assert_throws(lambda: aggregate_daily_dhu([]), "Throws on empty records")
assert_throws(lambda: classify_dhu(-5), "Throws on negative DHU")

print(f"\n{passed}/{passed + failed} tests passed." + (f" {failed} FAILED." if failed > 0 else ""))
sys.exit(1 if failed > 0 else 0)
