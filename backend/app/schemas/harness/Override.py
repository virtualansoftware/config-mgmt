from pydantic import BaseModel

class OverrideSchema(BaseModel):
    data: str
    accountIdentifier: str
    def __init__(self, data, accountIdentifier):
        super().__init__(data=data, accountIdentifier=accountIdentifier)

