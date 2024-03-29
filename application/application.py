import psycopg2
import psycopg2.extras as ext
from flask import Flask
from datetime import date, datetime

app = Flask(__name__)

# Data-fields
DATABASE_URL = 'postgres://matthewmaclean:123@localhost:5432/flights_db'
hostname = 'localhost'
username = 'matthewmaclean'
password = '123'
database = 'flights_db'

def run_sql(sql):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=ext.DictCursor)
        cur.execute(sql)
        conn.commit()
        results = cur.fetchall()
        #print(results)
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            
    return results

@app.route('/application/origins')
def get_origin_airports():
    # Get list of valid origin airports from DB
    sql = "SELECT DISTINCT origin_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM flights_data JOIN airports ON flights_data.origin_id = airports.iata_code WHERE country = 'ENGLAND'"
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    origin_dict = {}

    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        origin_dict[list_airports[i][0]] = coords

    #print(origin_dict)
    return origin_dict

@app.route('/application/outwards/<iata_code>/<outward_day>/<outward_month>/<outward_year>')
# Retrieve available outward airports and their cheapest prices
def get_outward_airports(iata_code, outward_day, outward_month, outward_year):
    # TODO - merge this into one query
    start_request_time = datetime.now()

    print("Origin airport selected: " + iata_code)

    # Get list of outward airports from DB
    if outward_day != 'null':
        # Cut off date applied 
        sql = "SELECT DISTINCT ON (t.destination_id) t.destination_id, t1.place_name, t1.latitude_decimal_degrees, t1.longitude_decimal_degrees, t.price, t.day, t.month, t.year FROM flights_data t JOIN airports t1 ON t1.iata_code = t.destination_id WHERE t.origin_id = '" + iata_code + "' AND ((year > '" + outward_year + "') OR (year = '" + outward_year + "' AND month > '" + outward_month + "') OR (year = '" + outward_year + "' AND month = '" + outward_month + "' AND day >= '" + outward_day + "')) ORDER BY t.destination_id, t.price, t.year, t.month, t.day ASC"
    else:
        # No cutoff date applied
        sql = "SELECT DISTINCT ON (t.destination_id) t.destination_id, t1.place_name, t1.latitude_decimal_degrees, t1.longitude_decimal_degrees, t.price, t.day, t.month, t.year FROM flights_data t JOIN airports t1 ON t1.iata_code = t.destination_id WHERE t.origin_id = '" + iata_code + "' ORDER BY t.destination_id, t.price, t.year, t.month, t.day ASC"
        
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    outward_dict = {}
    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        coords['cheapest_price'] = list_airports[i][4]
        coords['cheapest_date'] = f"{list_airports[i][5]}/{list_airports[i][6]}/{str(list_airports[i][7])[2]}{str(list_airports[i][7])[3]}"
        outward_dict[list_airports[i][0]] = coords

    # Output to terminal
    #print(outward_dict)

    # Output time to process request
    total_request_time = datetime.now() - start_request_time
    print(f"Outward request completed in: {total_request_time}")

    return outward_dict

@app.route('/application/return/<inbound_iata_code>/<outward_day>/<outward_month>/<outward_year>')
def get_return_airports(inbound_iata_code, outward_day, outward_month, outward_year):
    start_request_time = datetime.now()
    print("Outward airport selected: " + inbound_iata_code)
    # Return airports with route destination in England after the outward date
    sql = "SELECT DISTINCT ON (t.origin_id) t.origin_id, t1.place_name, t1.latitude_decimal_degrees, t1.longitude_decimal_degrees, t.price, t.day, t.month, t.year FROM flights_data t JOIN airports t1 ON t1.iata_code = t.origin_id JOIN airports t2 ON t2.iata_code = t.destination_id WHERE t2.country = 'ENGLAND' AND ((year > '" + outward_year + "') OR (year = '" + outward_year + "' AND month > '" + outward_month + "') OR (year = '" + outward_year + "' AND month = '" + outward_month + "' AND day >= '" + outward_day + "')) ORDER BY t.origin_id, t.price, t.year, t.month, t.day ASC"
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    return_dict = {}

    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        coords['cheapest_price'] = list_airports[i][4]
        coords['cheapest_date'] = f"{list_airports[i][5]}/{list_airports[i][6]}/{str(list_airports[i][7])[2]}{str(list_airports[i][7])[3]}"
        return_dict[list_airports[i][0]] = coords

    # Output to terminal
    #print(return_dict)

    # Output time to process request
    total_request_time = datetime.now() - start_request_time
    print(f"Return request completed in: {total_request_time}")

    return return_dict

@app.route('/application/get_prices/<origin_iata_code>/<destination_iata_code>/<outward_day>/<outward_month>/<outward_year>')
def get_prices(origin_iata_code, destination_iata_code, outward_day, outward_month, outward_year):
    print('Prices for route requested: ' + origin_iata_code + '->' + destination_iata_code)
    # Create dictionary to store prices and generate key for each month
    monthly_dict = {}
    for i in range(1, 13):
        monthly_dict[str(i)] = {}
        for j in range(1, 32):
            monthly_dict[str(i)][str(j)] = {}

    # Add monthly dictionarys to each year in prices
    prices = {'cheapest_flight':{}, 'all_prices':{'2022': {}, '2023': {}}}
    for key in prices['all_prices']:
        prices['all_prices'][key] = monthly_dict



    # Run first query        
    # Return date and price of cheapest flight between the two airports
    if outward_day != 'null':
        # Query for flights back to origin country after the cutoff
        # TODO - filter return dates by reasonable timeframe
        sql = "SELECT day, month, year, price FROM flights_data WHERE origin_id ='" + origin_iata_code + "' AND destination_id ='" + destination_iata_code + "'AND ((year > '" + outward_year + "') OR (year = '" + outward_year + "' AND month > '" + outward_month + "') OR (year = '" + outward_year + "' AND month = '" + outward_month + "' AND day >= '" + outward_day + "')) ORDER BY price, year, month, day ASC LIMIT 1"
    else:
        # No cutoff date applied
        sql = "SELECT day, month, year, price FROM flights_data WHERE origin_id ='" + origin_iata_code + "' AND destination_id ='" + destination_iata_code + "' ORDER BY price, year, month, day ASC LIMIT 1"

    # Run query
    retrieve_cheapest = run_sql(sql)
    #print(retrieve_cheapest)
    
    # Prepare cheapest flight details and add to prices dictionary
    cheapest_flight = {}
    cheapest_flight['date'] = str(retrieve_cheapest[0][0]) + '/' + str(retrieve_cheapest[0][1]) + '/' + str(retrieve_cheapest[0][2])
    cheapest_flight['price'] = str(retrieve_cheapest[0][3])
    prices['cheapest_flight'] = cheapest_flight



    # Run second query retrieving all prices for the route
    sql = "SELECT day, month, year, price FROM flights_data WHERE origin_id = '" + origin_iata_code + "' and destination_id = '" + destination_iata_code + "'"

    # Run query
    retrieve_allprices = run_sql(sql)

    # Prepare prices and add to prices dictionary
    for i in range(len(retrieve_allprices)):
        # Prepare price and date
        year = str(retrieve_allprices[i][2])
        month = str(retrieve_allprices[i][1])
        day = str(retrieve_allprices[i][0])
        price = str(retrieve_allprices[i][3])

        # Add to prices dictionary
        prices['all_prices'][year][month][day] = price

    #print(prices)
    return prices




    