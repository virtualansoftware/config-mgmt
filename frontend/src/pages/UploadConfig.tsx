import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_UPLOAD, API_GET_ENDPOINT_UPLOAD } from '../constants';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

export default function UploadConfig() {
    const [applicationName, setApplicationName] = useState("");
    const [configurationFileName, setConfigurationFileName] = useState("");
    const [file, setFile] = useState(null);
    const [textArea, setTextArea] = useState("");
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
            setIsDisabled(false);
        }
    }, [window.location.search]);

    // POST METHOD - UPLOAD TEMPLATE
    async function upload() {
        if (!applicationName || !configurationFileName || (!file && !textArea)) {
            toast.error("Please fill in all the fields");
            return;
        }
        
        if (textArea){
            if (textArea === originalTextArea){
                toast.error("No changes made to the template");
                return;
            }
        }

        const formData = new FormData();
        formData.append('application_name', applicationName);
        formData.append('configuration_file_name', configurationFileName);
        if (file) formData.append('file', file);
        if (textArea) formData.append('template', textArea);

        try {
            setLoading(true);
            const response = await axios.post(API_POST_ENDPOINT_UPLOAD, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Data uploaded successfully");
            setApplicationName("");
            setConfigurationFileName("");
            setFile(null);
            setTextArea("");
            setIsDisabled(false);
            setLoading(false);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error sending data: ", error);
            toast.error("Failed to send data");
            setLoading(false);
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
            toast.success("Data fetched successfully");
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            toast.error("Failed to fetch data");
            setLoading(false);
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
                                            rows={20}
                                            value={textArea}
                                            onChange={(e) => setTextArea(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <button className='btn btn-success' onClick={upload}>Upload</button>
                </div>
            </div>
        </>
    );
}