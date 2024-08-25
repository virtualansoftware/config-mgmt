from app.datagenerator.process_template import apply_configuration
from app.schemas.config.ConfigSchema import ConfigSchema
import json

from repository.TemplateRepo import SaveConfigurationRepo, GenerateObjectRepo, GetObjectRepo, get_all_configuration


def ApplyConfiguration(key_Id: str, raw_data: str, template_file_content: str):
    output = apply_configuration(key_Id, raw_data, template_file_content)
    return output


def SaveConfiguration(config_info: ConfigSchema):
    SaveConfigurationRepo(config_info)


def read_configuration_all():
    print("start-services")
    return get_all_configuration()


def ReadConfiguration(env_name: str, key_id: str, file_name: str):
    object_content = GetObjectRepo()
    configInfo = ConfigSchema(json.loads(object_content), key_id, env_name, file_name)
    return configInfo


def GenerateConfiguration(env_name: str, key_id: str, template_file_name: str, file_name: str):
    object_content = GetObjectRepo('config-mgmt/application/'  + key_id + '/' + env_name + '/' + file_name+'.json')

    TEMPLATE_FILE = 'config-mgmt/templates/applications/' + key_id + '/' + template_file_name

    template_file_content = GetObjectRepo(TEMPLATE_FILE)

    templateGenerated = ApplyConfiguration(key_id, json.loads(object_content), template_file_content.decode('UTF-8'))

    GenerateObjectRepo(env_name, key_id, template_file_name, templateGenerated)

    return {"template_generated": templateGenerated}


def GetConfig(env_name, key_id, file_name):
    object_content = GetObjectRepo('config-mgmt/'  + key_id + '/' + + env_name + '/' + file_name+ '.json')
    return object_content
