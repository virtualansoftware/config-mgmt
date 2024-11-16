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

    def create_input_set(self, org_identifier, project_identifier, pipeline_identifier, branch, data):
        """Creates an input set in the Harness API."""
        url = f"{self.base_url}/gateway/pipeline/api/inputSets?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}&pipelineIdentifier={pipeline_identifier}&branch={branch}"

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

    def create_harness_input_set( account_id, org_identifier, project_identifier, pipeline_identifier, branch, data):

        client = HarnessInputSetClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        """Creates an input set and prints the response."""
        response_data = client.create_input_set(
            org_identifier=org_identifier,
            project_identifier=project_identifier,
            pipeline_identifier=pipeline_identifier,
            branch=branch,
            data=data
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to create the input set.")