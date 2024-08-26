from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from botocore.exceptions import ClientError
from utils.log import log
from jinja2 import UndefinedError
from app.schemas.config.ConfigSchema import ConfigSchema
from app.schemas.config.ConfigTemplateSchema import ConfigTemplateSchema
from services.ConfigManagementService import ConfigManagement
from app.schemas.config.TemplateCreateSchema import TemplateCreateSchema

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


@router.get("/", response_model=ConfigSchema)
def read_configuration(application_name: str, env_name: str, configuration_file_name: str):
    try:
        configInfo = ConfigManagement.read_configuration(application_name, env_name, configuration_file_name)
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
    else:
        raise
    return {"Error Occurred and Handled ": ex.message}

@router.post("/upload-template")
def upload(application_name: str, configuration_file_name: str, file: UploadFile = File(...)):
    try:
        with open(file.filename, 'wb') as f:
            while contents := file.file.read(1024 * 1024):
                ConfigManagement.create_template(contents, config_info=TemplateCreateSchema(application_name, configuration_file_name))
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}