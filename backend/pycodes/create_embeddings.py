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

embedding_vector =[]


try:
    with open("outputs/cleaned_text.json", "r") as file:
        data = json.load(file)

    for part in data:
        # print(f"Processing file: {part['file_name']}")  # Debug log

        chunks = sliding_window_split(part["text"])
        for chunk in chunks:
            embedding_vector.append({
                "file_name": part["file_name"],
                "chunk_vector": model.encode(chunk).tolist(),
                "chunk_text": chunk
            }) 


    print("Writing embeddings to file...")  # Debug log
    with open("outputs/embedded_vectors.json", "w", encoding="utf-8") as f:
        json.dump(embedding_vector, f, ensure_ascii=True, indent=4)

    print("Done with embedding vectors.")
except Exception as e:
    print(f"Error occurred: {str(e)}")

sys.stdout.flush()