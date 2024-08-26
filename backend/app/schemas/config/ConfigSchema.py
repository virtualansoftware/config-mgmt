from pydantic import BaseModel
    
class ConfigSchema(BaseModel):
    configMap: dict
    application_name: str
    env_name: str
    configuration_file_name: str

    def __init__(self, configMap, application_name, env_name, configuration_file_name):
        super().__init__(configMap=configMap, application_name=application_name, env_name=env_name, configuration_file_name=configuration_file_name)
