from sentence_transformers import SentenceTransformer
import json
import sys

model = SentenceTransformer('all-MiniLM-L6-v2')  

def sliding_window_split(text, window_size=400, overlap=128):
    words = text.split()
    chunks = []
    for i in range(0, len(words), window_size - overlap):
        chunk = " ".join(words[i:i + window_size])
        chunks.append(chunk)
    return chunks


try:
    with open("outputs/cleaned_text.json", "r") as file: # used for server.js
    # with open("../outputs/cleaned_text.json", "r") as file:# used for manual run
        data = json.load(file)
except Exception as e:
    print(f"Error occurred: {str(e)}")

import faiss 
import numpy as np
vectors = []
metadata = []

for part in data:
    chunks = sliding_window_split(part["text"])
    for chunk in chunks:
        emb = model.encode(chunk)
        vectors.append(emb)
        metadata.append({
            "file_name": part["file_name"],
            "chunk_text": chunk
        })

vectors = np.array(vectors).astype("float32") # convertion to float32 is required for FAISS
dimension = vectors.shape[1]

index = faiss.IndexFlatL2(dimension)
index.add(vectors)

faiss.write_index(index, "outputs/vector_index.faiss") # used for server.js
# faiss.write_index(index, "../outputs/vector_index.faiss") # used for manual run

with open("outputs/metadata.json", "w", encoding="utf-8") as f: # used for server.js
# with open("../outputs/metadata.json", "w", encoding="utf-8") as f: # used for manual run
    json.dump(metadata, f, indent=4)

print("FAISS index and metadata saved successfully!")
# sys.stdout.flush()