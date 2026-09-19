import os
import sys
import unittest

backend_folder = os.path.join(os.path.dirname(__file__), "..")
routing_lambda_folder = os.path.join(
    backend_folder, "lambda", "routing"
)

sys.path.append(routing_lambda_folder)

from handler  import handler


class TestRoutingLambda(unittest.TestCase):
    def test_medical_incident(self):
        event = {
            "incident_id": "INC-001",
            "category": "MEDICAL",
            "priority": "CRITICAL",
        }

        result = handler(event, None)

        self.assertEqual(result["responder_id"], "medical-on-call")
        self.assertEqual(result["responder_group"], "Medical Response Team")

    def test_fire_incident(self):
        event = {
            "incident_id": "INC-002",
            "category": "FIRE",
        }

        result = handler(event, None)

        self.assertEqual(result["responder_id"], "fire-safety-on-call")


if __name__ == "__main__":
    unittest.main()