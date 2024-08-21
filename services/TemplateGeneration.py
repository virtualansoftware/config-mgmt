from app.datagenerator.process_template import apply_configuration
from app.schemas.config.ConfigSchema import ConfigSchema
import json

from repository.TemplateRepo import SaveConfigurationRepo,GenerateObjectRepo,GetObjectRepo

def ApplyConfiguration(key_Id: str, raw_data: str, template_file_content: str):
    output = apply_configuration(key_Id,raw_data,template_file_content)
    return output

async def SaveConfiguration(config_info: ConfigSchema):
    SaveConfigurationRepo(config_info)
        
async def ReadConfiguration(env_name: str, key_id: str):
    
    object_content = GetObjectRepo(env_name + '/' + key_id + '.json')
    configInfo = ConfigSchema(json.loads(object_content), key_id, env_name)  
    return configInfo

async def GenerateConfiguration(env_name: str, key_id: str, template_file_name: str):
    
    object_content = GetObjectRepo(env_name + '/' + key_id + '.json')
    
    TEMPLATE_FILE = 'config-mgmt/templates/applications/' + key_id + '/' + template_file_name

    template_file_content = GetObjectRepo(TEMPLATE_FILE)

    templateGenerated = ApplyConfiguration(key_id, json.loads(object_content), template_file_content.decode('UTF-8'))

    GenerateObjectRepo(env_name,key_id,template_file_name,templateGenerated)

    return {"template_generated": templateGenerated }

async def GetConfig(env_name, key_id):    
    object_content = GetObjectRepo(env_name + '/' + key_id + '.json')
    return object_content
    