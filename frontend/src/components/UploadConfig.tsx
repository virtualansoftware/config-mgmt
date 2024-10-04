import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_UPLOAD, API_GET_ENDPOINT_UPLOAD } from '../constants';
import Sidebar from './Sidebar';

export default function UploadConfig() {
    const [applicationName, setApplicationName] = useState("");
    const [configurationFileName, setConfigurationFileName] = useState("");
    const [file, setFile] = useState(null);
    const [textArea, setTextArea] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [originalTextArea, setOriginalTextArea] = useState("");

    // CLEAR ALL FIELDS
    useEffect(() => {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name');
        const configuration_file_name = authResult.get('configuration_file_name');

        if (application_name && configuration_file_name) {
            setApplicationName(application_name);
            setConfigurationFileName(configuration_file_name);
        } else {
            setApplicationName("");
            setConfigurationFileName("");
            setFile(null);
            setTextArea("");
            setOriginalTextArea("");
            setMessage({ text: "", type: "" });
            setIsDisabled(false);
        }
    }, [window.location.search]);

    // CLEARS THE MESSAGE AFTER 3 SEC
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // POST METHOD - UPLOAD TEMPLATE
    async function upload() {
        if (!applicationName || !configurationFileName || (!file && !textArea)) {
            return;
        }
        
        if (textArea){
            if (textArea === originalTextArea){
                setMessage({ text: "No changes made to the template", type: "error" });
                return;
            }
        }

        const formData = new FormData();
        formData.append('application_name', applicationName);
        formData.append('configuration_file_name', configurationFileName);
        if (file) formData.append('file', file);
        if (textArea) formData.append('template', textArea);

        try {
            const response = await axios.post(API_POST_ENDPOINT_UPLOAD, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage({ text: "Data uploaded successfully", type: "success" });
            setApplicationName("");
            setConfigurationFileName("");
            setFile(null);
            setTextArea("");
            setIsDisabled(false);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error sending data: ", error);
            setMessage({ text: "Failed to send data", type: "error" });
        }
    }

    // GET METHOD - GET UPLOADED TEMPLATE
    async function retrieve() {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name')
        const file = authResult.get('file')
        const configuration_file_name = authResult.get('configuration_file_name');

        setApplicationName(application_name);
        setFile(file);
        setConfigurationFileName(configuration_file_name);

        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD, {
                params: {
                    application_name,
                    configuration_file_name
                }
            });
            const data = response.data;
            if (typeof data === "string") {
                setTextArea(data);
                setOriginalTextArea(data);
            } else if (typeof data === "object") {
                setTextArea(JSON.stringify(data, null, 2));
                setOriginalTextArea(JSON.stringify(data, null, 2));
            }
            setMessage({ text: "Data fetched successfully", type: "success" });
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            setMessage({ text: "Failed to fetch data", type: "error" });
        }
    }

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">    
                <div className="form-group">
                    <h5>{isDisabled ? "Re-Upload Template" : "Upload Template"}</h5>
                    <div className='input-container'>
                        <div>
                            <label>Application Name</label>
                            <input 
                                type="text"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                                disabled={isDisabled}
                            />
                        </div>
                        <div>
                            <label>Configuration File Name</label><br/>
                            <input 
                                type="text"
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                                disabled={isDisabled}
                            />
                        </div>
                        {!textArea && (
                            <div>
                                <label>Upload File</label><br/>
                                <input 
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        )}
                        {loading ? (
                            <div className='spin-con'>
                                <img className="spinner" src='/images/spinner.svg' alt='spinner'/>
                            </div>
                        ) : (
                            <>
                                {textArea && (
                                    <div>
                                        <label>Text Template</label><br/>
                                        <textarea
                                            className="textarea"
                                            rows={5}
                                            value={textArea}
                                            onChange={(e) => setTextArea(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
                    <button className='btn btn-success' onClick={upload}>Upload</button>
                </div>
            </div>
        </>
    );
}