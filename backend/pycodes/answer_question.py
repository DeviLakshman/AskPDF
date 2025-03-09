import requests

API_URL = "https://api-inference.huggingface.co/models/google/gemma-1.1-2b-it"
headers = {"Authorization": "Bearer __ENTER_YOUR_API_KEY_AS_IT_IS_HERE__"}
 
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

prompt = ""

with open("outputs/prompt.txt", "r") as file: # used for server.js
# with open("../outputs/prompt.txt", "r") as file: # used for manual run
    prompt = file.read().strip()

output = query({"inputs": prompt})

generated_text = output[0]['generated_text']

clean_response = generated_text.replace(prompt, "").strip() # remove the prompt from beginning if any 


# print("LLM Response:", clean_response)

with open("outputs/result.txt","w") as file : # used for server.js
# with open("../outputs/result.txt","w") as file :  # used for manual run
    file.write(clean_response)

print("got result from LLM")
