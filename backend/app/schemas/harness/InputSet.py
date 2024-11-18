from pydantic import BaseModel
    
class InputSchema(BaseModel):
    inputSetData: str
    accountIdentifier: str
    orgIdentifier: str
    projectIdentifier: str
    pipelineIdentifier: str

    def __init__(self, inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, pipelineIdentifier):
        super().__init__(inputSetData=inputSetData, accountIdentifier=accountIdentifier, orgIdentifier=orgIdentifier, projectIdentifier=projectIdentifier,
                         pipelineIdentifier=pipelineIdentifier)
