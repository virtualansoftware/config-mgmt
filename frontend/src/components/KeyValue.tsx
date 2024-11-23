import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT, API_GET_ENDPOINT, API_GET_ENDPOINT_UPLOAD, API_GET_ENDPOINT_UPLOAD_ALL, API_GET_ENDPOINT_COMMON } from '../constants';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';

interface SubMenuData {
    [applicationName: string]: {
        [envName: string]: string[];
    };
}

export default function KeyValue(){
    const[key, setKey] = useState("");
    const[value, setValue] = useState("");
    const[applicationName, setApplicationName] = useState("");
    const[envName, setEnvName] = useState("");
    const[configurationFileName, setConfigurationFileName] = useState("");
    const[pairs, setPairs] = useState<any[]>([]);
    const[loading, setLoading] = useState(false);
    const[isDataFetched, setIsDataFetched] = useState(false);
    const[editablePairs, setEditablePairs] = useState(false);
    const[subMenuData, setSubMenuData] = useState<SubMenuData>({})

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
            setPairs([]);
            setKey("");
            setValue("");
        }
    }, [window.location.search]);

    // ADDING KEY & VALUE PAIRS
    function handleAdd(){
        if(key || value){
            const newPairs = [...pairs, {key, value}];
            setPairs(newPairs);
            setKey("");
            setValue("");
        } else {
            toast.error("Please enter key or value");
        }
    }

    // CLICK ENTER TO ADD PAIRS
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === "Enter"){
            handleAdd();
        }
    }

    // REMOVING KEY & VALUE PAIRS
    function handleRemove(index: number){
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);
    }

    // POST - UPLOAD CONFIG
    async function submit(){
        if(editablePairs){
            toast.error("Please save before proceeding");
            return;
        }
        if (!applicationName || !envName || !configurationFileName) {
            toast.error("Please fill in all the fields");
            return;
        }

        const requestData ={
            configMap: {
                ...Object.fromEntries(pairs.map(pair => [pair.key, pair.value]))    
            },
            application_name: applicationName,
            env_name: envName,
            configuration_file_name: configurationFileName
        };
        try{
            setLoading(true);
            const response = await axios.post(API_POST_ENDPOINT, requestData, {
                headers: { "Content-Type": "application/json" },
            });
            toast.success("Data sent successfully");
            setPairs([]);
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
            setLoading(false);
        } catch(error){
            console.error("Error sending data: ", error);
            toast.error("Failed to send data");
            setLoading(false);
        }
    }

    // GET - GET CONFIG
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
            setEditablePairs(false);
            const configResponse = await axios.get(API_GET_ENDPOINT, {
                params: {
                    application_name,
                    env_name,
                    configuration_file_name
                }
            });
            const configData = configResponse.data.configMap;
            const newPairs = configData ? Object.entries(configData).map(([key, value]) => ({ key, value })) : [];
            setPairs(newPairs);
            toast.success("Data fetched successfully");
            setLoading(false);
            setIsDataFetched(true);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            toast.error("Failed to fetch data");
            setLoading(false);
        }
    }
    
    // GET - GET ALL CONFIG DATA
    async function allMenus() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD_ALL);
            setSubMenuData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET - GET UPLOADED TEMPLATE
    async function fetchUploadTemplate(application_name: string, env_name: string, configuration_file_name: string) {
        if (!application_name || !env_name || !configuration_file_name) return;
    
        if (Array.isArray(subMenuData[application_name]) &&
            subMenuData[application_name].some(file => file.replace(/\.tpl$/, '') === configuration_file_name)) {
            setLoading(true);
            setEditablePairs(true);
        } else {
            return;
        }
    
        try {
            // Fetch data from the upload endpoint
            const uploadResponse = await axios.get(API_GET_ENDPOINT_UPLOAD, {
                params: { application_name, configuration_file_name },
            });
    
            let uploadData = JSON.stringify(uploadResponse.data);
            let regex = /\{\{[a-zA-Z0-9]+\}\}/g;
            let matches = uploadData.match(regex);
    
            // Fetch data from the common endpoint
            const commonResponse = await axios.get(API_GET_ENDPOINT_COMMON, {
                params: { env_name },
            });
    
            const commonData = commonResponse.data.commonMap;
            const newPairs: Record<string, string> = Object.entries(commonData).reduce(
                (acc, [key, value]) => {
                    acc[key.trim()] = value as string;
                    return acc;
                },
                {} as Record<string, string>
            );
            const commonKeys = Object.keys(commonData);
    
            // Fetch data from the config endpoint
            const configResponse = await axios.get(API_GET_ENDPOINT, {
                params: { application_name, env_name, configuration_file_name },
            });
    
            const configData = configResponse.data.configMap;
    
            const pairs: { key: string; value: string | null }[] = [];
            const keysSet = new Set<string>();
    
            if (matches) {
                for (let match of matches) {
                    const key = match.replace(/\{\{|\}\}/g, '').trim();
    
                    // If the key exists in common data, use the value, else set to null
                    const value = newPairs[key] || configData[key] || null;
                    if (!keysSet.has(key)) {
                        pairs.push({ key, value });
                        keysSet.add(key);
                    }
                }
            }
    
            // Add unmatched common keys
            for (const key of commonKeys) {
                if (!keysSet.has(key)) {
                    pairs.push({ key, value: newPairs[key] || configData[key] || null });
                    keysSet.add(key);
                }
            }
    
            // Add unmatched config keys
            for (const key of Object.keys(configData)) {
                if (!keysSet.has(key)) {
                    pairs.push({ key, value: configData[key] || null });
                    keysSet.add(key);
                }
            }
    
            setPairs(pairs);
            toast.success("Keys fetched successfully");
            setIsDataFetched(true);
        } catch (error) {
            console.error("Error fetching keys:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }    

    // CALLING FUNCTIONS
    async function handleInputs() {
        allMenus();
        if (configurationFileName) {
            await fetchUploadTemplate(applicationName, envName, configurationFileName);
        }
    }

    // ENABLE EDITABLE PAIRS
    const toggleEditMode = () => {
        setEditablePairs(!editablePairs);
    };

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">    
                <div className="form-group">
                    <h5>{isDataFetched ? "Re-Configuration" : "Configuration"}</h5>
                    <div className="input-container">
                        <div>
                            <label>Application Name</label>
                            <input 
                                type="text"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                                onBlur={handleInputs}
                            />
                        </div>
                        <div>
                            <label>ENV Name</label><br/>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                                onBlur={handleInputs}
                            />
                        </div>
                        <div>
                            <label>Configuration File Name</label><br/>
                            <input 
                                type="text"
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                                onBlur={handleInputs}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className='spin-con'>
                            <img className="spinner" src='/images/spinner.svg' alt='spinner'/>
                        </div>
                    ) : (
                        <div className="cards">
                            <ul className="list-unstyled">
                                {pairs.map((pair, index) => (
                                    <li key={index}>
                                        <div className={editablePairs ? "editable" : "card"}>
                                            {editablePairs ? (
                                                <input type="text" value={pair.key} 
                                                    onChange={(e) => {
                                                        const newPairs = [...pairs];
                                                        newPairs[index].key = e.target.value;
                                                        setPairs(newPairs);
                                                    }} 
                                                />
                                            ) : (
                                                <span>{pair.key}</span>
                                            )}
                                        </div>  
                                        <div className={editablePairs ? "editable" : "card"}>
                                            {editablePairs ? (
                                                <input type="text" value={pair.value}
                                                    onChange={(e) => {
                                                        const newPairs = [...pairs];
                                                        newPairs[index].value = e.target.value;
                                                        setPairs(newPairs);
                                                    }} 
                                                />
                                            ) : (
                                                <span>{pair.value}</span>
                                            )}
                                        </div>
                                        <img src="/images/minus-img.png" alt="minus" onClick={() => handleRemove(index)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
                    {pairs.length > 0 && (
                        <>
                            <button className='btn btn-success me-2' onClick={submit}>Submit</button>
                            <button className='btn btn-primary' onClick={toggleEditMode}>{editablePairs ? "Save Changes" : "Edit"}</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}