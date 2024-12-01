from pydantic import BaseModel

class PipelineSchema(BaseModel):
    data: str
    accountIdentifier: str
    branch: str

    def __init__(self, data, accountIdentifier, branch):
        super().__init__(data=data, accountIdentifier=accountIdentifier,
                         branch=branch)

