import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_GENERATE, API_GET_ENDPOINT_GENERATE, API_POST_ENDPOINT_GENERATE_PREVIEW, API_GET_ENDPOINT_UPLOAD_ALL, API_GET_ENDPOINT_GENERATE_ALL } from '../constants';
import { toast } from 'react-toastify';
import DiffViewer from '../components/DiffViewer';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function GenerateConfig() {
    const[applicationList, setApplicationList] = useState<string[]>([]);
    const[application, setApplication] = useState("");
    const[configurationFileNameList, setConfigurationFileNameList] = useState<string[]>([]);
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[envNameList, setEnvNameList] = useState<string[]>([]);
    const[envName, setEnvName] = useState("");
    const[showDiffViewer, setShowDiffViewer] = useState(false);
    const[oldFileContent, setOldFileContent] = useState("");
    const[newFileContent, setNewFileContent] = useState("");
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAPPList();
        fetchFileNameList();
    }, [application]);

    // GET - APPLICATION NAME LIST
    async function fetchAPPList() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD_ALL);
            const data = response.data;
            const appNames = Object.keys(data);
            setApplicationList(appNames);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET - CONFIG FILE NAME LIST & ENV NAME LIST
    async function fetchFileNameList() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_GENERATE_ALL);
            const data = response.data;

            const selectedKey = application;
            const fileNames = Object.values(data[selectedKey] as Record<string, string[]>).flat();
            setConfigurationFileNameList(fileNames);

            const environments = Object.keys(data[selectedKey]);
            setEnvNameList(environments);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET METHOD - DISPLAY PREVIEW TEMPLATE
    async function previewConfig(){
        if (!application || !envName || !configurationFileName) {
            toast.error("Please select all the fields");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_GENERATE, {
                params: {
                    application_name: application,
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
                application_name: application,
                env_name: envName,
                configuration_file_name: configurationFileName
            }, {
                headers: { "Content-Type": "application/json" },
            });

            let newDisplayData = typeof responsePreview.data === 'object' 
                ? JSON.stringify(responsePreview.data, null, 4) 
                : responsePreview.data.toString();
                setNewFileContent(newDisplayData);
        } catch (error) {
            setNewFileContent(error);
        } 
        
        setShowDiffViewer(true);
        setLoading(false);
    }

    // POST METHOD - GENERATE SERVICE
    async function generateService(){
        if (oldFileContent === newFileContent){
            toast.error("No changes to generate");
            return;
        }

        try{
            setLoading(true);
            const response = await axios.post(API_POST_ENDPOINT_GENERATE, {
                application_name: application,
                env_name: envName,
                configuration_file_name: configurationFileName
            }, {
                headers: { "Content-Type": "application/json" },
            });
            toast.success("Data generated successfully");
            setApplication("");
            setConfigurationFileName("");
            setEnvName("");
            setLoading(false);
            setShowDiffViewer(false);
        } catch(error){
            console.error("Error sending data: ", error);
            toast.error("Failed to send data");
            setLoading(false);
        }
    }

    function close() {
        setShowDiffViewer(false);
    };

    return (
        <>
            <div className="config">
                <div className="form-group">
                    <h5>Service</h5>
                    <div className="service-container">
                        <FormControl fullWidth sx={{ mt: 4 }}>
                            <InputLabel className="label" id="demo-simple-select-label">Select App Name</InputLabel>
                            <Select
                                value={application}
                                onChange={(e) => setApplication(e.target.value)}
                                className="select"
                                label="Select App Name"
                            >
                                {applicationList.map((app, index) => (
                                    <MenuItem key={index} value={app}>{app}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 4 }}>
                            <InputLabel className="label" id="demo-simple-select-label">Select File Name</InputLabel>
                            <Select
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                                className="select"
                                label="Select File Name"
                            >
                                {!application && <MenuItem>No options</MenuItem>}
                                {[...new Set(configurationFileNameList)].map((fileName, index) => (
                                    <MenuItem key={index} value={fileName}>{fileName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 4 }}>
                        <InputLabel className="label" id="demo-simple-select-label">Select ENV Name</InputLabel>
                            <Select
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                                className="select"
                                label="Select ENV Name"
                            >
                                {!application && <MenuItem>No options</MenuItem>}
                                {[...new Set(envNameList)].map((envName, index) => (
                                    <MenuItem key={index}  value={envName}>{envName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    {loading && (
                        <div className='spin-con'>
                            <img className="spinner" src='/images/spinner.svg' alt='spinner'/>
                        </div>
                    )}
                    <button className='btn btn-primary mt-2' onClick={previewConfig}>Preview</button>
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
                                <button className='btn btn-success' onClick={generateService}>Generate</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}