from pydantic import BaseModel

class OverrideSchema(BaseModel):
    inputSetData: str
    accountIdentifier: str
    def __init__(self, inputSetData, accountIdentifier):
        super().__init__(inputSetData=inputSetData, accountIdentifier=accountIdentifier)

