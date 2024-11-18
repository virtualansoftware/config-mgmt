from pydantic import BaseModel

class PipelineSchema(BaseModel):
    inputSetData: str
    accountIdentifier: str
    orgIdentifier: str
    projectIdentifier: str
    branch: str

    def __init__(self, inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, branch):
        super().__init__(inputSetData=inputSetData, accountIdentifier=accountIdentifier,
                         orgIdentifier=orgIdentifier, projectIdentifier=projectIdentifier, branch=branch)

