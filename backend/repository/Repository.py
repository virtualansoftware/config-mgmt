import json

from jinja2 import UndefinedError

from settings import settings
import boto3
from app.schemas.config.ConfigSchema import ConfigSchema
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from services.Utility import get_config_file, get_template_generated, get_template_file
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema

def get_s3client():
    return boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_KEY)

class Repository:
    def save_configuration(config_info: ConfigSchema):
        s3_client = get_s3client()
        json_object = json.dumps(config_info.configMap, indent=4)
        s3_client.put_object(Body=json_object, Bucket=settings.STORAGE_BUCKET_NAME,
                             Key=get_config_file(config_info))

    def get_object(file: str):
        s3_client = get_s3client()
        s3_response_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME, Key=file)
        return s3_response_object['Body'].read()

    def generate_object(config_info: ConfigTemplateSchema, templateGenerated: str):
        s3_client = get_s3client()
        s3_client.put_object(Body=templateGenerated, Bucket=settings.STORAGE_BUCKET_NAME,
                             Key=get_template_generated(config_info))

    def get_all_configuration():
        try:
            s3_client = get_s3client()
            result = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME, Prefix=settings.APPLICATION_PREFIX, Delimiter='/')
            my_map = dict()

            if result.get('CommonPrefixes') is not None:
                for o in result.get('CommonPrefixes'):
                    if o is not None:
                        print(o.get('Prefix'))
                        result_child = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME,
                                                              Prefix=o.get('Prefix'),
                                                              Delimiter='/')
                        key = o.get('Prefix')[0:o.get('Prefix').rindex("/")]
                        key = key[key.rindex("/") + 1: len(key)]
                        print(key)
                        my_child_map = dict()
                        if result_child.get('CommonPrefixes') is not None:
                            for oc in result_child.get('CommonPrefixes'):
                                if oc is not None:
                                    value = oc.get('Prefix')[0:oc.get('Prefix').rindex("/")]
                                    value = value[value.rindex("/") + 1: len(value)]
                                    result_child_file = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME,
                                                                               Prefix=oc.get('Prefix'), Delimiter='/')
                                    my_list = []
                                    objects = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME,
                                                                     Prefix=oc.get('Prefix'))
                                    for object_summary in objects['Contents']:
                                        value_file = object_summary['Key']
                                        value_file = value_file[value_file.rindex("/") + 1: len(value_file)]
                                        my_list.append(value_file)
                                    my_child_map[value] = my_list
                        my_map[key] = my_child_map
                return my_map
        except UndefinedError as e:
            print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message

    def create_template(data: str, config_info: TemplateCreateSchema):
        s3_client = get_s3client()
        s3_client.put_object(Body=data, Bucket=settings.STORAGE_BUCKET_NAME, Key=get_template_file(config_info))