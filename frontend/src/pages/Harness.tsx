import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_GET_ENDPOINT_COMMON, API_GET_ENDPOINT_CONFIG_ALL, API_GET_ENDPOINT_GENERATE, API_GET_ENDPOINT_UPLOAD_ALL, API_POST_ENDPOINT_HARNESS_INPUT_SETS, API_POST_ENDPOINT_HARNESS_PIPELINE, API_POST_ENDPOINT_HARNESS_SERVICE, API_POST_ENDPOINT_HARNESS_SERVICE_OVERRIDE, API_POST_ENDPOINT_HARNESS_UPDATE_SERVICE_OVERRIDE } from '../constants';
import { toast } from 'react-toastify';

export default function Harness() {
    const[type, setType] = useState("");
    const[applicationList, setApplicationList] = useState<string[]>([]);
    const[application, setApplication] = useState("");
    const[configurationFileNameList, setConfigurationFileNameList] = useState<string[]>([]);
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[envName, setEnvName] = useState("");
    const[module, setModule] = useState("");
    const[loading, setLoading] = useState(false);
    const[serviceData, setServiceData] = useState("");
    const[inputSetData, setInputSetData] = useState("");
    const[accountIdentifier, setAccountIdentifier] = useState("");
    const[orgIdentifier, setOrgIdentifier] = useState("");
    const[projectIdentifier, setProjectIdentifier] = useState("");
    const[pipelineIdentifier, setPipelineIdentifier] = useState("");
    const[branch, setBranch] = useState("");

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
        } else {
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
            setAccountIdentifier(data.accountIdentifier);
            setBranch(data.branch);
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
            // Harness_Service
            setServiceData(displayData);
            // // Harness_Pipeline
            setOrgIdentifier(data.pipeline.orgIdentifier);
            setProjectIdentifier(data.pipeline.projectIdentifier);
            // Harness_Inputset
            setInputSetData(displayData);
            setOrgIdentifier(data.inputSet.orgIdentifier);
            setProjectIdentifier(data.inputSet.projectIdentifier);
            setPipelineIdentifier(data.inputSet.pipeline.identifier);
        } catch (error) {
            console.error("Error fetching pairs:", error);
        }
    }

    function delay(ms:any) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // POST - GENERATE HARNESS
    async function submit(){
        if (!type || !application || !configurationFileName || !envName || !module) {
            toast.error("Please fill in all the fields");
            return;
        }
        await fetchCommon();
        await fetchGenerated();
        await delay(10000);
        try{
            setLoading(true);   
            if (type === "service"){
                const response1 = await axios.post(API_POST_ENDPOINT_HARNESS_SERVICE, {
                    serviceData, accountIdentifier
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else if(type === "service-override"){
                const response2 = await axios.post(API_POST_ENDPOINT_HARNESS_SERVICE_OVERRIDE, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else if(type === "update-service-override"){
                const response3 = await axios.post(API_POST_ENDPOINT_HARNESS_UPDATE_SERVICE_OVERRIDE, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else if(type === "inputset"){
                const response4 = await axios.post(API_POST_ENDPOINT_HARNESS_INPUT_SETS, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, pipelineIdentifier, branch
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else if (type === "pipeline"){
                const response5 = await axios.post(API_POST_ENDPOINT_HARNESS_PIPELINE, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, branch
                }, {
                    headers: { "Content-Type": "application/json" },
                });
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
                                <option value="service-override">Service Override</option>
                                <option value="update-service-override">Updated Service Override</option>
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