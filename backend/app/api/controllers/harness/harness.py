import json

from fastapi import APIRouter
from botocore.exceptions import ClientError

from utils.log import log
from jinja2 import UndefinedError
from app.schemas.harness.Service import ServiceSchema
from app.schemas.harness.InputSet import InputSchema
from app.schemas.harness.Override import OverrideSchema
from app.schemas.harness.Pipleline import PipelineSchema
from app.harness.HarnessOverrideClient import HarnessOverrideClient
from app.harness.HarnessAPIClient import HarnessAPIClient
from app.harness.HarnessInputSetClient import HarnessInputSetClient
from app.harness.HarnessPipelineClient import HarnessPipelineClient
from app.harness.HarnessEnvironmentClient import HarnessEnvironmentClient
from app.harness.HarnessPipelineExecutionClient import HarnessPipelineExecutionClient

import traceback

router = APIRouter(
    tags=["Harness Api"],
    prefix='/harness'
)


@router.post("/service", response_model=dict)
def harness_service(serviceObject: ServiceSchema):
    try:
        HarnessAPIClient.create_harness_service(serviceObject.accountIdentifier, json.loads(serviceObject.serviceData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Created successfully"}


@router.post("/override", response_model=dict)
def harness_service(overrideSchema: OverrideSchema):
    try:
        HarnessOverrideClient.create_harness_service_override(overrideSchema.accountIdentifier,
                                                              json.loads(overrideSchema.inputSetData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Created successfully"}


@router.post("/update-override", response_model=dict)
def harness_service(overrideSchema: OverrideSchema):
    try:
        HarnessOverrideClient.update_service_override(overrideSchema.accountIdentifier,
                                                      json.loads(overrideSchema.serviceData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Updated successfully"}


@router.post("/input-sets", response_model=dict)
def harness_inputsets(inputsetObject: InputSchema):
    try:
        HarnessInputSetClient.create_harness_input_set(inputsetObject.accountIdentifier,
                                                       json.loads(inputsetObject.inputSetData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Created successfully"}


@router.post("/execute-pipeline-inputset", response_model=dict)
def harness_execute_pipeline(inputsetObject: InputSchema):
    try:
        HarnessPipelineExecutionClient.execute_with_inputset_pipeline(inputsetObject.accountIdentifier, inputsetObject.orgIdentifier,
                                                                      inputsetObject.projectIdentifier,inputsetObject.pipelineIdentifier,
                                                                      json.loads(inputsetObject.inputSetData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Executed successfully"}


@router.post("/pipeline", response_model=dict)
def harness_pipeline(inputsetObject: PipelineSchema):
    try:
        HarnessPipelineClient.create_the_pipeline(inputsetObject.accountIdentifier, inputsetObject.branch,
                                                  json.loads(inputsetObject.inputSetData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Created successfully"}


@router.post("/environment", response_model=dict)
def harness_environment(inputsetObject: PipelineSchema):
    try:
        HarnessEnvironmentClient.create_harness_environment(inputsetObject.accountIdentifier,
                                                            json.loads(inputsetObject.inputSetData))
    except UndefinedError as e:
        print("Error Occurred and Handled" + e.message)
        raise "Error Occurred and Handled" + e.message
    except Exception as error:
        traceback.print_exception(error)
        raise "Error Occurred and Handled" + error.message
    except ClientError as ex:
        if ex.response['Error']['Code'] == 'NoSuchKey':
            log.info('No object found - returning empty')
            raise "Error Occurred and Handled" + ex.response
        else:
            raise
    return {"status": "Created successfully"}
