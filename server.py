from flask import Flask, escape, request

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/test')
def test():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    return f'You are at '+lat+', '+lng
