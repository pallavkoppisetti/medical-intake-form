from fastapi import APIRouter, HTTPException, Depends, Response
import psycopg2
import psycopg2.extras # Required for dictionary-like cursor results
import API.db as db # Your database connection utility
import boto3
from botocore.exceptions import ClientError
import os
import json 

router = APIRouter()

S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)


@router.get("/patients")
async def get_doctor_patients(doctor_id: int):
    """
    Retrieves all patients associated with a specific doctor ID from the database.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT * FROM patients WHERE doctor_id = %s", (doctor_id,))
        
        rows = cur.fetchall()
        patients = []
        for row in rows:
            patient = {
                "id": row[0],
                "name": row[1],
                "doctor_id": bool(row[2]),    
                "document_url": bool(row[3]),
                "status": bool(row[4]),
                "formdata": bool(row[5]),
                "vitalstatus": bool(row[6]),
                "functionalstatus": bool(row[7])
            }
            patients.append(patient)

        return patients

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching patient data.")


@router.get("/patients/{patient_id}/document-url")
async def get_document_url(patient_id: int):
    """
    Generates a pre-signed URL for a patient's document.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT document_s3_url FROM patients WHERE id = %s", (patient_id,))
        patient = cur.fetchone()

        if not patient or not patient['document_s3_url']:
            raise HTTPException(status_code=404, detail="Document not found for this patient.")

        full_url = patient['document_s3_url']
        s3_object_key = '/'.join(full_url.split('/')[3:])


        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': s3_object_key},
            ExpiresIn=600  # URL is valid for 5 minutes (300 seconds)
        )
        return {"url": presigned_url}

    except ClientError as e:
        print(f"Error generating pre-signed URL: {e}")
        raise HTTPException(status_code=500, detail="Could not generate document URL.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    

@router.get("/patients/{patient_id}/form-data")
async def get_patient_form_data(patient_id: int):
    """
    Retrieves the form data associated with a specific patient ID.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT formdata FROM patients WHERE id = %s", (patient_id,))
        patient = cur.fetchone()

        if not patient or not patient['formdata']:
            raise HTTPException(status_code=404, detail="Form data not found for this patient.")

        return {"formdata": patient['formdata']}

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching form data.")


@router.post("/patients/create")
async def create_patient(patient_name:str, doctor_id:int):
    """
    Creates a new patient record in the database.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)    
        
        cur.execute("""
            INSERT INTO patients (full_name, doctor_id)
            VALUES (%s, %s) RETURNING id
        """, 
            (patient_name, doctor_id)
        )
        new_patient_id = cur.fetchone()[0]
        conn.commit()
        
        return {"message": "Patient created successfully", "patient_id": new_patient_id}

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the patient.")

@router.post("/patients/vitals")
async def update_patient_vitals(patient_id: int, vitals: dict):
    """
    Updates the vitals for a specific patient.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            UPDATE patients
            SET vital_form = %s
            WHERE id = %s
        """, (json.dumps(vitals), patient_id))
        
        conn.commit()
        
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Patient not found.")
        
        return {"message": "Vitals updated successfully"}

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        raise HTTPException(status_code=500, detail="An error occurred while updating patient vitals.")
    
@router.post("/patients/functional_status_form")
async def update_patient_functional_status(patient_id: int, functional_status: dict):
    """
    Updates the functional status form for a specific patient.
    """
    try:
        conn = db.get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cur.execute("""
            UPDATE patients
            SET functional_status_form = %s
            WHERE id = %s
        """, (json.dumps(functional_status), patient_id))
        
        conn.commit()
        
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Patient not found.")
        
        return {"message": "Functional status updated successfully"}

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        raise HTTPException(status_code=500, detail="An error occurred while updating functional status.")

import json
import os
import asyncio
import re
from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv
import openai
from ..utils import process_form, merge_json_list


router = APIRouter()

load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY")
if not OPEN_API_KEY:
    raise ValueError("OPEN_API_KEY environment variable not set. Please create a .env file and add it.")


MODEL = "gpt-4o"
router = APIRouter()


@router.post("/autofill")
async def autofill(request: Request):
    """
    This endpoint receives text, uses an AI model to fill out three predefined
    JSON forms, and returns a single merged JSON object with the results.
    """
    try:
        client = openai.AsyncOpenAI(api_key=OPEN_API_KEY)
        payload = await request.json()
        input_text = payload.get("input_text")

        if not input_text:
            raise HTTPException(status_code=400, detail="Missing 'input_text' in request body.")


        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        form_paths = [
            os.path.join(base_dir, 'form1.json'),
            os.path.join(base_dir, 'form2.json'),
            os.path.join(base_dir, 'form3.json'),
            os.path.join(base_dir, 'form4.json')
        ]


        tasks = [process_form(client, input_text, path) for path in form_paths]
        json_results = await asyncio.gather(*tasks)


        merged_result = merge_json_list(json_results)
        
        print("Final Merged result:", merged_result)
        return merged_result

    except Exception as e:
        print(f"An unexpected error occurred in /autofill endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")


import json
import os
import asyncio
import re
from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv
import openai
import psycopg2
from pydantic import BaseModel

from API import db
from ..utils import process_form, merge_json_list


router = APIRouter()

load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY")
if not OPEN_API_KEY:
    raise ValueError("OPEN_API_KEY environment variable not set. Please create a .env file and add it.")


MODEL = "gpt-4o"
router = APIRouter()

class Autofill(BaseModel):
    text: str
    patient_id: int

@router.post("/autofill")
async def autofill(payload:Autofill):
    """
    This endpoint receives text, uses an AI model to fill out three predefined
    JSON forms, and returns a single merged JSON object with the results.
    """
    try:
        try:
            conn = db.get_db_connection()
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            cur.execute("SELECT vital_form, functional_status_form FROM patients WHERE id = %s", (payload.patient_id,))
            patient = cur.fetchone()
        except (Exception, psycopg2.DatabaseError) as error:
            print(f"Database error: {error}")
            raise HTTPException(status_code=500, detail="An error occurred while fetching form data.")
        
        client = openai.AsyncOpenAI(api_key=OPEN_API_KEY)
        input_text = payload.text

        if not input_text:
            raise HTTPException(status_code=400, detail="Missing 'input_text' in request body.")


        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        form_paths = [
            os.path.join(base_dir, 'form1.json'),
            os.path.join(base_dir, 'form2.json'),
            os.path.join(base_dir, 'form3.json'),
            os.path.join(base_dir, 'form4.json')
        ]
        

        tasks = [process_form(client, input_text, path) for path in form_paths]
        json_results = await asyncio.gather(*tasks)


        merged_result = merge_json_list(json_results,patient['vital_form'], patient['functional_status_form'])
        
        print("Final Merged result:", merged_result)
        return merged_result

    except Exception as e:
        print(f"An unexpected error occurred in /autofill endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")
