from requests.auth import HTTPDigestAuth
import json
import requests
import requests.auth
from settings import settings


def get_token(scope):
    client_auth = requests.auth.HTTPBasicAuth(settings.CLIENT_ID, settings.CLIENT_SECRET)
    post_data = {"grant_type": "client_credentials",
                 "scope": scope
                 }
    response = requests.post(settings.TOKEN_URL,
                             auth=client_auth,
                             data=post_data)
    token_json = response.json()
    return token_json["access_token"]


def post_process(url: str):
    try:
        api_call_headers = {'Authorization': 'key ' + settings.API_KEY}
        response = requests.post(url, headers=api_call_headers, verify=True)
        if response.ok:
            jData = json.loads(response.content)
        else:
            return
    except requests.exceptions.RequestException as err:
        print("Error Occurred and Handled" + err.message)
        return "Error Occurred and Handled " + err.message

