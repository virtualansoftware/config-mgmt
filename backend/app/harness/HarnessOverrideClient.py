import requests
from settings import settings

class HarnessOverrideClient:
    def __init__(self, base_url, account_id, api_key):
        self.base_url = base_url
        self.account_id = account_id
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

    def create_service_override(self, org_identifier, project_identifier, pipeline_identifier, branch, data):
        """Creates an input set in the Harness API."""
        url = f"{self.base_url}/ng/api/serviceOverrides?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}"
        try:
            response = requests.post(url, headers=self.headers, json=data)
            if response.status_code == 200:
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                return None
        except requests.RequestException as e:
            print("An error occurred:", e)
            return None


    def update_service_override(self, org_identifier, project_identifier, pipeline_identifier, branch, data):
        """Creates an input set in the Harness API."""
        url = f"{self.base_url}/ng/api/serviceOverrides?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}"
        try:
            response = requests.put(url, headers=self.headers, json=data)
            if response.status_code == 200:
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                return None
        except requests.RequestException as e:
            print("An error occurred:", e)
            return None


    def update_harness_service_override( account_id, org_identifier, project_identifier, data):

        client = HarnessOverrideClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        """Creates an input set and prints the response."""
        response_data = client.update_service_override(
            org_identifier=org_identifier,
            project_identifier=project_identifier,
            data=data
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the input set.")

    def create_harness_service_override( account_id, org_identifier, project_identifier, data):

        client = HarnessOverrideClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        """Creates an input set and prints the response."""
        response_data = client.create_service_override(
            org_identifier=org_identifier,
            project_identifier=project_identifier,
            data=data
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the input set.")