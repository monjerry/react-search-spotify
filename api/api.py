from bottle import route, run, template

@route('/')
def index():
    return {'healthcheck': 200}

run(host='localhost', port=8080, reloader=True)