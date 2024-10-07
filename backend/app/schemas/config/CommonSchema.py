from pydantic import BaseModel

class CommonSchema(BaseModel):
    commonMap: dict
    env_name: str

    def __init__(self, commonMap, env_name):
        super().__init__(commonMap=commonMap, env_name=env_name)