import os
import boto3

sns = boto3.client("sns")

CRITICAL_TOPIC_ARN = os.environ.get("CRITICAL_TOPIC_ARN")
ESCALATION_TOPIC_ARN = os.environ.get("ESCALATION_TOPIC_ARN")


def handler(event, context):
    """
    Publishes an incident notification to SNS.

    event should contain:
    - incident_id
    - message
    - notification_type: CRITICAL or ESCALATION
    """

    incident_id = event.get("incident_id")
    message = event.get("message", "Campus incident notification")
    notification_type = event.get("notification_type", "CRITICAL").upper()

    if not incident_id:
        raise ValueError("incident_id is required")

    if notification_type == "ESCALATION":
        topic_arn = ESCALATION_TOPIC_ARN
    else:
        topic_arn = CRITICAL_TOPIC_ARN

    if not topic_arn:
        raise ValueError(
            f"SNS topic ARN is not configured for {notification_type}"
        )

    response = sns.publish(
        TopicArn=topic_arn,
        Subject=f"CIRA Incident {incident_id}",
        Message=message
    )

    return {
        "incident_id": incident_id,
        "notification_type": notification_type,
        "message_id": response["MessageId"]
    }