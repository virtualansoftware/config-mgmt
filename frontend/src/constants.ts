let ENV_URL = "http://localhost:8000/api/v1";

export const API_POST_ENDPOINT = ENV_URL + "/config";
export const API_GET_ENDPOINT = ENV_URL + "/config";
export const API_GET_ENDPOINT_CONFIG_ALL = ENV_URL + "/config/configs";

export const API_POST_ENDPOINT_GENERATE = ENV_URL + "/config/generate";
export const API_POST_ENDPOINT_GENERATE_PREVIEW = ENV_URL + "/config/generate-preview";
export const API_GET_ENDPOINT_GENERATE = ENV_URL + "/config/get-generated-config";
export const API_GET_ENDPOINT_GENERATE_ALL = ENV_URL + "/config/generated-config";

export const API_POST_ENDPOINT_UPLOAD = ENV_URL + "/config/upload-template";
export const API_GET_ENDPOINT_UPLOAD = ENV_URL + "/config/get-template";
export const API_GET_ENDPOINT_UPLOAD_ALL = ENV_URL + "/config/templates";

export const API_POST_ENDPOINT_COMMON = ENV_URL + "/config/common";
export const API_GET_ENDPOINT_COMMON = ENV_URL + "/config/common";
export const API_GET_ENDPOINT_COMMON_ALL = ENV_URL + "/config/commons";

export const API_POST_ENDPOINT_HARNESS_ENV = ENV_URL + "/harness/environment";
export const API_POST_ENDPOINT_HARNESS_INFRA = ENV_URL + "/harness/infrastructure";
export const API_POST_ENDPOINT_HARNESS_SERVICE = ENV_URL + "/harness/service";
export const API_POST_ENDPOINT_HARNESS_OVERRIDE = ENV_URL + "/harness/override";
export const API_POST_ENDPOINT_HARNESS_UPDATE_OVERRIDE = ENV_URL + "/harness/update-override";
export const API_POST_ENDPOINT_HARNESS_INPUT_SETS = ENV_URL + "/harness/input-sets";
export const API_POST_ENDPOINT_HARNESS_PIPELINE = ENV_URL + "/harness/pipeline";
export const API_POST_ENDPOINT_HARNESS_EXECUTE_PIPELINE = ENV_URL + "/harness/execute-pipeline-inputset";