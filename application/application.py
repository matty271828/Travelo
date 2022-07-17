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
    sql = "SELECT DISTINCT origin_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM airport_routes JOIN airports ON airport_routes.origin_id = airports.iata_code WHERE country = 'ENGLAND'"
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
    sql = "SELECT DISTINCT destination_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM airport_routes JOIN airports ON airport_routes.destination_id = airports.iata_code WHERE origin_id = '" + iata_code + "'"
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

@app.route('/application/return/<outward_iata_code>/<return_to_iata_code>')
def get_return_airports(outward_iata_code, return_to_iata_code):
    print("Outward airport selected: " + outward_iata_code)
    # Get list of outward airports from DB
    # TODO add filtering of return journeys to be selected by price and distance from outward airport
    sql = "SELECT DISTINCT origin_id, place_name, latitude_decimal_degrees, longitude_decimal_degrees FROM airport_routes JOIN airports ON airport_routes.origin_id = airports.iata_code WHERE destination_id = '" + return_to_iata_code + "'"
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



    