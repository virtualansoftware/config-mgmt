from pydantic import BaseModel
    
class ConfigTemplateSchema(BaseModel):
    application_name: str
    env_name: str
    configuration_file_name: str

    def __init__(self, application_name, env_name, configuration_file_name):
        super().__init__( application_name=application_name, env_name=env_name, configuration_file_name=configuration_file_name)
