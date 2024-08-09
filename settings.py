from pydantic_settings import BaseSettings, SettingsConfigDict
import os
import logging
from typing import Annotated, TypeVar
from pydantic import BaseModel, Extra, Field
from os.path import join, dirname
dotenv_path = join(dirname(__file__), '.env')

T = TypeVar("T")

ExcludedField = Annotated[T, Field(exclude=True)]
logging.basicConfig(filename="conf.log",
                    format='%(asctime)s %(message)s',
                    filemode='w')
class Settings(BaseSettings):
    app_name: str = "Configuration Management"
    app_name_desc: str = "Configuration Management"
    debug: bool = True
    secret_key: str = ''
    apiPrefix: str = "api"
    apiVersion: str = "v1"
    ALLOWED_HOSTS: list = []

    DATETIME_TIMEZONE: str = 'US/Central'
    DATETIME_FORMAT: str = '%Y-%m-%d %H:%M:%S'

    LOG_STDOUT_FILENAME: str = 'fapi_log_access.log'
    LOG_STDERR_FILENAME: str = 'fapi_log_error.log'

    TOKEN_EXPIRE_SECONDS: int = 86400  # Expiration time, unit: seconds ( 86400 = 1 * 24 * 60 * 60)
    TOKEN_SECRET_KEY: str = 'jwt_secret_key'
    TOKEN_ALGORITHM: str = 'HS256'
    STORAGE_BUCKET_NAME: str = os.getenv("STORAGE_BUCKET_NAME")
    AWS_ACCESS_KEY: str = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY: str = os.getenv("AWS_SECRET_KEY")
    API_KEY: str = os.getenv("API_KEY")
    CLIENT_ID: str = os.getenv("CLIENT_ID")
    CLIENT_SECRET: str = os.getenv("CLIENT_SECRET")
    OAUTH_TOKEN_URL: str = os.getenv("OAUTH_TOKEN_URL")


    model_config = SettingsConfigDict(extra=Extra.allow, env_file='.env', env_file_encoding='utf-8')

settings = Settings()
