from app.datagenerator.TemplateGenerator import TemplateGenerator
from app.schemas.config.ConfigSchema import ConfigSchema
import json
import settings
from repository.Repository import Repository
from services.Utility import get_config_file, get_template_file, get_template_generated
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema

class ConfigManagement:

    def apply_configuration(self, config_info: ConfigSchema):
        output = TemplateGenerator.apply_configuration(config_info)
        return output

    def save_configuration(config_info: ConfigSchema):
        Repository.save_configuration(config_info)

    def get_all_configuration():
        return Repository.get_all_configuration()

    def read_configuration(application_name: str, env_name: str, configuration_file_name: str):
        dummy:  dict = {}
        configInfo_request = ConfigSchema(dummy, application_name, env_name, configuration_file_name)
        object_content = Repository.get_object(get_config_file(configInfo_request))
        configInfo = ConfigSchema(json.loads(object_content), application_name, env_name, configuration_file_name)
        return configInfo

    def generate_configuration(configInfo : ConfigTemplateSchema):
        object_content = Repository.get_object(get_config_file(configInfo))
        template_file_content = Repository.get_object(get_template_file(configInfo))
        templateGenerated = TemplateGenerator.apply_configuration(json.loads(object_content), ConfigManagement.get_config(configInfo).decode('UTF-8'))
        Repository.generate_object(configInfo, templateGenerated)
        return {"template_generated": templateGenerated}

    def get_config(config_info: ConfigSchema):
        object_content = Repository.get_object(get_config_file(config_info))
        return object_content
    def create_template(data: str, config_info: TemplateCreateSchema):
        Repository.create_template(data, config_info)