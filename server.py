from flask import Flask, escape, request
import psycopg2

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/test')
def test():
    lat = request.args.get("lat")
    lng = request.args.get("lng")

    conn = psycopg2.connect("dbname='bikeracks' \
                         host='localhost' \
                         user='postgres' \
                         password='postgres'")

    cur = conn.cursor()
    cur.execute("""SELECT id, vejnavn, ST_AsGeoJSON(geom)
                   FROM racks
                   ORDER BY geom <-> 'SRID=4326;POINT(12.54219056648356 55.65044347879956)'::geometry
                   LIMIT 5;""")
    rows = cur.fetchall()

    output = ""

    for row in rows:
        output = output + row[2]

    cur.close()
    conn.close()

    return output
