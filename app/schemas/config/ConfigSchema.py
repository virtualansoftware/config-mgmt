from pydantic import BaseModel
    
class ConfigSchema(BaseModel):
    configMap: dict
    keyId: str
    envName: str

    def __init__(self, configMap, keyId, envName):
        super().__init__(configMap=configMap, keyId=keyId, envName=envName)
