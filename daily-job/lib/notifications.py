import os
import boto3

def send_email(subject: str, message: str):
  client = boto3.client('sns')
  client.publish(
    TopicArn = os.getenv('EMAIL_TOPIC_ARN'),
    Message = message,
    Subject = subject,
  )