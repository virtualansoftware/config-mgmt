let ENV_URL = "http://localhost:8000/api/v1";

export const API_POST_ENDPOINT = ENV_URL + "/config";
export const API_GET_ENDPOINT = ENV_URL + "/config";
export const API_GET_ENDPOINT_CONFIG_ALL = ENV_URL + "/config/configs";

export const API_POST_ENDPOINT_GENERATE = ENV_URL + "/config/generate";
export const API_GET_ENDPOINT_GENERATE = ENV_URL + "/config/get-generated-config";
export const API_GET_ENDPOINT_GENERATE_ALL = ENV_URL + "/config/generated-config";
export const API_POST_ENDPOINT_GENERATE_PREVIEW = ENV_URL + "/config/generate-preview";


export const API_POST_ENDPOINT_UPLOAD = ENV_URL + "/config/upload-template";
export const API_GET_ENDPOINT_UPLOAD = ENV_URL + "/config/get-template";
export const API_GET_ENDPOINT_UPLOAD_ALL = ENV_URL + "/config/templates";

export const API_POST_ENDPOINT_COMMON = ENV_URL + "/config/common";
export const API_GET_ENDPOINT_COMMON = ENV_URL + "/config/common";
export const API_GET_ENDPOINT_COMMON_ALL = ENV_URL + "/config/commons";

let HARNESS_ENV_URL = "https://app.harness.io";

export const API_POST_ENDPOINT_HARNESS = HARNESS_ENV_URL + "/harness";
export const API_POST_ENDPOINT_CREATE_ENV = HARNESS_ENV_URL + "/gateway/ng/api/environmentsV2";
export const API_GET_ENDPOINT_CREATE_ENV = HARNESS_ENV_URL + "/gateway/ng/api/environmentsV2/awsvirtualanautoenv";

export const API_POST_ENDPOINT_CREATE_INFRA = HARNESS_ENV_URL + "/ng/api/infrastructures";
export const API_GET_ENDPOINT_CREATE_INFRA = HARNESS_ENV_URL + "/ng/api/infrastructures/awsvirtualaninfrademo";

export const API_POST_ENDPOINT_CREATE_SERVICE = HARNESS_ENV_URL + "/v1/services";
export const API_GET_ENDPOINT_CREATE_SERVICE = HARNESS_ENV_URL + "/gateway/ng/api/servicesV2/virtualanopenapiauto";

export const API_POST_ENDPOINT_CREATE_PIPELINE = HARNESS_ENV_URL + "/gateway/pipeline/api/pipelines/v2";
export const API_GET_ENDPOINT_CREATE_PIPELINE = HARNESS_ENV_URL + "/gateway/pipeline/api/pipelines/virtualanpipelineauto";

export const API_POST_ENDPOINT_CREATE_INPUTSET = HARNESS_ENV_URL + "/gateway/pipeline/api/inputSets";
export const API_GET_ENDPOINT_CREATE_INPUTSET = HARNESS_ENV_URL + "/gateway/pipeline/api/inputSets/virtualannsautoinputset";

export const API_POST_ENDPOINT_EXECUTE_INPUTSET = HARNESS_ENV_URL + "/pipeline/api/pipeline/execute/virtualanpipelineauto/inputSetList";
export const API_GET_ENDPOINT_EXECUTE_INPUTSET = HARNESS_ENV_URL + "/";
