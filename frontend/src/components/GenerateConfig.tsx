import React, { useState } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_GENERATE, API_GET_ENDPOINT_GENERATE } from '../constants';
import Sidebar from './Sidebar';

export default function GenerateConfig() {
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[textArea, setTextArea] = useState("");
    const[message, setMessage] = useState({text:"", type:""});
    const[generatedData, setGeneratedData] = useState({ application_name: "", env_name: "", configuration_file_name: "" });
    const[loading, setLoading] = useState(false);

    // POST METHOD
    async function generateConfig(){
        if (!applicationName || !envName || !configurationFileName) {
            setMessage({ text: "Please fill in all fields", type: "error" });
            setTimeout(() => {
                setMessage({text:"", type:""});
            }, 3000);
            return;
        }

        try{
            const response = await axios.post(API_POST_ENDPOINT_GENERATE, {
                application_name: applicationName,
                env_name: envName,
                configuration_file_name: configurationFileName
            }, {
                headers: { "Content-Type": "application/json" },
            });
            setMessage({text:"Data generated successfully", type:"success"});
            setApplicationName("");
            setConfigurationFileName("");
            setEnvName("");
            setTextArea("");
        } catch(error){
            console.error("Error sending data: ", error);
            setMessage({text:"Failed to send data", type:"error"});
        }

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    // GET METHOD
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
            setTextArea(response.data);
            setMessage({ text: "Data fetched successfully", type: "success" });
            setLoading(false);
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
                    <h5>Generate Config</h5>
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
                            <label>ENV Name</label>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Configuration File Name</label><br/>
                            <input 
                                type="text"
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                            />
                        </div>
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
                                            readOnly
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
                    <button className='btn btn-success' onClick={generateConfig}>Generate</button>
                </div>
            </div>
        </>
    );
}