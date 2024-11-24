import json

from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile, Response, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from botocore.exceptions import ClientError
from fastapi.security import HTTPBasic

from utils.log import log
from jinja2 import UndefinedError
from app.schemas.config.ConfigSchema import ConfigSchema
from app.schemas.config.CommonSchema import CommonSchema
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from services.ConfigManagementService import ConfigManagement
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema
import traceback

router = APIRouter(
    tags=["Config Api"],
    prefix='/config'
)

@router.get("/columns")
def read_configuration_columns():
    try:
        return ConfigManagement.read_configuration_columns()
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
    return "Error Occurred and Handled " + e.message



@router.post("/", response_model=dict)
def save_configuration(config_info: ConfigSchema):
    try:
        if len(config_info.configMap) == 0:
           raise ValueError('configMap: Required field is not provided')
        elif config_info.application_name == '':
           raise ValueError('application_name: Required field is not provided')
        elif config_info.env_name == '':
           raise ValueError('env_name: Required field is not provided')
        elif config_info.configuration_file_name == '':
            raise ValueError('configuration_file_name: Required field is not provided')
        ConfigManagement.save_configuration(config_info)
    except ValueError as er:
        return  JSONResponse(content=str(er), status_code=422)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except Exception as error:
        traceback.print_exception(error)
        return  JSONResponse(content=jsonable_encoder(error), status_code=404)
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            return ex.response
        else:
            raise
    return {"status": "Added successfully"}

@router.get("/")
def read_configuration(application_name: str, env_name: str, configuration_file_name: str):
    try:
        configInfo = ConfigManagement.read_configuration(application_name, env_name, configuration_file_name)
    except Exception as e:
        return HTTPException(status_code=400, detail="Item not found")
    return JSONResponse(content=jsonable_encoder(configInfo), status_code=200)

@router.get("/configs", response_model=dict)
def read_configuration():
    try:
        return ConfigManagement.get_all_configuration()
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
    return "Error Occurred and Handled " + e.message

@router.post("/common", response_model=dict)
def common_configuration(config_info: CommonSchema):
    try:
        ConfigManagement.save_common_configuration(config_info)
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

@router.get("/common")
def read_common_configuration(env_name: str):
    try:
        if not env_name:
            raise ValueError('env_name: Required field is not provided')
        configInfo = ConfigManagement.read_common_configuration(env_name)
    except ValueError as er:
        return JSONResponse(content=str(er), status_code=422)
    except Exception as e:
        return JSONResponse(content=jsonable_encoder(e), status_code=404)
    return JSONResponse(content=jsonable_encoder(configInfo), status_code=200)

@router.get("/commons", response_model=dict)
def read_configuration():
    try:
        return ConfigManagement.get_all_common()
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
    return "Error Occurred and Handled " + e.message

@router.post("/generate", response_model=dict)
def generate_configuration(config_info: ConfigTemplateSchema):
    log.info("Received a POST request for /generate")
    try:
        if config_info.application_name == '':
            raise ValueError('application_name: Required field is not provided')
        elif config_info.env_name == '':
            raise ValueError('env_name: Required field is not provided')
        elif config_info.configuration_file_name == '':
            raise ValueError('configuration_file_name: Required field is not provided')
        templateGenerated = ConfigManagement.generate_configuration(config_info)
    except ValueError as er:
        return JSONResponse(content=str(er), status_code=422)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
    return {"template_generated": templateGenerated}


@router.post("/generate-preview", response_model=str)
def generate_configuration(config_info: ConfigTemplateSchema):
    log.info("Received a POST request for /generate")
    try:
        if config_info.application_name == '':
            raise ValueError('application_name: Required field is not provided')
        elif config_info.env_name == '':
            raise ValueError('env_name: Required field is not provided')
        elif config_info.configuration_file_name == '':
            raise ValueError('configuration_file_name: Required field is not provided')
        templateGenerated = ConfigManagement.preview_configuration(config_info)
    except ValueError as er:
        return JSONResponse(content=str(er), status_code=422)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
    return Response(content=templateGenerated, media_type="text/plain")


@router.get("/generated-config", response_model=dict)
def read_configuration():
    try:
        return ConfigManagement.get_all_generated_configurations()
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
    return "Error Occurred and Handled " + e.message

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

@router.post("/upload-template")
def upload(application_name: str = Form(...), configuration_file_name: str = Form(...), file: UploadFile = File(None), template: str = Form(None)):
    try:
        if application_name == '':
            raise ValueError('application_name: Required field is not provided')
        elif configuration_file_name == '':
            raise ValueError('configuration_file_name: Required field is not provided')
        elif file and file.filename:
            with open(file.filename, 'wb') as f:
                while contents := file.file.read(1024 * 1024):
                    ConfigManagement.create_template(contents, config_info=TemplateCreateSchema(application_name, configuration_file_name))
            return {"message": f"Successfully uploaded {file.filename}"}
        elif template:
            ConfigManagement.create_template(template.encode(), config_info=TemplateCreateSchema(application_name, configuration_file_name))
            return {"message": "Successfully uploaded template"}
        else:
            return {"error": "No file or template provided"}
    except ValueError as er:
        return JSONResponse(content=str(er), status_code=422)
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
    except Exception as error:
        traceback.print_exception(error)
        return f"Error Occurred and Handled {error}"
    finally:
        if file:
            file.file.close()


@router.get("/get-template", response_model=str )
def get_template(application_name: str,  configuration_file_name: str):
    try:
        if application_name == '':
            raise ValueError('application_name: Required field is not provided')
        elif configuration_file_name == '':
            raise ValueError('configuration_file_name: Required field is not provided')
        response =  ConfigManagement.read_template(application_name, configuration_file_name)
    except ValueError as er:
        return JSONResponse(content=str(er), status_code=422)
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info(f'No object found - returning empty')
            return ex.response
        else:
            raise
    return Response(content=response, media_type="text/plain")


@router.get("/templates", response_model=dict)
def read_configuration():
    try:
        return ConfigManagement.get_all_template()
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        return "Error Occurred and Handled " + e.message
    except Exception as error:
        traceback.print_exception(error)
        return JSONResponse(content=jsonable_encoder(error), status_code=404)
