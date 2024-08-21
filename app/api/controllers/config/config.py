from fastapi import APIRouter, Depends, HTTPException
#import boto3
#import os
#import json
from botocore.exceptions import ClientError
from utils.log import log

from jinja2 import UndefinedError

#from settings import settings
from app.schemas.config.ConfigSchema import ConfigSchema



#from services.AuthService import AuthService
from services.TemplateGeneration import ReadConfiguration,GenerateConfiguration,GetConfig,SaveConfiguration

router = APIRouter(
    tags=["Config Api"],
    prefix='/config'
)


@router.post("/", response_model=dict)
async def save_configuration(config_info: ConfigSchema):
    try:
        log.debug(config_info)
        SaveConfiguration(config_info)
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


@router.get("/", response_model=ConfigSchema)
async def read_configuration(env_name: str, key_id: str):
    try:        
        configInfo = ReadConfiguration(env_name,key_id)       
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
    object_content = GetConfig(env_name,key_id)
    return object_content


@router.post("/generate", response_model=dict)
async def generate_configuration(env_name: str, key_id: str, template_file_name: str):
    try:
        templateGenerated= GenerateConfiguration(env_name,key_id,template_file_name)
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
