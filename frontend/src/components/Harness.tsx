import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_GET_ENDPOINT_COMMON, API_GET_ENDPOINT_GENERATE, API_GET_ENDPOINT_UPLOAD_ALL, API_POST_ENDPOINT_HARNESS_INPUT_SETS, API_POST_ENDPOINT_HARNESS_PIPELINE, API_POST_ENDPOINT_HARNESS_SERVICE } from '../constants';
import { toast } from 'react-toastify';

export default function Harness() {
    const[applicationName, setApplicationName] = useState("");
    const[type, setType] = useState("");
    const[applicationList, setApplicationList] = useState<string[]>([]);
    const[application, setApplication] = useState("");
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

    // CLEAR ALL FIELDS
    useEffect(() => {
        const authResult = new URLSearchParams(window.location.search);
        const application_name = authResult.get('application_name');
        const env_name = authResult.get('env_name');

        if (application_name && type && application && env_name && module) {
            setApplicationName(application_name);
            setType(type);
            setApplication(application);
            setEnvName(env_name);
            setModule(module);
        } else {
            setApplicationName("");
            setType("");
            setApplication("");
            setEnvName("");
            setModule("");
        }
        fetchAPPList();
    }, [window.location.search]);

    // GET METHOD - GET UPLOADED COMMON
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

    // GET METHOD - GET GENERATED TEMPLATE
    async function fetchGenerated() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_GENERATE  , {
                params: {
                    application_name: application,
                    env_name: envName,
                    configuration_file_name:`harness_${type}`
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

    // POST METHOD - GENERATE HARNESS
    async function submit(){
        if (!applicationName || !type || !application || !envName || !module) {
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
            } else if(type === "inputset"){
                const response2 = await axios.post(API_POST_ENDPOINT_HARNESS_INPUT_SETS, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, pipelineIdentifier, branch
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else if (type === "pipeline"){
                const response3 = await axios.post(API_POST_ENDPOINT_HARNESS_PIPELINE, {
                    inputSetData, accountIdentifier, orgIdentifier, projectIdentifier, branch
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                setLoading(false);
                return;
            }
            toast.success("Data sent successfully");
            setApplicationName("");
            setType("");
            setApplication("");
            setEnvName("");
            setModule("");
            setLoading(false);
        } catch(error){
            console.error("Error sending data: ", error);
            toast.error("Failed to send data");
            setLoading(false);
        }
    }

    // GET METHOD - GET APPLICATION NAME LIST
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

    return (
        <>
            <div className="config">
                <div className="form-group">
                    <h5>Harness</h5>
                    <div className="input-container">
                        <div>
                            <label>Application Name</label>
                            <input 
                                type="text"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                            />
                        </div>
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