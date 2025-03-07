all :
	python pdf_to_text.py	
	python preprocess_text.py
	python create_embeddings.py
	python query_engine.py  output.txt