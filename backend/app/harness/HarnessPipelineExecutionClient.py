import requests
from settings import settings


class HarnessPipelineExecutionClient:
    def __init__(self, base_url, account_id, api_key):
        self.base_url = base_url
        self.account_id = account_id
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

    def execute_pipeline(self, org_identifier, project_identifier, pipeline_identifier, data):
        """Executes the pipeline with the provided input set list."""
        url = f"{self.base_url}/pipeline/api/pipeline/execute/{pipeline_identifier}/inputSetList?accountIdentifier={self.account_id}&orgIdentifier={org_identifier}&projectIdentifier={project_identifier}"

        try:
            response = requests.post(url, headers=self.headers, json=data)
            # Check if the request was successful
            if response.status_code == 200:
                return response.json()  # Return JSON response data
            else:
                print(f"Request failed with status code: {response.status_code}")
                print("Response content:", response.text)
                return None
        except requests.RequestException as e:
            print("An error occurred:", e)
            return None

    def execute_and_print_pipeline(self, account_id, org_identifier, project_identifier):

        client = HarnessPipelineExecutionClient(
            base_url=settings.HARNESS_BASE_URL,
            account_id=account_id,
            api_key=settings.HARNESS_API_KEY
        )

        """Executes the pipeline and prints the response."""
        response_data = client.execute_pipeline(
            org_identifier=org_identifier,
            project_identifier=project_identifier,
        )

        if response_data:
            print("Response data:", response_data)
        else:
            print("Failed to execute the pipeline.")
