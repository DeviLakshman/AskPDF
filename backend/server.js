const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { spawn } = require("child_process");
const { exec } = require("child_process");


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());



// Ensure the uploads folder exists before using it
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true }); // Creates folder if it doesn't exist
}

const outputsFolder = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputsFolder)) {
    fs.mkdirSync(outputsFolder, { recursive: true }); // Creates folder if it doesn't exist
}

// Configure Multer for multiple files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Now we are sure the folder exists
    },
    filename: (req, file, cb) => {
        const cleanFileName = path.parse(file.originalname).name.replace(/\s+/g, '_'); // Remove spaces
        const uniqueSuffix = Date.now(); // Add timestamp for uniqueness
        cb(null, `${cleanFileName}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }    
});

const upload = multer({ storage: storage });

const crypto = require('crypto');

const hashes = new Set() ;

app.post('/upload_pdfs', upload.array('pdfs', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }


  const uniqueFiles = [];
  const duplicates = [];

  req.files.forEach(file => {
    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check if it's already encountered in this request
    if (hashes.has(hash)) {
      duplicates.push(file);

      // Remove the duplicate from disk
      fs.unlinkSync(file.path);
    } else {
      hashes.add(hash);
      uniqueFiles.push({
        filename: file.filename,
        path: file.path,
        hash: hash
      });
    }
  });

  console.log('Unique files in this request:', uniqueFiles);
  console.log('Duplicates in this request:', duplicates);

  res.status(200).json({ message: "Files uploaded successfully", files: uniqueFiles });
});
app.post('/run_extract',(req,res)=>{
    const pythonProcess = spawn ("python",["pycodes/pdf_to_text.py"])
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        res.json({ output: output.trim(), status: `Exited with code ${code}` });
    });
})

app.post('/run_clean',(req,res)=>{
    const pythonProcess = spawn ("python",["pycodes/preprocess_text.py"])
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        res.json({ output: output.trim(), status: `Exited with code ${code}` });
    });
})


app.post('/run_embedding', (req, res) => {
    // exec("python pycodes/create_embeddings.py", (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error: ${error.message}`);
    //         return res.status(500).json({ message: "Embedding process failed", error: error.message });
    //     }
    //     if (stderr) {
    //         console.error(`stderr: ${stderr}`);
    //         return res.status(500).json({ message: "Error in embedding script", error: stderr });
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     res.status(200).json({ message: "Embedding successful", output: stdout.trim() });
    // });
    const pythonProcess = spawn ("python",["pycodes/create_embeddings.py"])
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        res.json({ output: output.trim(), status: `Exited with code ${code}` });
    });
});

app.post('/query',(req,res)=>{
    console.log(req.body["query"])
    const pythonProcess = spawn ("python",["pycodes/query_engine.py",req.body["query"]])
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        res.json({ output: output.trim(), status: `Exited with code ${code}` });
    });
});


app.get('/show_result', (req, res) => {
    const pythonProcess = spawn ("python",["pycodes/answer_question.py"]);
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        fs.readFile('outputs/result.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log(data);
            res.status(200).json({ "output": data  });
        });
    });

});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

function removeAllFilesSync(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
    }
}
// app.post('/delete_cache', (req, res) => {
//     const { paths } = req.body;
//     console.log("Paths to delete:", paths);

//     // If paths is empty or not provided
//     if (!Array.isArray(paths) || paths.length === 0) {
//         return res.status(400).json({ message: "No file paths provided." });
//     }
//     const path = req.body["paths"] ;
//     console.log(req.body)
//     console.log(path)
//     for(let i = 0 ; i < path.length ; i++ )
//     {
//         console.log(path[i]) ;
//         removeAllFilesSync(path[i]);
//     }
//     paths.forEach(filePath => {
//         try {
//             // 1. Read the file so we can compute its hash
//             const fileBuffer = fs.readFileSync(filePath);
//             const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

//             // 2. Remove the hash from the global Set
//             if (hashSet.has(hash)) {
//                 hashSet.delete(hash);
//                 console.log(`Deleted hash for file: ${filePath}`);
//             }

//             // 3. Remove the file from disk
//             fs.unlinkSync(filePath);
//             console.log(`Deleted file from disk: ${filePath}`);

//         } catch (err) {
//             console.error(`Error deleting file or removing hash: ${filePath}`, err);
//         }
//     });

//     res.status(200).json({ message: "Cache deleted successfully." });
// });

app.post('/delete_cache',(req,res)=>{
    // Call the function
    const path = req.body["paths"] ;
    console.log(req.body)
    console.log(path)
    for(let i = 0 ; i < path.length ; i++ )
    {
        console.log(path[i]) ;
        removeAllFilesSync(path[i]);
    }
    hashes.clear() ;

    res.status(200).json({message : `Removed from successfully ${req.body["path"]}`})    
})
// const fs = require('fs');
// const path = require('path');

