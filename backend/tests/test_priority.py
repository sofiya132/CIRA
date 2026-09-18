import os
import sys
import unittest

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from services.priority_engine import (
    calculate_priority,
    PRIORITY_CRITICAL,
    PRIORITY_HIGH,
    PRIORITY_MEDIUM,
    PRIORITY_LOW,
)


class TestPriorityEngine(unittest.TestCase):
    def test_medical_unconscious_is_critical(self):
        self.assertEqual(
            calculate_priority(category="MEDICAL", person_state="UNCONSCIOUS"),
            PRIORITY_CRITICAL,
        )

    def test_active_fire_is_critical(self):
        self.assertEqual(calculate_priority(category="FIRE"), PRIORITY_CRITICAL)

    def test_violence_in_progress_is_critical(self):
        self.assertEqual(calculate_priority(category="VIOLENCE"), PRIORITY_CRITICAL)
        self.assertEqual(
            calculate_priority(category="OTHER", text="A fight broke out near the gate"),
            PRIORITY_CRITICAL,
        )

    def test_major_electrical_failure_is_high(self):
        self.assertEqual(calculate_priority(category="ELECTRICAL"), PRIORITY_HIGH)

    def test_water_leakage_is_medium(self):
        self.assertEqual(calculate_priority(category="WATER"), PRIORITY_MEDIUM)

    def test_lost_item_is_low(self):
        self.assertEqual(calculate_priority(category="LOST_ITEM"), PRIORITY_LOW)

    def test_medical_without_unconscious_is_high_not_critical(self):
        self.assertEqual(
            calculate_priority(category="MEDICAL", person_state="INJURED"),
            PRIORITY_HIGH,
        )

    def test_unknown_category_defaults_to_medium(self):
        self.assertEqual(calculate_priority(category="OTHER"), PRIORITY_MEDIUM)


if __name__ == "__main__":
    unittest.main()
