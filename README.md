# Configuration Management

## Overview

Configuration Management is a FastAPI application designed to manage and retrieve configuration files efficiently. It utilizes Pydantic for data validation and settings management, ensuring a robust and scalable solution for handling application configurations.

## Features

- **RESTful API**: Easily access configuration data through well-defined endpoints.
- **React Frontend**: Intuitive user interface for managing configurations.
- **Environment Variable Management**: Securely manage sensitive information using environment variables.
- **Logging**: Comprehensive logging to track application behavior and issues.
- **Flexible Configuration**: Use Pydantic models to define and validate configurations dynamically.

## Getting Started

### Prerequisites

- Python 3.7+ for the backend
- Node.js and npm for the frontend
- Virtual Environment (recommended) for Python dependencies
- Dependencies listed in `requirements.txt` for the backend

### Backend Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/virtualansoftware/config-mgmt.git
   cd config-mgmt
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up your environment variables in a `.env` file:

   ```plaintext
   STORAGE_BUCKET_NAME=your_bucket_name
   AWS_ACCESS_KEY=your_access_key
   AWS_SECRET_KEY=your_secret_key
   API_KEY=your_api_key
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   OAUTH_TOKEN_URL=your_oauth_token_url
   GITHUB_REPO_NAME=your_github_repo_name
   GITHUB_TOKEN=your_github_token
   GITHUB_HOST_URL=your_github_host_url
   BRANCH=your_branch
   COLUMNS=your_columns
   ```

### Backend Running

To start the application, use the following command:

```bash
uvicorn main:app --reload
```

Or, if you are using Windows, you can run the application with:

```bash
python -m uvicorn main:app --reload
```

Your backend application will be running at `http://localhost:8000`.

### Frontend Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

### Frontend Running

To start the frontend application, use the following command:

```bash
npm run dev
```

Your frontend application will be running at `http://localhost:5173`.

## API Documentation

API endpoints can be accessed via Swagger UI at `http://localhost:8000/docs`.

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the FastAPI and Pydantic communities for their excellent documentation and support.
- Thanks to the React community for providing a powerful library for building user interfaces.
