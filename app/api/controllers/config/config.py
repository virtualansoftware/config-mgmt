from fastapi import APIRouter, Depends, HTTPException
from botocore.exceptions import ClientError
from utils.log import log
from settings import settings
import boto3
import json
import re
from jinja2 import UndefinedError

# from settings import settings
from app.schemas.config.ConfigSchema import ConfigSchema

# from services.AuthService import AuthService
from services.TemplateGeneration import ReadConfiguration, GenerateConfiguration, GetConfig, SaveConfiguration, \
    read_configuration_all

router = APIRouter(
    tags=["Config Api"],
    prefix='/config'
)


@router.post("/", response_model=dict)
def save_configuration(config_info: ConfigSchema):
    try:
        log.debug(config_info)
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                                 aws_secret_access_key=settings.AWS_SECRET_KEY)
        json_object = json.dumps(config_info.configMap, indent=4)
        s3_client.put_object(Body=json_object, Bucket=settings.STORAGE_BUCKET_NAME,
                             Key=settings.PREFIX + config_info.keyId + '/' + config_info.envName + '/' + config_info.appName + '.json')
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            return ex.response
        else:
            raise
    return {"status": "Added successfully"}


@router.get("/all", response_model=dict)
def read_configuration():
    try:
        print("start")
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                                 aws_secret_access_key=settings.AWS_SECRET_KEY)

        result = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME, Prefix=settings.PREFIX, Delimiter='/')
        my_map = dict()

        if result.get('CommonPrefixes') is not None:
            for o in result.get('CommonPrefixes'):
                if o is not None:
                    print(o.get('Prefix'))
                    result_child = s3_client.list_objects(Bucket=settings.STORAGE_BUCKET_NAME, Prefix=o.get('Prefix'),
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


@router.get("/", response_model=ConfigSchema)
def read_configuration(env_name: str, key_id: str):
    try:
        configInfo = ReadConfiguration(env_name, key_id)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
        else:
            raise
    return configInfo


def get_config(env_name, key_id):
    object_content = GetConfig(env_name, key_id)
    return object_content


@router.post("/generate", response_model=dict)
def generate_configuration(env_name: str, key_id: str, template_file_name: str,app_name: str):
    try:
        templateGenerated = GenerateConfiguration(env_name, key_id, template_file_name,app_name)
        return {"template_generated": templateGenerated}
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
    else:
        raise
    return {"Error Occurred and Handled ": ex.message}
