import requests
from settings import settings


class HarnessAPIClient:
    def __init__(self, base_url, account_id, api_key):
        self.base_url = base_url
        self.account_id = account_id
        self.headers = {
            "Content-Type": "application/json",
            "Harness-Account": account_id,
            "x-api-key": api_key
        }

    def create_service(self, data):
        """Sends a POST request to create a service."""
        url = f"{self.base_url}/v1/services"
        try:
            response = requests.post(url, headers=self.headers, json=data)
            # Check if the request was successful
            if response.status_code == 200:
                print("Request was successful.")
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                return None
        except requests.RequestException as e:
            print("An error occurred:", e)
            return None

    def create_harness_service( account_id, data):
        # Call create_service with the prepared data
        client = HarnessAPIClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )
        response_data = client.create_service(data)
        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the service.")