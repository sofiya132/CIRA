def handler(event, context):
    """
    Checks whether the responder acknowledged the incident.

    For the initial MVP, acknowledgement is supplied in the event.
    Later this can be connected to DynamoDB/API data.
    """

    acknowledged = event.get("acknowledged", False)

    return {
        "incident_id": event.get("incident_id"),
        "acknowledged": bool(acknowledged)
    }