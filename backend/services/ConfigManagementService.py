from app.datagenerator.TemplateGenerator import TemplateGenerator
from app.schemas.config.ConfigSchema import ConfigSchema
import json
from settings import settings
from repository.GitRepository import GitRepository
from services.Utility import get_config_file, get_template_file, get_template_generated
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema

class ConfigManagement:

    def read_configuration_columns():
        return settings.COLUMNS


    def apply_configuration(self, config_info: ConfigSchema):
        output = TemplateGenerator.apply_configuration(config_info)
        return output

    def save_configuration(config_info: ConfigSchema):
        GitRepository.save_configuration(get_config_file(config_info),  config_info.configMap,  "Successfully Configuration Created...")

    def get_all_configuration():
        return GitRepository.get_all_configuration()

    def get_all_template():
        return GitRepository.get_all_template()

    def get_all_generated_configurations():
        return GitRepository.get_all_generated_configurations()

    def read_configuration(application_name: str, env_name: str, configuration_file_name: str):
        dummy:  dict = {}
        configInfo_request = ConfigSchema(dummy, application_name, env_name, configuration_file_name)
        object_content = GitRepository.getObject(get_config_file(configInfo_request))
        configInfo_request = ConfigSchema(json.loads(object_content), application_name, env_name, configuration_file_name)
        return configInfo_request

    def read_template(application_name: str, configuration_file_name: str):
        configInfo_request = TemplateCreateSchema( application_name,  configuration_file_name)
        object_content = GitRepository.getObject(get_template_file(configInfo_request))

        configInfo = ConfigSchema(json.loads(object_content), application_name, env_name, configuration_file_name)
        return configInfo


    def read_template(application_name: str, configuration_file_name: str):
        configInfo_request = TemplateCreateSchema(application_name, configuration_file_name)
        object_content = GitRepository.getObject(get_template_file(configInfo_request))
        return object_content


    def generate_configuration(configInfo : ConfigTemplateSchema):
        object_content = GitRepository.getObject(get_config_file(configInfo))
        template_file_content = GitRepository.getObject(get_template_file(configInfo))
        templateGenerated = TemplateGenerator.apply_configuration(json.loads(object_content), template_file_content.decode('UTF-8'))
        GitRepository.generate_object(fileName=get_template_generated(configInfo),templateGenerated=templateGenerated.format(), commitMessage="Template Generated... ")
        return {"template_generated": templateGenerated}

    def get_config(config_info: ConfigSchema):
        object_content = GitRepository.getObject(get_config_file(config_info))
        return object_content
    def create_template(data: str, config_info: TemplateCreateSchema):
        # Repository.create_template(data, config_info)
        GitRepository.createFile(get_template_file(config_info),  data,  "Successfully created template...")

    def read_generated_template(config_info: ConfigTemplateSchema):
        object_content = GitRepository.getObject(get_template_generated(config_info))
        return object_content


