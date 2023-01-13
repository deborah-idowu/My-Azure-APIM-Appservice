import logging
import mysql.connector
import azure.functions as func
import hashlib
import uuid
import json
from datetime import datetime
import os

base_dir = os.path.dirname(os.path.abspath(__file__)).replace('\\', '/')

config_file = f"{base_dir}/config.json"
with open(config_file, "rb") as f:
    config = json.load(f)

db = mysql.connector.connect(
    host=config['datasource']['host'],
    user=config['datasource']['username'],
    password=config['datasource']['password'],
    database=config['datasource']['database']
)

cursor = db.cursor()

# timestamp_param, value_param
# example: create('pytest', ['2022-11-11 23:56:29', 'xyz789'])


def create(table, values_list):
    try:
        # get columns for table - lookup table from config
        # col_list = next(iter([x['columns'] for x in config['schemas'] if x['table'] == table]), None)

        # get columns for table - lookup table from db, exclude identity column(s)
        cursor.execute(
            f"SHOW COLUMNS FROM {config['datasource']['database']}.{table};")
        col_list = []
        for x in cursor:
            if 'auto_increment' not in x:
                col_list.append(x[0])

        # if there are no errors getting column from table, build and execute query
        col_str = ", ".join([f'`{x}`' for x in col_list])
        val_str = ", ".join([f"'{x}'" for x in values_list])
        query = f"INSERT INTO {config['datasource']['database']}.{table}({col_str}) VALUES ({val_str});"
        # print(query)
        cursor.execute(query)
        db.commit()
        print(f'Created {cursor.rowcount} record(s)')

    except Exception as e:
        print(f'An exception occurred: {e}')


def main(message: func.ServiceBusMessage, signalRMessages: func.Out[str]) -> None:
    # Log the Service Bus Message as plaintext

    # message_content_type = message.content_type
    message_body = message.get_body().decode('utf-8')

    salt = uuid.uuid4().hex
    hashed = hashlib.sha256((message_body + salt).encode('utf-8')).hexdigest()

    dt = datetime.now()
    dt_string = dt.strftime('%Y-%m-%d %H:%M:%S')

    logging.info('Python ServiceBus topic trigger processed message.')
    logging.info('Message Body: ' + message_body)
    logging.info('Hashed: ' + hashed)

    create(config['datasource']['table'], [dt_string, hashed])

    logging.info('Wrote to database: ' + dt_string + ', ' + hashed)

    signalRMessages.set(json.dumps({
        'target': 'newMessage',
        'arguments': [hashed]
    }))

    # return json.dumps({
    #     'value': hashed
    # })
    # TODO set binding for signalR
    # example of how to set binding: https://stackoverflow.com/questions/62788985/trying-to-trigger-an-url-from-azure-functions-using-python-errored-saying-with
