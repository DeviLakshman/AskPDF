import React from "react";

const PdfUpload = ({ selectedFiles, setSelectedFiles, handleUpload }) => {

    // Handle multiple file selection
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        const validFiles = files.filter(file => file.type === "application/pdf");

        if (validFiles.length > 0) {
            setSelectedFiles((prevFiles)=>[...prevFiles ,...validFiles]);
        } else {
            alert("Please select valid PDF files.");
            setSelectedFiles([]); // Clear selection if invalid files are chosen
        }
    };

    return (
        <div>
            <form onSubmit={handleUpload}>

            <h2>Upload PDFs</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} multiple />
                {selectedFiles.length > 0 && (
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                )}
                <button  disabled={selectedFiles.length === 0}>Upload</button>
            </form>
        </div>
    );
};

export default PdfUpload;
