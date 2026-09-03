from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ITBP Sentinel AI API is running on Chrome!"}

@app.get("/test")
def test():
    return {"status": "success", "data": "Hello from FastAPI!"}