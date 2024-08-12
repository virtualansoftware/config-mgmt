from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middlewares.loggerMiddleware import LoggerMiddleware

from routes.api import router

from settings import settings
import uvicorn

from os import getenv, urandom, path, environ

def initApplication() -> FastAPI:

    ## Create FastApi App
    fastApiApp = FastAPI( title=settings.app_name,description=settings.app_name_desc)

    fullApiPrefix = str("/%s/%s" %(settings.apiPrefix, settings.apiVersion))
    ## Mapping api routes
    fastApiApp.include_router(router,prefix=fullApiPrefix)

    ## Custom Middlewares
    fastApiApp.add_middleware(LoggerMiddleware)

    ## Allow cors
    fastApiApp.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_HOSTS or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return fastApiApp

app = initApplication()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0",
            port=int(getenv('PORT', 8000)),
                log_level=getenv('LOG_LEVEL', "info"),
                debug=getenv('DEBUG', False),
                proxy_headers=True)