import React, { useState } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT_GENERATE } from '../constants';

export default function GenerateConfig() {
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[message, setMessage] = useState({text:"", type:""});

    // POST METHOD
    async function generate(){
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
            console.log(response);
        } catch(error){
            console.error("Error sending data: ", error);
            setMessage({text:"Failed to send data", type:"error"});
        }

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    return (
        <div className="config">
            <div className="form-group">
                <h5>Generate Config</h5>
                <div className="keyId-group">
                    <div className='text-left mt-3'>
                        <label>Application Name</label>
                        <input 
                            type="text"
                            value={applicationName}
                            onChange={(e) => setApplicationName(e.target.value)}
                        />
                    </div>
                    <div className='text-left mt-3'>
                        <label>ENV Name</label>
                        <input 
                            type="text"
                            value={envName}
                            onChange={(e) => setEnvName(e.target.value)}
                        />
                    </div>
                    <div className='text-left mt-3'>
                        <label>Configuration File Name</label><br/>
                        <input 
                            type="text"
                            value={configurationFileName}
                            onChange={(e) => setConfigurationFileName(e.target.value)}
                        />
                    </div>
                </div>
                <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
                <button className='btn btn-success' onClick={generate}>Generate</button>
            </div>
        </div>
    );
}