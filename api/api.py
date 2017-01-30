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
            filters = ','.join(search_filters[:-1])
        response = func(filters, **kwargs)
        return response
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
        resp = requests.get(spotify_url + 'search', params=payload)
        if resp.status_code == 200:
            response = {'items': []}
            for filt in search_filters[:-1]:
                # Response has plurals (tracks, albums, etc)
                plural = filt + 's'
                if plural in resp.json():
                    response['items'] = resp.json()[plural]['items'] + response['items']
            return response
        else:
            body = {'status': resp.status_code, 'msg': 'Unexpected error: {}'.format(resp)}
            return HTTPResponse(status=resp.status_code, body=body)
    except requests.exceptions.RequestException as e:
        return HTTPResponse(status=500, body={'error': '{}'.format(e)})

run(host='localhost', port=3001)
