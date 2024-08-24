import json
from settings import settings
import boto3
from app.schemas.config.ConfigSchema import ConfigSchema


def GetS3Client():
    return boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY,
                        aws_secret_access_key=settings.AWS_SECRET_KEY)


async def SaveConfigurationRepo(config_info: ConfigSchema):
    s3_client = GetS3Client()
    json_object = json.dumps(config_info.configMap, indent=4)
    s3_client.put_object(Body=json_object, Bucket=settings.STORAGE_BUCKET_NAME,
                         Key=settings.PREFIX + config_info.envName + '/' + config_info.keyId + '/' + config_info.appName +'.json')


async def GetObjectRepo(file: str):
    s3_client = GetS3Client()
    s3_response_object = s3_client.get_object(Bucket=settings.STORAGE_BUCKET_NAME, Key=file)
    return s3_response_object['Body'].read()


async def get_all_configuration():
    s3_client = GetS3Client()
    print(settings.STORAGE_BUCKET_NAME)

    myBucket = s3_client.Bucket(settings.STORAGE_BUCKET_NAME)
    my_map = dict
    for object_summary in myBucket.objects.filter(Prefix=settings.PREFIX ):
       print(object_summary.key)
       my_list = []

       for object_child_summary in myBucket.objects.filter(Prefix=settings.PREFIX+object_summary.key):
           my_list(object_child_summary.key)
       my_map(object_summary.key, my_list)
    return my_map

async def GenerateObjectRepo(env_name: str, key_id: str, template_file_name: str, templateGenerated: str):
    s3_client = GetS3Client()
    s3_client.put_object(Body=templateGenerated, Bucket=settings.STORAGE_BUCKET_NAME,
                         Key=settings.PREFIX  + env_name + '/' + key_id + '/generated/' + template_file_name)
