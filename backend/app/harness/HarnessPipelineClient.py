import requests
from settings import settings

class HarnessPipelineClient:
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

    def create_pipeline(self,  org_identifier, project_identifier, branch, data):
        """Creates a pipeline in the Harness API."""
        url = f"{self.base_url}/gateway/pipeline/api/pipelines/v2?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}&branch={branch}"

        try:
            response = requests.put(url, headers=self.headers, json=data, params=self.params, proxies=self.proxy)
            # Check if the request was successful
            if response.status_code == 200:
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                raise ValueError(response.text)
        except requests.RequestException as e:
            print("An error occurred:", e)
            raise ValueError(e)
    def create_the_pipeline(self, account_id, branch, data):
        """Creates a pipeline and prints the response."""

        client = HarnessPipelineClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        response_data = client.create_pipeline(
            org_identifier=data['orgIdentifier'],
            project_identifier=data['projectIdentifier'],
            branch=branch,
            data=data
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the pipeline.")