import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_GET_ENDPOINT, API_GET_ENDPOINT_COMMON, API_GET_ENDPOINT_CONFIG_ALL, API_GET_ENDPOINT_GENERATE, API_GET_ENDPOINT_UPLOAD_ALL, API_POST_ENDPOINT_HARNESS_INPUT_SETS, API_POST_ENDPOINT_HARNESS_PIPELINE, API_POST_ENDPOINT_HARNESS_SERVICE, API_POST_ENDPOINT_HARNESS_SERVICE_OVERRIDE, API_POST_ENDPOINT_HARNESS_UPDATE_SERVICE_OVERRIDE } from '../constants';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

export default function Harness() {
    const location = useLocation();
    const[type, setType] = useState("");
    const[applicationList, setApplicationList] = useState<string[]>([]);
    const[application, setApplication] = useState("");
    const[configurationFileNameList, setConfigurationFileNameList] = useState<string[]>([]);
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[envName, setEnvName] = useState("");
    const[module, setModule] = useState("");
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAPPList();
        fetchFileNameList();
    }, [application]);
    
    // CLEAR ALL FIELDS
    useEffect(() => {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name');
        const env_name = authResult.get('env_name');

        if (application_name && type && application && env_name && module) {
            setType(type);
            setApplication(application);
            setConfigurationFileName(configurationFileName);
            setEnvName(env_name);
            setModule(module);
        } else if (location.pathname === "/harness") {
            setType("");
            setApplication("");
            setConfigurationFileName("");
            setEnvName("");
            setModule("");
        }
    }, [window.location.search]);

    // GET - COMMON
    async function fetchCommon() { 
        try {
            const response = await axios.get(API_GET_ENDPOINT_COMMON, {
                params: { env_name:envName }
            });
            const data = response.data.commonMap;
            return data; 
        } catch (error) {
            console.error("Error fetching pairs:", error);
        }
    }

    // GET - CONFIG
    async function fetchConfig() {
        try {
            const response = await axios.get(API_GET_ENDPOINT, {
                params: {
                    application_name: application,
                    env_name: envName,
                    configuration_file_name: configurationFileName.replace('.json', '')
                }
            });
            const data = response.data.configMap;
            return data; 
        } catch (error) {
            console.error("Error fetching pairs:", error);
        }
    }

    // GET - GENERATED TEMPLATE
    async function fetchGenerated() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_GENERATE, {
                params: {
                    application_name: application,
                    env_name: envName,
                    configuration_file_name: configurationFileName.replace('.json', '')
                }
            });
            const data = response.data;
            let displayData;
            if (typeof data === 'object') {
                displayData = JSON.stringify(data, null, 4);
            } else {
                displayData = data.toString();
            }
            return displayData; 
        } catch (error) {
            console.error("Error fetching pairs:", error);
        }
    }

    // POST - GENERATE HARNESS
    async function submit(){
        if (!type || !application || !configurationFileName || !envName || !module) {
            toast.error("Please fill in all the fields");
            return;
        }

        try{
            setLoading(true);

            const commonData = await fetchCommon();
            const configData = await fetchConfig();
            const generatedData = await fetchGenerated();

            if (type === "service"){
                const serviceData = generatedData;
                const accountIdentifier = commonData.accountIdentifier;

                const response1 = await axios.post(API_POST_ENDPOINT_HARNESS_SERVICE, { serviceData, accountIdentifier});
            } else if(type === "override"){
                const inputSetData = generatedData;
                const accountIdentifier = commonData.accountIdentifier;
                const orgIdentifier = configData.orgIdentifier;
                const projectIdentifier = configData.projectIdentifier;

                const response2 = await axios.post(API_POST_ENDPOINT_HARNESS_SERVICE_OVERRIDE, { inputSetData, accountIdentifier, orgIdentifier, projectIdentifier });
            } else if(type === "update-override"){
                const inputSetData = generatedData;
                const accountIdentifier = commonData.accountIdentifier;
                const orgIdentifier = configData.orgIdentifier;
                const projectIdentifier = configData.projectIdentifier;

                const response3 = await axios.post(API_POST_ENDPOINT_HARNESS_UPDATE_SERVICE_OVERRIDE, { inputSetData, accountIdentifier, orgIdentifier, projectIdentifier });
            } else if(type === "inputset"){
                const inputSetData = generatedData;
                const accountIdentifier = commonData.accountIdentifier;
                const orgIdentifier = configData.orgIdentifier;
                const projectIdentifier = configData.projectIdentifier;
                const pipelineIdentifier = configData.identifier;
                const branch = commonData.branch;

                const response4 = await axios.post(API_POST_ENDPOINT_HARNESS_INPUT_SETS, { inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, pipelineIdentifier, branch });
            } else if (type === "pipeline"){
                const inputSetData = generatedData;
                const accountIdentifier = commonData.accountIdentifier;
                const orgIdentifier = configData.orgIdentifier;
                const projectIdentifier = configData.projectIdentifier;
                const branch = commonData.branch;

                const response5 = await axios.post(API_POST_ENDPOINT_HARNESS_PIPELINE, { inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, branch });
            } else {
                setLoading(false);
                return;
            }
            toast.success("Data sent successfully");
            setConfigurationFileName("");
            setType("");
            setApplication("");
            setEnvName("");
            setModule("");
            setLoading(false);
        } catch(error:any){
            console.error("Error sending data: ", error);
            const errorMessage = error.response?.data || error.message;
            toast.error(`Failed to send data: ${errorMessage}`);
            setLoading(false);
        }
    }

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

    // GET - CONFIG FILE NAME LIST
    async function fetchFileNameList() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_CONFIG_ALL);
            const data = response.data;
    
            const selectedKey = application;
            const fileNames = Object.values(data[selectedKey] as Record<string, string[]>).flat();
    
            setConfigurationFileNameList(fileNames);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <>
            <div className="config">
                <div className="form-group">
                    <h5>Harness</h5>
                    <div className="input-container">
                        <div>
                            <label>Type</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                            >
                                <option value="">Select Type</option>
                                <option value="infra">Infra</option>
                                <option value="env">ENV</option>
                                <option value="service">Service</option>
                                <option value="override">Override</option>
                                <option value="update-override">Updated Override</option>
                                <option value="pipeline">Pipeline</option>
                                <option value="inputset">InputSet</option>
                            </select>
                        </div>
                        <div>
                            <label>Application</label>
                            <select 
                                value={application} 
                                onChange={(e) => setApplication(e.target.value)} 
                            >
                                <option value="">Select App</option>
                                {applicationList.map((app, index) => (
                                <option key={index} value={app}>{app}</option>
                            ))}
                            </select>
                        </div>
                        <div>
                            <label>Configuration File Name</label>
                            <select
                                value={configurationFileName} 
                                onChange={(e) => setConfigurationFileName(e.target.value)} 
                            >
                                <option value="">Select File Name</option>
                                {[...new Set(configurationFileNameList)].map((fileName, index) => (
                                    <option key={index} value={fileName}>
                                        {fileName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>ENV Name</label>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Module</label><br/>
                            <input 
                                type="text"
                                value={module}
                                onChange={(e) => setModule(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading && (
                        <div className='spin-con'>
                            <img className="spinner" src='/images/spinner.svg' alt='spinner'/>
                        </div>
                    )}
                    <button className='btn btn-success' onClick={submit}>Submit</button>
                </div>
            </div>
        </>
    );
}