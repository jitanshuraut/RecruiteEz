import json
import os
import google.generativeai as genai
from unidecode import unidecode
from flask_cors import CORS
import fitz  # PyMuPDF
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Load environment variables from .env

import base64

load_dotenv()

api_Key = os.environ.get("API_KEY")

genai.configure(api_key=api_Key)

app = Flask(__name__)
CORS(app)
tags_vals = [
    "O",
    "Date",
    "Languages",
    "Projects",
    "Hobbies",
    "Nationality",
    "Date of birth",
    "Objective",
    "LinkedIn",
    "Career Goals",
    "Profile",
    "Greeting",
    "Greeting",
    "Company Name",
    "Job Title",
    "Phone No.",
    "Website",
    "Name",
    "Address",
    "Email",
    "Companies worked at",
    "Phone No",
    "Skills",
    "Email Address",
    "Location",
    "Degree",
    "Experience",
    "College Name",
    "Graduation Year",
    "Education",
    "Designation",
    "Years of Experience",
]

tag2idx = {t: i for i, t in enumerate(tags_vals)}
idx2tag = {i: t for i, t in enumerate(tags_vals)}


def extract_text_from_pdf(file_path):
    output = []
    with fitz.open(file_path) as doc:
        for page in doc:
            output += page.get_text("blocks")

    clean_output = []
    for i in range(0, len(output)):
        plain_text = unidecode(output[i][4])
        clean_output.append(plain_text)
    return clean_output


@app.route("/", methods=["POST"])
def main():
    # return render_template("index.html")
    return "Hi"


def get_gemini_response(input, prompt):
    model = genai.GenerativeModel("models/gemini-pro")
    response = model.generate_content([input, prompt])
    return response.text


input_prompt1 = """
 You are an experienced Technical Human Resource Manager,your task is to review the provided resume against the job description. 
  Please share your professional evaluation on whether the candidate's profile aligns with the role. 
 Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
"""

input_prompt2 = """
 From the given text of the resume, you have to take out the following entities: ['Organization', 'Date', 'Languages', 'Projects', 'Hobbies', 'Nationality', 'Date of Birth', 'Objective', 'LinkedIn', 'Career Goals', 'Profile', 'Greeting', 'Company Name', 'Job Title', 'Phone No.', 'Website', 'Name', 'Address', 'Email', 'Companies Worked At', 'Phone No.', 'Skills', 'Email Address', 'Location', 'Degree', 'Experience', 'College Name', 'Graduation Year', 'Education', 'Designation', 'Years of Experience'] and return them in JSON format  and try too give Skills part in more detail way.
"""

input_prompt3 = """
"I will provide ATS scores based on parsed JSON results or resumes matched with job descriptions. The score will be a  number, without any explanation.
"""


@app.route("/predict", methods=["POST"])
def predict_resume():

    data = request.json
    if "data" in data and "id" in data and "job_description" in data:
        base64_string = data["data"]
        file_id = data["id"]
        decoded_bytes = base64.b64decode(base64_string)
        with open(f"{file_id}.pdf", "wb") as f:
            f.write(decoded_bytes)

        new_file=f'{file_id}.pdf'
        resume_text = extract_text_from_pdf(new_file)
        response = []
        print(resume_text)
        finl_text = ""

        for text in range(0, len(resume_text)):
            finl_text += resume_text[text]

        data_with_json = get_gemini_response(input_prompt2, finl_text)
        start_index = data_with_json.find("{")
        end_index = data_with_json.rfind("}") + 1
        json_data = data_with_json[start_index:end_index]
        parsed_data = json.loads(json_data)
        data_with_json = get_gemini_response(input_prompt3, json_data)
        print(data_with_json)
        parsed_data["ATS"] = data_with_json
        return jsonify(parsed_data)
    else:
        return "Missing 'data' or 'id' key in the data."


if __name__ == "__main__":
    app.run(debug=True, port=9999)
