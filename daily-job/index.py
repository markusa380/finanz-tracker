import json
import logging
from datetime import datetime, time, timedelta

from fints.client import FinTS3PinTanClient

from lib.config import *
from lib.notifications import send_email
from lib.secrets import get_bank_pin

salary_keywords = {'Salary', 'Insolvenz', 'Gehalt'}

def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    logging.basicConfig(level=logging.WARN)

    pin = get_bank_pin()

    client = FinTS3PinTanClient(BANK_BLZ, BANK_LOGIN_NAME, pin, FIN_TS_URL)
    
    accounts = client.get_sepa_accounts()
    account = [acc for acc in accounts if acc.accountnumber == ACCOUNT_NUMBER][0]
    end_date = datetime.combine(datetime.today(), time.min)
    start_date = end_date - timedelta(days = 30)
    transactions = client.get_transactions(account, start_date, end_date)

    budget = BUDGET
    salary_count = 0

    for transaction in transactions:
        data = transaction.data
        has_keyword = False
        if data['purpose']:
            for keyword in salary_keywords:
                if keyword.lower() in data['purpose'].lower():
                    has_keyword = True

        if not has_keyword:
            amount = data['amount'].amount
            budget = budget + amount
        else:
            salary_count += 1

    message = f'Hello!\n\n'
    message += f'Remaining budget for the last 30 days: {budget}€\n'
    
    if salary_count != 1:
        message += f'\nWarning: Number of "Salary" transactions is {salary_count} instead of 1\n'

    send_email(
        'Daily Fincancial Update',
        message
    )
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': "ok"
    }
