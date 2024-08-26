import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT, API_GET_ENDPOINT } from '../constants';
import Sidebar from './Sidebar';

interface Props{
    application_name: string,
    env_name: string,
    configuration_file_name: string
}

export default function KeyValue(){
    const[key, setKey] = useState("");
    const[value, setValue] = useState("");
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[pairs, setPairs] = useState<any[]>([]);
    const[message, setMessage] = useState({text:"", type:""});

    function handleAdd(){
        if(key && value){
            const newPairs = [...pairs, {key, value}];
            setPairs(newPairs);
            setKey("");
            setValue("");
        } else {
            setMessage({text:"Please enter both key and value", type:"error"});
        }

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    function handleRemove(index: number){
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    // POST METHOD
    async function submit(){
        const requestData ={
            configMap: {
                ...Object.fromEntries(pairs.map(pair => [pair.key, pair.value]))    
            },
            application_name: applicationName,
            env_name: envName,
            configuration_file_name: configurationFileName
        };
        try{
            const response = await axios.post(API_POST_ENDPOINT, requestData, {
                headers: { "Content-Type": "application/json" },
            });
            setMessage({text:"Data sent successfully", type:"success"});
            setPairs([]);
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
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
        console.log("Retrieve called with:", application_name, env_name, configuration_file_name);

        try {
            const response = await axios.get(API_GET_ENDPOINT, {
                params: {
                    application_name,
                    env_name,
                    configuration_file_name
                }
            });
            const data = response.data.configMap;
            const newPairs = data ? Object.entries(data).map(([key, value]) => ({ key, value })) : [];
            setPairs(newPairs);
            setMessage({ text: "Data fetched successfully", type: "success" });
        } catch (error) {
            console.error("Error fetching pairs:", error);
            setMessage({ text: "Failed to fetch data", type: "error" });
        }
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === "Enter"){
            handleAdd();
        }
    }

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">    
                <div className="form-group">
                    <h5>Configuration</h5>
                    <div className='keyId-group'>
                        <div className='text-left'>
                            <label>Application Name</label>
                            <input 
                                type="text"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                            />
                        </div>
                        <div className='text-left'>
                            <label>ENV Name</label><br/>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                            />
                        </div>
                        <div className='text-left'>
                            <label>Configuration File Name</label><br/>
                            <input 
                                type="text"
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='cards'>
                        <ul className="list-unstyled">
                            {pairs.map((pair, index) => (
                                <li key={index}>
                                    <div className='card'>
                                        <span>{pair.key}</span>
                                    </div>
                                    <div className='card'>
                                        <span>{pair.value}</span>
                                    </div>
                                    <img src="/images/minus-img.png" alt="minus" onClick={() => handleRemove(index)} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='keyValue-group'>
                        <input 
                            type="text"
                            placeholder="Enter key"
                            value={key}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder="Enter value"
                            value={value}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <img src="/images/plus-img.png" alt="plus" onClick={handleAdd} />
                    </div>
                    <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
                    {pairs.length > 0 && (
                        <button className='btn btn-success' onClick={submit}>Submit</button>
                    )}
                </div>
            </div>
        </>
    );
}