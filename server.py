from flask import Flask, escape, request, Response
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

    output = """{
  "type": "FeatureCollection",
  "features": ["""

    for row in rows:

        output = output + '''{
          "type": "Feature",
          "properties": {
              "id": '''+str(row[0])+''',
              "streetname": "'''+row[1]+'''"},
          "geometry": '''+row[2]+'''
        },'''


    output = output[:-1] + """]
  }"""


    cur.close()
    conn.close()





    return Response(response=output,
                    status=200,
                    mimetype="application/json")
