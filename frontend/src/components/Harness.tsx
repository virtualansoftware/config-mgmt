import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_GET_ENDPOINT_UPLOAD_ALL, API_POST_ENDPOINT_HARNESS } from '../constants';
import { toast } from 'react-toastify';

export default function Harness() {
    const[applicationName, setApplicationName] = useState("");
    const[type, setType] = useState("");
    const[applicationList, setApplicationList] = useState<string[]>([]);
    const[application, setApplication] = useState("");
    const[envName, setEnvName] = useState("");
    const[module, setModule] = useState("");
    const[loading, setLoading] = useState(false);

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

    // POST METHOD - GENERATE HARNESS
    async function submit(){
        if (!applicationName || !type || !application || !envName || !module) {
            toast.error("Please fill in all the fields");
            return;
        }

        try{
            setLoading(true);
            const response = await axios.post(API_POST_ENDPOINT_HARNESS, {
                applicationName,
                type,
                application,
                envName,
                module
            }, {
                headers: { "Content-Type": "application/json" },
            });
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
                                <option value="app1">Infra</option>
                                <option value="app2">ENV</option>
                                <option value="app3">Service</option>
                                <option value="app4">Pipeline</option>
                                <option value="app5">InputSet</option>
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