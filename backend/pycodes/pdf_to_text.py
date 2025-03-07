from PyPDF2 import PdfReader as pdf
import json
import os
import re
import sys

def extract_text(pdf_path):
    with open(pdf_path, "rb") as f:
        reader = pdf(f)
        results = []
        for i in range(len(reader.pages)):
            text = reader.pages[i].extract_text()
            if text:
                # text = filter_ascii(text)
                results.append(text)
    return ' '.join(results)  


def fetch_all_files(parent_folder: str):
    target_files = []
    for path, _, files in os.walk(parent_folder):
        for name in files:
            if name.endswith(".pdf"):
                target_files.append(os.path.join(path, name))
    return target_files

def save_in_json():
    files_list = fetch_all_files("./uploads")

    cleaned_text_data = []

    for file in files_list:
        text = extract_text(file)
        cleaned_text_data.append({
            "file_name": os.path.basename(file),  # Store file name
            "text": text
        })

    # Save all extracted texts in a JSON file
    with open("outputs/raw_text.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_text_data, f, ensure_ascii=True, indent=4)
    print("All PDF texts saved in raw_text.json ")

save_in_json()
sys.stdout.flush()