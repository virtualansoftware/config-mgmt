import requests

class ApiClient:
    def __init__(self, base_url):
        # Initialize the client with a base URL
        self.base_url = base_url

    def post_data(self, endpoint, data):
        """Sends a POST request with JSON data to the specified endpoint."""
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.post(url, json=data)
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

# Usage example
# if __name__ == "__main__":
#     client = ApiClient("https://example.com/api")
#     data = {
#         "name": "John Doe",
#         "email": "johndoe@example.com",
#         "message": "Hello, this is a test!"
#     }
#     response_data = client.post_data("submit", data)
#     if response_data:
#         print("Response data:", response_data)
