import React, { useState } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_UPLOAD, API_GET_ENDPOINT_UPLOAD } from '../constants';
import Sidebar from './Sidebar';

export default function UploadConfig() {
    const [applicationName, setApplicationName] = useState("");
    const [configurationFileName, setConfigurationFileName] = useState("");
    const [file, setFile] = useState(null);
    const [textArea, setTextArea] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    // POST METHOD
    async function upload() {
        if (!applicationName || !configurationFileName || (!file && !textArea)) {
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
            setTextArea("");
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error sending data: ", error);
            setMessage({ text: "Failed to send data", type: "error" });
        }

        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    }

    // GET METHOD
    async function retrieve() {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name')
        const file = authResult.get('file')
        const configuration_file_name = authResult.get('configuration_file_name');

        setApplicationName(application_name);
        setFile(file);
        setConfigurationFileName(configuration_file_name);

        try {
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD, {
                params: {
                    application_name,
                    file,
                    configuration_file_name
                }
            });
            setTextArea(response.data);
            setMessage({ text: "Data fetched successfully", type: "success" });
        } catch (error) {
            console.error("Error fetching pairs:", error);
            setMessage({ text: "Failed to fetch data", type: "error" });
        }

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">    
                <div className="form-group">
                    <h5>Upload Template</h5>
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
                        {!textArea && (
                            <div className='text-left mt-3'>
                                <label>Upload File</label><br/>
                                <input 
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        )}
                        {textArea && (
                            <div className='text-left mt-3'>
                                <label>Text Template</label><br/>
                                <textarea
                                    className="textarea"
                                    rows={4}
                                    value={textArea}
                                    onChange={(e) => setTextArea(e.target.value)}
                                />
                            </div>
                       )}
                    </div>
                    <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
                    <button className='btn btn-success' onClick={upload}>Upload</button>
                </div>
            </div>
        </>
    );
}