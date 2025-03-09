import json
import faiss, sys
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index("outputs/vector_index.faiss")
# index = faiss.read_index("../outputs/vector_index.faiss")

# 2. Load metadata to map each index to text
with open("outputs/metadata.json", "r", encoding="utf-8") as f:
# with open("../outputs/metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# query = "What is water pollution?"
query = sys.argv[1]
emb_query = model.encode(query).astype("float32")
emb_query /= np.linalg.norm(emb_query)

top_k = 3
distances, indices = index.search(emb_query[np.newaxis, :], top_k)

output = query
output += " "
for i, idx in enumerate(indices[0]):
    chunk_info = metadata[idx]
    output += chunk_info["chunk_text"]

with open("outputs/prompt.txt", "w") as file: # used for server.js
# with open("../outputs/prompt.txt", "w") as file: # used for manual run
    file.write(output)