# NaveaVentures-Assignment1
Results for query based on the pdf uploaded by the user


• Resource used for removing the old cache :

https://hayageek.com/remove-all-files-from-directory-in-nodejs/#:~:text=Let's%20start%20with%20a%20synchronous,(directory%2C%20file)%3B%20fs.

• Resource used for mutiple files uploading :

https://stackoverflow.com/questions/74930757/uploading-single-and-multiple-files-in-reactjs

‣ Only BM25 is implememted for queries whose length (i.e. number of words ) is lessthan 5 (<= 4)


⚖ Comparison Summary

| Method              | Speed        | Understands Synonyms & Meaning? | Handles Long Queries? | Best For                                |
|---------------------|--------------|---------------------------------|-----------------------|-----------------------------------------|
| `BM25`              | 🔥 Fast      | ❌ No                            | ❌ No                 | Exact keyword searches                  |
| `Embeddings `       | 🐢 Slower    | ✅ Yes                           | ✅ Yes                | Finding semantically similar content    |
| `BM25 + Embeddings` | ⚡ Moderate  | ✅ Yes                           | ✅ Yes                | Balancing speed and meaning             |
| `BERT Search`       | 🐌 Slowest   | ✅✅ Very Strong                | ✅✅ Best              | Deep contextual search                  |


Reference used for huggingface model inference : https://huggingface.co/docs/api-inference/en/getting-started


 How to run :
-------
git clone this repo into your local folder 

## FRONTEND PART:


• Navigate to myapp

 run :
       `npm install`

`npm start`
## BACKEND PART :

• Navigate to backend folder : `npm install -g depcheck`
  
`pip install requests sentence-transformers faiss-cpu numpy PyPDF2`
 or 
 `pip install -r requirements.txt`
 
### Incase of any issues in the installments:

• create a virtual environment in python

`pip install virtualenv`

`python -m virtualenv <env_name>`

`<env_name>\scripts\activate`

Ultimately run this -- `nodemon servrer`
