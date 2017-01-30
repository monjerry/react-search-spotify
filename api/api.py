from bottle import abort, HTTPResponse, request, route, run
import requests

from cfg.dev import *


def search_validator(func):
   def func_wrapper(filters, **kwargs):
        if request.query.query:
            kwargs['query'] = request.query.query
        else:
            return HTTPResponse(status=400, body={'status': 400, 'msg': 'You need to add the query param'})
        if not filters in search_filters:
            return HTTPResponse(status=400, body={'status': 400, 'msg': 'Valid filters are {}'.format(', '.join(search_filters))})
        if filters == 'all':
            filters = search_filters[:-1]
        return func(filters, **kwargs)
   return func_wrapper

@route('/healthcheck')
def index():
    return {'healthcheck': 200}


@route('/search/<filters>')
@search_validator
def search(filters, query=None):

    payload = {
        'q': 'name:{}'.format(query),
        'type': filters
    }
    try:
        response = requests.get(spotify_url + 'search', params=payload)
        if response.status_code == 200:
            return response.json()
        else:
            body = {'status': response.status_code, 'msg': 'Unexpected error: {}'.format(response)}
            return HTTPResponse(status=response.status_code, body=body)
    except requests.exceptions.RequestException as e:
        return HTTPResponse(status=500, body={'error': '{}'.format(e)})

run(host='localhost', port=8080)