from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth_router, incidents_router, dashboard_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ITBP Sentinel AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(incidents_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ITBP Sentinel AI API is running!"}

@app.get("/test")
def test():
    return {"status": "success", "message": "API is working!"}