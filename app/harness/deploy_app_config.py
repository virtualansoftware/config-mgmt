import requests





response = requests.post(url, data=data, headers={"Content-Type": "application/json"})


# print(response)
# sid = response.json()['platform']['login']['sessionId']
# print(response.text)
# print(sid)
