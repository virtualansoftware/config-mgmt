from pydantic import BaseModel
    
class ServiceSchema(BaseModel):
    serviceData: dict
    accountIdentifier: str

    def __init__(self, serviceData, accountIdentifier):
        super().__init__(serviceData=serviceData, accountIdentifier=accountIdentifier)
