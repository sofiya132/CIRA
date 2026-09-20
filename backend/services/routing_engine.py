def route_incident(category: str) -> dict:
    category = (category or "OTHER").upper()

    routes = {
        "MEDICAL": {
            "responder_id": "medical-on-call",
            "responder_group": "Medical Response Team",
            "ack_timeout_seconds": 60,
        },
        "FIRE": {
            "responder_id": "fire-safety-on-call",
            "responder_group": "Fire Safety Team",
            "ack_timeout_seconds": 30,
        },
        "SECURITY": {
            "responder_id": "security-on-call",
            "responder_group": "Campus Security Team",
            "ack_timeout_seconds": 45,
        },
        "VIOLENCE": {
            "responder_id": "security-on-call",
            "responder_group": "Campus Security Team",
            "ack_timeout_seconds": 45,
        },
    }

    return routes.get(category, {
        "responder_id": "campus-services",
        "responder_group": "Campus Services",
        "ack_timeout_seconds": 180,
    })