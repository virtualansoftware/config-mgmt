from fastapi import APIRouter

from app.api.controllers.auth.login import router as login_api
from app.api.controllers.config.config import router as config_api

router = APIRouter()


def includeApiRoutes():
    ''' Include to router all api rest routes with version prefix '''
    router.include_router(login_api)
    router.include_router(config_api)

includeApiRoutes()