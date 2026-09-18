"""
Deterministic priority engine for SentinelX / CampusPulse.

IMPORTANT: priority is decided ENTIRELY by backend rules, never by an LLM.
The intended architecture is:

    Bedrock (upstream) -> extracts facts (category, person_state, keywords)
    Backend (here)      -> applies deterministic rules -> priority

This keeps priority assignment explainable, testable, and auditable —
critical for a safety system.
"""

from typing import Optional


PRIORITY_CRITICAL = "CRITICAL"
PRIORITY_HIGH = "HIGH"
PRIORITY_MEDIUM = "MEDIUM"
PRIORITY_LOW = "LOW"

# Keywords that (in addition to explicit fields) can indicate an
# in-progress violent situation or active fire when person_state /
# category alone don't capture it.
_VIOLENCE_KEYWORDS = ("violence", "fight", "attack", "assault", "weapon", "gun", "knife")
_FIRE_ACTIVE_KEYWORDS = ("active fire", "fire spreading", "burning", "flames")
_ELECTRICAL_MAJOR_KEYWORDS = ("sparking", "smoke", "exposed wire", "power outage", "transformer")


def calculate_priority(category: str, person_state: Optional[str] = None,
                        text: Optional[str] = None) -> str:
    """
    Apply deterministic rules to compute a priority level.

    Args:
        category: normalized incident/report category, e.g. "MEDICAL", "FIRE",
            "VIOLENCE", "ELECTRICAL", "WATER", "LOST_ITEM".
        person_state: optional state extracted for a person involved,
            e.g. "UNCONSCIOUS", "INJURED", "SAFE".
        text: optional raw report text, used only for lightweight keyword
            checks when structured fields don't already decide the answer.

    Returns:
        One of "CRITICAL", "HIGH", "MEDIUM", "LOW".
    """
    category = (category or "").strip().upper()
    person_state = (person_state or "").strip().upper()
    text_lower = (text or "").lower()

    # --- CRITICAL rules ----------------------------------------------------
    if category == "MEDICAL" and person_state == "UNCONSCIOUS":
        return PRIORITY_CRITICAL

    if category == "FIRE":
        # Any fire report is treated as CRITICAL; an explicit "active fire"
        # signal (field or keyword) is the clearest case but fire in
        # general is always high-stakes on a campus.
        return PRIORITY_CRITICAL

    if category == "VIOLENCE":
        return PRIORITY_CRITICAL

    if any(keyword in text_lower for keyword in _VIOLENCE_KEYWORDS):
        return PRIORITY_CRITICAL

    # --- HIGH rules ----------------------------------------------------
    if category == "ELECTRICAL":
        return PRIORITY_HIGH

    # --- MEDIUM rules ----------------------------------------------------
    if category == "WATER":
        return PRIORITY_MEDIUM

    # --- LOW rules ----------------------------------------------------
    if category in ("LOST_ITEM", "LOST ITEM"):
        return PRIORITY_LOW

    # --- Fallback ----------------------------------------------------
    # Any MEDICAL report without an UNCONSCIOUS person_state still deserves
    # prompt attention but isn't automatically CRITICAL.
    if category == "MEDICAL":
        return PRIORITY_HIGH

    return PRIORITY_MEDIUM
