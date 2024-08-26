import React, { useState } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_UPLOAD } from '../constants';

export default function UploadConfig() {
    const [applicationName, setApplicationName] = useState("");
    const [configurationFileName, setConfigurationFileName] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    // POST METHOD
    async function upload() {

        if (!applicationName || !configurationFileName || !file) {
            setMessage({ text: "Please fill in all fields and select a file", type: "error" });
            setTimeout(() => {
                setMessage({text:"", type:""});
            }, 3000);
            return;
        }

        const formData = new FormData();
        if (file) formData.append('file', file);
        
        try {
            const response = await axios.post(API_POST_ENDPOINT_UPLOAD, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                params:{application_name: applicationName, configuration_file_name: configurationFileName}
            });
            setMessage({ text: "Data uploaded successfully", type: "success" });
            setApplicationName("");
            setConfigurationFileName("");
            setFile(null);
            console.log(response);
        } catch (error) {
            console.error("Error sending data: ", error);
            setMessage({ text: "Failed to send data", type: "error" });
        }

        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    }

    return (
        <div className="config">    
            <div className="form-group">
                <h5>Upload Config</h5>
                <div className='keyId-group'>
                    <div className='text-left mt-3'>
                        <label>Application Name</label>
                        <input 
                            type="text"
                            value={applicationName}
                            onChange={(e) => setApplicationName(e.target.value)}
                        />
                    </div>
                    <div className='text-left mt-3'>
                        <label>Configuration File Name</label><br/>
                        <input 
                            type="text"
                            value={configurationFileName}
                            onChange={(e) => setConfigurationFileName(e.target.value)}
                        />
                    </div>
                    <div className='text-left mt-3'>
                        <label>Upload File</label><br/>
                        <input 
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                </div>
                <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
                <button className='btn btn-success' onClick={upload}>Generate</button>
            </div>
        </div>
    );
}