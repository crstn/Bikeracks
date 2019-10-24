from flask import Flask, escape, request
import psycopg2

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/test')
def test():
    lat = float(request.args.get("lat", 54))
    lng = float(request.args.get("lng", 10))

    conn = psycopg2.connect("dbname='bikeracks' \
                         host='localhost' \
                         user='postgres' \
                         password='postgres'")

    cur = conn.cursor()
    cur.execute("""SELECT id, vejnavn, ST_AsGeoJSON(geom)
                   FROM racks
                   ORDER BY geom <-> 'SRID=4326;POINT(%s %s)'::geometry
                   LIMIT 5;""", (lng, lat))
    rows = cur.fetchall()

    output = ""

    for row in rows:
        output = output + row[2]

    cur.close()
    conn.close()

    output = """{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"test": "test"},
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.7421875,
          54.83577752045248
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {"test": "test"},
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.21875,
          54.583289756006316
        ]
      }
    }
  ]
}"""

    return output
