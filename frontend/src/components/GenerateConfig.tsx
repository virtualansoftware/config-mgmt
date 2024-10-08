import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_GENERATE, API_GET_ENDPOINT_GENERATE } from '../constants';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';

export default function GenerateConfig() {
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[textArea, setTextArea] = useState("");
    // const[message, setMessage] = useState({text:"", type:""});
    const[loading, setLoading] = useState(false);
    const[isDisabled, setIsDisabled] = useState(false);

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
        } else {
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
            // setMessage({ text: "", type: "" });
            setIsDisabled(false);
        }
    }, [window.location.search]);

    // CLEARS THE MESSAGE AFTER 3 SEC
    // useEffect(() => {
    //     if (message.text) {
    //         const timer = setTimeout(() => {
    //             setMessage({ text: "", type: "" });
    //         }, 3000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [message]);

    // POST METHOD - GENERATE CONFIG
    async function generateConfig(){
        if (!applicationName || !envName || !configurationFileName) {
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
            // setMessage({text:"Data generated successfully", type:"success"});
            toast.success("Data generated successfully");
            setApplicationName("");
            setConfigurationFileName("");
            setEnvName("");
            setTextArea("");
            setIsDisabled(false);
        } catch(error){
            console.error("Error sending data: ", error);
            // setMessage({text:"Failed to send data", type:"error"});
            toast.error("Failed to send data");
        }
    }

    // GET METHOD - GET GENERATED CONFIG
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
            setTextArea(JSON.stringify(response.data, null, 4));
            // setMessage({ text: "Data fetched successfully", type: "success" });
            toast.success("Data fetched successfully");
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            // setMessage({ text: "Failed to fetch data", type: "error" });
            toast.error("Failed to send data");
        }
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
                                    <div>
                                        <label>Text Template</label><br/>
                                        <textarea
                                            className="textarea"
                                            rows={5}
                                            value={textArea}
                                            onChange={(e) => setTextArea(e.target.value)}
                                            disabled={isDisabled}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {/* <p className={message.type === "success" ? "success" : "error" }>{message.text}</p> */}
                    {!isDisabled && (
                        <button className='btn btn-success' onClick={generateConfig}>Generate</button>
                    )}
                </div>
            </div>
        </>
    );
}