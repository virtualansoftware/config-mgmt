#  Copyright (c) 2024. Virtualan Contributors (https://virtualan.io)
#   Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except  in compliance with the License.
#   You may obtain a copy of the License at
#   http://www.apache.org/licenses/LICENSE-2.0
#   Unless required by applicable law or agreed to in writing, software distributed under the License  is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and limitations under the License.

from settings import settings
from app.schemas.config.ConfigSchema import ConfigSchema
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema

def get_config_file(config_info: ConfigSchema):
    return settings.APPLICATION_PREFIX + '/' + config_info.application_name + '/' + config_info.env_name + '/' + config_info.configuration_file_name + '.json'


def get_template_file(config_info: TemplateCreateSchema):
    return settings.TEMPLATE_PREFIX + '/' +config_info.application_name+'/'+config_info.configuration_file_name + '.tpl'

def get_template_generated(config_info: ConfigTemplateSchema):
    return settings.GENERATED_PREFIX + '/' + config_info.application_name + '/' + config_info.env_name + '/' + config_info.configuration_file_name

