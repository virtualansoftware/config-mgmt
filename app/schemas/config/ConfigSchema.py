from pydantic import BaseModel
    
class ConfigSchema(BaseModel):
    configMap: dict
    keyId: str
    envName: str
    appName: str

    def __init__(self, configMap, keyId, envName, appName):
        super().__init__(configMap=configMap, keyId=keyId, envName=envName, appName=appName)
