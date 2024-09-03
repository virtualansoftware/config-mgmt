import json

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Response, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from botocore.exceptions import ClientError
from utils.log import log
from jinja2 import UndefinedError
from app.schemas.config.ConfigSchema import ConfigSchema
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from services.ConfigManagementService import ConfigManagement
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema
import traceback

router = APIRouter(
    tags=["Config Api"],
    prefix='/config'
)


@router.post("/", response_model=dict)
def save_configuration(config_info: ConfigSchema):
    try:
        ConfigManagement.save_configuration(config_info)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except Exception as error:
        traceback.print_exception(error)
        return "Error Occurred and Handled ${error.message}"
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
        return ConfigManagement.get_all_configuration();
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
    return "Error Occurred and Handled " + e.message


@router.get("/")
def read_configuration(application_name: str, env_name: str, configuration_file_name: str):
    try:
        configInfo = ConfigManagement.read_configuration(application_name, env_name, configuration_file_name)
    except Exception as e:
        return HTTPException(status_code=400, detail="Item not found")
    return JSONResponse(content=jsonable_encoder(configInfo), status_code=200)




@router.post("/generate", response_model=dict)
def generate_configuration(config_info: ConfigTemplateSchema):
    try:
        templateGenerated = ConfigManagement.generate_configuration(config_info)
        return {"template_generated": templateGenerated}
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
    except Exception as error:
        traceback.print_exception(error)
        return "Error Occurred and Handled ${error.message}"
    else:
        raise
    return {"Error Occurred and Handled ": ex.message}

@router.post("/upload-template")
def upload(application_name: str, configuration_file_name: str, file: UploadFile = File(...)):
    try:
        with open(file.filename, 'wb') as f:
            while contents := file.file.read(1024 * 1024):
                ConfigManagement.create_template(contents, config_info=TemplateCreateSchema(application_name, configuration_file_name))
    except Exception as error:
        traceback.print_exception(error)
        return "Error Occurred and Handled ${error.message}"
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}


@router.get("/get-template", response_model=str )
def get_template(application_name: str,  configuration_file_name: str):
    try:
        response =  ConfigManagement.read_template(application_name, configuration_file_name)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
        else:
            raise
    return Response(content=response, media_type="text/plain")

@router.get("/get-generated-config")
def get_template(application_name: str, env_name: str,  configuration_file_name: str):
    try:
        configInfo_request = ConfigTemplateSchema(application_name, env_name, configuration_file_name)
        response =  ConfigManagement.read_generated_template(configInfo_request)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except Exception as ex:
          return HTTPException(status_code=400, detail="Item not found")
    return Response(content=response, media_type="text/plain")