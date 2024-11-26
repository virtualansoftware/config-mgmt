from pydantic import BaseModel

class OverrideSchema(BaseModel):
    inputSetData: str
    accountIdentifier: str
    orgIdentifier: str
    projectIdentifier: str

    def __init__(self, inputSetData, accountIdentifier, orgIdentifier, projectIdentifier):
        super().__init__(inputSetData=inputSetData, accountIdentifier=accountIdentifier,
                         orgIdentifier=orgIdentifier, projectIdentifier=projectIdentifier)

