import requests
from settings import settings

class HarnessInputSetClient:
    def __init__(self, base_url, account_id, api_key):
        self.base_url = base_url
        self.account_id = account_id
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

        self.params = {
            "accountIdentifier": account_id
        }

        self.proxy = {
            "http": settings.PROXY
        }

    def create_input_set(self, org_identifier, project_identifier, pipeline_identifier, branch, data):
        """Creates an input set in the Harness API."""
        url = f"{self.base_url}/gateway/pipeline/api/inputSets?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}&pipelineIdentifier={pipeline_identifier}&branch={branch}"
        try:
            response = requests.post(url, headers=self.headers, json=data, params=self.params, proxies=self.proxy)
            if response.status_code == 200:
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                raise ValueError(response.text)
        except requests.RequestException as e:
            print("An error occurred:", e)
            raise ValueError(e)


def create_harness_input_set( account_id, branch, data):

        client = HarnessInputSetClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        """Creates an input set and prints the response."""
        response_data = client.create_input_set(
            org_identifier=data['orgIdentifier'],
            project_identifier=data['projectIdentifier'],
            pipeline_identifier=data['pipelineIdentifier'],
            branch=branch,
            data=data
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the input set.")