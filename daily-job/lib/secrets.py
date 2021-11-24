import boto3
import os

def get_bank_pin():
  client = boto3.client('secretsmanager')
  arn = os.getenv('BANK_PIN_SECRET_ARN')
  print('Getting secret at ARN', arn)
  response = client.get_secret_value(SecretId = arn)
  print('Response:', response)
  return response['SecretString']