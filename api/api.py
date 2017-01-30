from bottle import Bottle, abort, HTTPResponse, request, response, route, run
import requests

from cfg.dev import *

app = Bottle()


@app.hook('after_request')
def enable_cors():
    """
    This is for dealing with cors. React app starts in another port so I needed a way to pass CORS without having a server
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


def search_validator(func):
    """ Checks that request has a query, and it validates the type so that we don't call spotify innecessary """
   def func_wrapper(filters, **kwargs):
        if request.query.query:
            kwargs['query'] = request.query.query
        else:
            return HTTPResponse(status=400, body={'status': 400, 'msg': 'You need to add the query param'})
        if not filters in search_filters:
            return HTTPResponse(status=400, body={'status': 400, 'msg': 'Valid filters are {}'.format(', '.join(search_filters))})
        if filters == 'all':
            filters = ','.join(search_filters[:-1])
        resp = func(filters, **kwargs)
        return resp
   return func_wrapper

@app.route('/healthcheck')
def index():
    """ Healthcheck endpoint """
    return {'healthcheck': 200}


@app.route('/search/<filters>')
@search_validator
def search(filters, query=None):
    """ Search endpoint It makes a request to spotify api to do a search, if all is provided it will look all types
    Args:
        query (string): The keyword or query you are trying to make.
    """
    payload = {
        'q': 'name:{}'.format(query),
        'type': filters
    }
    try:
        resp = requests.get(spotify_url + 'search', params=payload)
        if resp.status_code == 200:
            finalResponse = {'items': []}
            for filt in search_filters[:-1]:
                # Response has plurals (tracks, albums, etc)
                plural = filt + 's'
                if plural in resp.json():
                    finalResponse['items'] = resp.json()[plural]['items'] + finalResponse['items']
            return finalResponse
        else:
            body = {'status': resp.status_code, 'msg': 'Unexpected error: {}'.format(resp)}
            return HTTPResponse(status=resp.status_code, body=body)
    except requests.exceptions.RequestException as e:
        return HTTPResponse(status=500, body={'error': '{}'.format(e)})

run(app, host='localhost', port=3001)
