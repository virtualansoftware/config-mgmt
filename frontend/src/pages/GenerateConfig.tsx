import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_GENERATE, API_GET_ENDPOINT_GENERATE, API_POST_ENDPOINT_GENERATE_PREVIEW } from '../constants';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import DiffViewer from '../components/DiffViewer';
import { useLocation } from 'react-router-dom';

export default function GenerateConfig() {
    const location = useLocation();
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[textArea, setTextArea] = useState("");
    const[loading, setLoading] = useState(false);
    const[isDisabled, setIsDisabled] = useState(false);
    const[showDiffViewer, setShowDiffViewer] = useState(false);
    const[oldFileContent, setOldFileContent] = useState("");
    const[newFileContent, setNewFileContent] = useState("");
    const[copyButtonText, setCopyButtonText] = useState("Copy Text");

    // CLEAR ALL FIELDS
    useEffect(() => {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name');
        const env_name = authResult.get('env_name');
        const configuration_file_name = authResult.get('configuration_file_name');

        if (application_name && env_name && configuration_file_name) {
            setApplicationName(application_name);
            setEnvName(env_name);
            setConfigurationFileName(configuration_file_name);
        } else if (location.pathname === "/generate-config") {
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
            setTextArea("");
        }
    }, [window.location.search]);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(textArea)
            .then(() => {
                setCopyButtonText("Copied!");
                setTimeout(() => setCopyButtonText("Copy Text"), 2000);
            })
            .catch(() => {
                toast.error("Failed to copy text");
            });
    };

    // GET METHOD - DISPLAY PREVIEW TEMPLATE
    async function previewConfig(){       
        if (!applicationName || !envName || !configurationFileName) {
            toast.error("Please fill in all the fields");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_GENERATE, {
                params: {
                    application_name: applicationName,
                    env_name: envName,
                    configuration_file_name: configurationFileName
                }
            });

            let oldDisplayData = typeof response.data === 'object' 
                ? JSON.stringify(response.data, null, 4) 
                : response.data.toString();
            setOldFileContent(oldDisplayData);
        } catch (error) {
            setOldFileContent(error);
            toast.error("Failed to fetch data");
            setLoading(false);
        }

        try{
            const responsePreview = await axios.post(API_POST_ENDPOINT_GENERATE_PREVIEW,  {
                application_name: applicationName,
                env_name: envName,
                configuration_file_name: configurationFileName
            }, {
                headers: { "Content-Type": "application/json" },
            });

            let newDisplayData = typeof responsePreview.data === 'object' 
                ? JSON.stringify(responsePreview.data, null, 4) 
                : responsePreview.data.toString();
                setNewFileContent(newDisplayData);
                console.log(newDisplayData);
        } catch (error) {
            setNewFileContent(error);
        } 
        
        setShowDiffViewer(true);
        setLoading(false);
    }

    // POST METHOD - GENERATE TEMPLATE
    async function generateConfig(){
        if (!applicationName || !envName || !configurationFileName) {
            toast.error("Please fill in all the fields");
            return;
        }

        if (oldFileContent === newFileContent){
            toast.error("No changes to generate");
            return;
        }

        try{
            setLoading(true);
            const response = await axios.post(API_POST_ENDPOINT_GENERATE, {
                application_name: applicationName,
                env_name: envName,
                configuration_file_name: configurationFileName
            }, {
                headers: { "Content-Type": "application/json" },
            });
            toast.success("Data generated successfully");
            setApplicationName("");
            setConfigurationFileName("");
            setEnvName("");
            setTextArea("");
            setLoading(false);
            setIsDisabled(false);
            setShowDiffViewer(false);
        } catch(error){
            console.error("Error sending data: ", error);
            toast.error("Failed to send data");
            setLoading(false);
        }
    }

    // GET METHOD - GET GENERATED TEMPLATE
    async function retrieve() {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name')
        const env_name = authResult.get('env_name')
        const configuration_file_name = authResult.get('configuration_file_name');

        setApplicationName(application_name);
        setEnvName(env_name);
        setConfigurationFileName(configuration_file_name);

        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_GENERATE, {
                params: {
                    application_name,
                    env_name,
                    configuration_file_name
                }
            });
            let displayData;

            if (typeof response.data === 'object') {
                displayData = JSON.stringify(response.data, null, 4);
            } else {
                displayData = response.data.toString();
            }

            setTextArea(displayData);
            toast.success("Data fetched successfully");
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            toast.error("Failed to fetch data");
            setLoading(false);
        }
    }

    // DOWNLOADING GENERATED TEMPLATE
    function downloadFile() {
        const blob = new Blob([textArea], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${configurationFileName}.txt`;
        link.click();
    };

    function close() {
        setShowDiffViewer(false);
    };

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">
                <div className="form-group">
                    <h5>Generate Config</h5>
                    <div className="input-container">
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
                            <label>ENV Name</label>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
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
                        {loading ? (
                            <div className='spin-con'>
                                <img className="spinner" src='/images/spinner.svg' alt='spinner'/>
                            </div>
                        ) : (
                            <>
                                {textArea && (
                                    <div className="textArea-container">
                                        <label>Text Template</label><br/>
                                        <textarea
                                            className="textarea"
                                            rows={20}
                                            value={textArea}
                                            onChange={(e) => setTextArea(e.target.value)}
                                            disabled={isDisabled}
                                        />
                                        <div className="copyButton">
                                            <button onClick={handleCopy}>
                                                <i className={`fa-solid ${copyButtonText === "Copied!" ? "fa-check" : "fa-copy"}`}></i>
                                                {copyButtonText}
                                            </button>
                                        </div>
                                        <div className="download">
                                            <button className='btn btn-primary' onClick={previewConfig}>Preview</button>
                                            <button className='btn btn-success' onClick={downloadFile}>Download</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {!isDisabled && (
                        <button className='btn btn-primary' onClick={previewConfig}>Preview</button>
                    )}
                    { showDiffViewer && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-head">
                                    <h4>Preview</h4>
                                    <i className="fa-solid fa-xmark" onClick={close}></i>
                                </div>
                                <div className="modal-body">
                                   <DiffViewer oldText={oldFileContent} newText={newFileContent} />
                                </div>
                                <button className='btn btn-success' onClick={generateConfig}>Generate</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}