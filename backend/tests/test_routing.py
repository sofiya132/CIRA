import os
import sys
import unittest

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from services.routing_engine import route_incident


class TestRoutingEngine(unittest.TestCase):
    def test_medical_routes_correctly(self):
        route = route_incident("MEDICAL")

        self.assertEqual(route["responder_id"], "medical-on-call")
        self.assertEqual(route["responder_group"], "Medical Response Team")
        self.assertEqual(route["ack_timeout_seconds"], 60)

    def test_violence_routes_to_security(self):
        route = route_incident("VIOLENCE")

        self.assertEqual(route["responder_id"], "security-on-call")

    def test_unknown_category_has_a_safe_default(self):
        route = route_incident("UNKNOWN")

        self.assertEqual(route["responder_id"], "campus-services")


if __name__ == "__main__":
    unittest.main()