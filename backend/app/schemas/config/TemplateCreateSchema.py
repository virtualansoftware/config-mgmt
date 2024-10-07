from pydantic import BaseModel
    
class TemplateCreateSchema(BaseModel):
    application_name: str
    configuration_file_name: str

    def __init__(self, application_name, configuration_file_name):
        super().__init__(application_name=application_name, configuration_file_name=configuration_file_name)
