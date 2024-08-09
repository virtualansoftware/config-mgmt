from fastapi import APIRouter, Depends, HTTPException
import boto3
import os
import json
from botocore.exceptions import ClientError
from utils.log import log

from jinja2 import UndefinedError

from settings import settings
from app.schemas.config.ConfigSchema import ConfigSchema
from app.datagenerator.process_template import apply_configuration

from services.AuthService import AuthService


router = APIRouter(
    tags=["Config Api"],
    prefix='/config'
)


@router.post("/", response_model=dict)
async def save_configuration(config_info: ConfigSchema):
    try:
        print(config)
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                                 aws_secret_access_key=settings.AWS_SECRET_KEY)
        json_object = json.dumps(config_info.configMap, indent=4)
        s3_client.put_object(Body=json_object, Bucket=settings.STORAGE_BUCKET_NAME,
                             Key=config_info.envName + '/' + config_info.keyId + '.json')
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            logger.info('No object found - returning empty')
            return ex.response
        else:
            raise
    return {"status": "Added successfully"}


@router.get("/", response_model=ConfigSchema)
async def read_configuration(env_name: str, key_id: str):
    try:
        print(config)
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                                 aws_secret_access_key=settings.AWS_SECRET_KEY)
        s3_response_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME,
                                                  Key=env_name + '/' + key_id + '.json')
        object_content = s3_response_object['Body'].read()
        configInfo = ConfigSchema(json.loads(object_content), key_id, env_name)
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


async def get_config(env_name, key_id):
    s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                             aws_secret_access_key=settings.AWS_SECRET_KEY)
    s3_response_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME,
                                              Key=env_name + '/' + key_id + '.json')
    object_content = s3_response_object['Body'].read()
    return object_content


@router.post("/generate", response_model=dict)
async def generate_configuration(env_name: str, key_id: str, template_file_name: str):
    try:
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                                 aws_secret_access_key=settings.AWS_SECRET_KEY)
        s3_response_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME,
                                                  Key=env_name + '/' + key_id + '.json')
        object_content = s3_response_object['Body'].read()
        TEMPLATE_FILE = 'config-mgmt/templates/applications/' + key_id + '/' + template_file_name
        s3_template_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME, Key=TEMPLATE_FILE)
        template_file_content = s3_template_object['Body'].read()
        templateGenerated = apply_configuration(key_id, json.loads(object_content), template_file_content.decode('UTF-8'))
        s3_client.put_object(Body=templateGenerated, Bucket=settings.STORAGE_BUCKET_NAME,
                             Key=env_name + '/' + key_id + '/generated/' + template_file_name)
        return {"template_generated": templateGenerated }
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
