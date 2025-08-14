import json
import os
from fastapi import APIRouter, HTTPException,Request
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import re


load_dotenv()


OPEN_API_KEY = os.getenv("OPEN_API_KEY")
if not OPEN_API_KEY:
    raise ValueError("OPEN_API_KEY environment variable not set. Please create a .env file and add it.")


model = "gpt-4o"



router = APIRouter()

@router.post("/autofill")
async def autofill(request: Request):
    try:
        payload = await request.json()
        input_text=payload["input_text"]
        sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'sample.json'))
        

        with open(sample_path, "r", encoding="utf-8") as f:
            sample_data = json.load(f)
        client = openai.OpenAI(api_key=OPEN_API_KEY)

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are an expert in medical forms and autofill. Always respond ONLY with a valid JSON object that matches the provided form structure."},
                {"role": "user", "content": f"Given the following text, fill out the medical intake form fields. Respond only with a valid JSON object matching the structure. Text: {input_text}. Form: {json.dumps(sample_data)}"}
            ]
        )

   
        result_string = response.choices[0].message.content

        result_string = re.sub(r'^\s*```(?:json)?\s*', '', result_string, flags=re.IGNORECASE)
        result_string = re.sub(r'```\s*$', '', result_string)
        print("Autofill result from OpenAI:", result_string)

        try:
            parsed_json = json.loads(result_string)
            return parsed_json
        except json.JSONDecodeError:
            print("Error: Failed to decode JSON from AI response.")
            raise HTTPException(status_code=500, detail="The AI service returned an invalid format.")

    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Server configuration error: 'sample.json' not found.")
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")


