import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from services.routing_engine import route_incident


def handler(event, context):
    """
    Receives an incident from Step Functions and returns the selected route.
    """

    category = event.get("category", "OTHER")

    return route_incident(category)