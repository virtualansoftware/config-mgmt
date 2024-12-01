from pydantic import BaseModel

class PipelineSchema(BaseModel):
    inputSetData: str
    accountIdentifier: str
    branch: str

    def __init__(self, inputSetData, accountIdentifier, branch):
        super().__init__(inputSetData=inputSetData, accountIdentifier=accountIdentifier,
                         branch=branch)

