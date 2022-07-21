import time
import psycopg2
import psycopg2.extras as ext
from flask import Flask

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
    sql = "SELECT DISTINCT origin_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM flights_prototype_data JOIN airports ON flights_prototype_data.origin_id = airports.iata_code WHERE country = 'ENGLAND'"
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    origin_dict = {}

    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        origin_dict[list_airports[i][0]] = coords

    print(origin_dict)
    return origin_dict

@app.route('/application/outwards/<iata_code>')
def get_outward_airports(iata_code):
    print("Origin airport selected: " + iata_code)
    # Get list of outward airports from DB
    sql = "SELECT DISTINCT destination_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM flights_prototype_data JOIN airports ON flights_prototype_data.destination_id = airports.iata_code WHERE origin_id = '" + iata_code + "'"
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    outward_dict = {}

    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        outward_dict[list_airports[i][0]] = coords

    print(outward_dict)
    return outward_dict

@app.route('/application/return/<inbound_iata_code>')
def get_return_airports(inbound_iata_code):
    print("Outward airport selected: " + inbound_iata_code)
    # Return airports with route destination in England
    # TODO - alter query to only return flights after the outward date
    sql = "SELECT DISTINCT t.origin_id, t1.place_name, t1.latitude_decimal_degrees, t1.longitude_decimal_degrees FROM flights_prototype_data t JOIN airports t1 ON t1.iata_code = t.origin_id JOIN airports t2 ON t2.iata_code = t.destination_id WHERE t2.country = 'ENGLAND'"
    list_airports = run_sql(sql)

    # Create dictionary of airport ids and lat/lng
    return_dict = {}

    for i in range(len(list_airports)):
        coords = {}
        coords['place_name'] = list_airports[i][1]
        coords['lat'] = list_airports[i][2]
        coords['lng'] = list_airports[i][3]
        return_dict[list_airports[i][0]] = coords

    print(return_dict)
    return return_dict

@app.route('/application/get_prices/<origin_iata_code>/<destination_iata_code>/<outward_day>/<outward_month>/<outward_year>')
def get_prices(origin_iata_code, destination_iata_code, outward_day, outward_month, outward_year):
    print('Prices for route requested: ' + origin_iata_code + '->' + destination_iata_code)
    # Return date and price of cheapest flight between the two airports
    if outward_day != 'null':
        # Query for flights back to origin country after the cutoff date and within reasonable time frame of first flight
        sql = "SELECT day, month, year, price FROM flights_prototype_data WHERE origin_id ='" + origin_iata_code + "' AND destination_id ='" + destination_iata_code + "'AND ((year > '" + outward_year + "') OR (year = '" + outward_year + "' AND month > '" + outward_month + "') OR (year = '" + outward_year + "' AND month = '" + outward_month + "' AND day >= '" + outward_day + "')) ORDER BY price ASC LIMIT 1"
    else:
        # No cutoff date applied
        sql = "SELECT day, month, year, price FROM flights_prototype_data WHERE origin_id ='" + origin_iata_code + "' AND destination_id ='" + destination_iata_code + "' ORDER BY price ASC LIMIT 1"

    # Run query
    retrieve_cheapest = run_sql(sql)

    print(retrieve_cheapest)

    # Create dictionary to store prices
    prices = {}

    # Prepare cheapest flight details and add to prices dictionary
    cheapest_flight = {}
    cheapest_flight['date'] = str(retrieve_cheapest[0][0]) + '/' + str(retrieve_cheapest[0][1]) + '/' + str(retrieve_cheapest[0][2])
    cheapest_flight['price'] = str(retrieve_cheapest[0][3])
    prices['cheapest_flight'] = cheapest_flight

    # TODO - add second query retrieving all prices for the route

    print(prices)
    return prices



    