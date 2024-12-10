import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT, API_GET_ENDPOINT, API_GET_ENDPOINT_UPLOAD, API_GET_ENDPOINT_UPLOAD_ALL, API_GET_ENDPOINT_COMMON, API_GET_ENDPOINT_COMMON_ALL } from '../constants';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

interface SubMenuData {
    [applicationName: string]: {
        [envName: string]: string[];
    };
}

interface CommonMenuData {
        [envName: string]: string[];
}

export default function KeyValue(){
    const location = useLocation();
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
    const[commonMenuData, setCommonMenuData] = useState<CommonMenuData>({})
    const[existingKeyPairs, setExistingKeyPairs] = useState<{ key: string; value: any }[]>([]);
    const[showHelp, setShowHelp] = useState(false);

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
        } else if (location.pathname === "/config") {
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
            setPairs([]);
            setKey("");
            setValue("");
        }
    }, [window.location.search, location.pathname]);
    
    // ADDING KEY & VALUE PAIRS
    function handleAdd(){
        if(key || value){
            const newPairs = [...pairs, {key, value, source: "default" }];
            setPairs(newPairs);
            setKey("");
            setValue("");
            setExistingKeyPairs([]);
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
            const newPairs = configData ? Object.entries(configData)
                .map(([key, value]) => ({ key, value, source: "default" }))
                .sort((a, b) => a.key.localeCompare(b.key))
            : [];
            setPairs(newPairs);
            toast.success("Data fetched successfully");
            setLoading(false);
            setIsDataFetched(true);
            setExistingKeyPairs([]);
        } catch (error) {
            console.error("Error fetching pairs:", error);
            toast.error("Failed to fetch data");
            setLoading(false);
        }
    }
    
    function extractKey(match: string) {
        if (typeof match !== 'string') {
          throw new Error("Input must be a string");
        }
      
        return match.replace(/\{\{|\}\}/g, '').trim();
    }

    // GET - ALL UPLOAD TEMPLATE MENU
    async function allTemplateMenus() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD_ALL);
            setSubMenuData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET - ALL COMMON MENU
    async function allCommonMenus() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_COMMON_ALL);
            setCommonMenuData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET - GET UPLOADED TEMPLATE
    async function fetchUploadTemplate(application_name: string, env_name: string, configuration_file_name: string) {
        if (!application_name || !env_name || !configuration_file_name) return;
    
        if(Array.isArray(commonMenuData[env_name])){
            if (Array.isArray(subMenuData[application_name]) && subMenuData[application_name].some(file => file.replace(/\.tpl$/, '') === configuration_file_name)) {
                setLoading(true);
                setEditablePairs(true);
            } else {
                toast.info("Env name or File name does not exist in Template");
                return;
            }
        } else {
            toast.info("Env name does not exist in common");
            return;
        }

        try {
            // Fetch upload data
            const uploadResponse = await axios.get(API_GET_ENDPOINT_UPLOAD, {
                params: { application_name, configuration_file_name },
            });
    
            const uploadData = JSON.stringify(uploadResponse.data);
            const regex = /\{\{[a-zA-Z0-9 _]+\}\}/g;
            const matches = uploadData.match(regex);
    
            // Fetch common data
            const commonResponse = await axios.get(API_GET_ENDPOINT_COMMON, {
                params: { env_name },
            });
    
            const commonData = commonResponse.data.commonMap;
    
            // Fetch config data
            const configResponse = await axios.get(API_GET_ENDPOINT, {
                params: { application_name, env_name, configuration_file_name },
            });
    
            const configData = configResponse.data.configMap;
    
            // Store matched key-value pairs
            const existingPairs = Object.keys(commonData)
                .filter(key => key in configData && commonData[key] !== configData[key])
                .map(key => ({ key, value: configData[key] }));
    
            setExistingKeyPairs(existingPairs);
            if (existingPairs.length && editablePairs) {
                toast.info("This key already exists. Do you want to overwrite the value?");
            }
    
            // Initialize pairs and keys set
            const pairs: { key: string; value: string | null; source: string }[] = [];
            const keysSet = new Set<string>();
    
            // Match keys from upload data with commonData
            if (matches) {
                for (let match of matches) {
                    const keyStr = extractKey(match);
                    const configValue = configData[keyStr];
                    const commonValue = commonData[keyStr];
            
                    if (commonValue !== undefined && !keysSet.has(keyStr)) {
                        pairs.push({ key: keyStr, value: commonValue, source: "common" });
                        keysSet.add(keyStr);
                    }
            
                    if (configValue !== undefined && !keysSet.has(keyStr)) {
                        pairs.push({ key: keyStr, value: configValue, source: "upload" });
                        keysSet.add(keyStr);
                    }
                }
            }

            // Add unmatched keys from commonData
            Object.keys(commonData).forEach(keyId => {
                if (!keysSet.has(keyId)) {
                    pairs.push({ key: keyId, value: commonData[keyId], source: "" });
                    keysSet.add(keyId);
                }
            });
    
            // Add unmatched keys from configData
            if (configData) {
                Object.keys(configData).forEach(key => {
                    if (!keysSet.has(key)) {
                        pairs.push({ key: key, value: configData[key], source: "" });
                        keysSet.add(key);
                    }
                });
            }
    
            // Sort pairs and set them
            const sortedPairs = pairs.filter(item => item && typeof item.key === "string")
                .sort((a, b) => a.key.localeCompare(b.key));
    
            setPairs(sortedPairs);
            setIsDataFetched(true);
            setShowHelp(true);
        } catch (error) {
            console.error("Error fetching keys:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }

    // CALLING FUNCTION
    async function handleInputs() {
        if (applicationName && envName && configurationFileName) {
            await fetchUploadTemplate(applicationName, envName, configurationFileName);
        }
    }
    
    // CALLING FUNCTIONS
    useEffect(() => {
        if (applicationName && envName && configurationFileName) {
            allTemplateMenus();
            allCommonMenus();
        }
    }, [applicationName, envName, configurationFileName]);

    // ENABLE EDITABLE PAIRS
    const toggleEditMode = () => {
        setEditablePairs(!editablePairs);
    };

    function handleConfirmValue(existingPair: { key: string; value: any }, index: number) {
        const newPairs = [...pairs];
        const pairIndex = newPairs.findIndex(pair => pair.key === existingPair.key);
        if (pairIndex !== -1) {
            newPairs[pairIndex].value = existingPair.value;
            setPairs(newPairs);
        }
        
        const updatedKeyPairs = existingKeyPairs.filter(pair => pair.key !== existingPair.key);
        setExistingKeyPairs(updatedKeyPairs);
    }

    function handleRejectValue(key: string) {
        const updatedKeyPairs = existingKeyPairs.filter(pair => pair.key !== key);
        setExistingKeyPairs(updatedKeyPairs);
    }

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
                                    <li 
                                        key={index} 
                                        style={!editablePairs ? { backgroundColor: "white" } : {}} 
                                    >
                                        <div className={editablePairs ? "editable" : "card"}>
                                            {editablePairs ? (
                                                <input 
                                                    type="text" 
                                                    value={pair.key} 
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
                                                <input 
                                                    type="text" 
                                                    value={pair.value}
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
                                        <div className="existingPairs">
                                            {existingKeyPairs && editablePairs &&(
                                                <>
                                                    {existingKeyPairs
                                                        .filter((existingPair) => existingPair.key === pair.key)
                                                        .map((existingPair, idx) => (
                                                            <div key={existingPair.key}>
                                                                <li>{existingPair.value}</li>
                                                                <i className="fa-solid fa-check" onClick={() => handleConfirmValue(existingPair, idx)}></i>
                                                                <i className="fa-solid fa-xmark" onClick={() => handleRejectValue(existingPair.key)}></i>
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                            )}
                                        </div>
                                        <img src="/images/minus-img.png" alt="minus" onClick={() => handleRemove(index)}
                                            className={`${editablePairs ? (
                                                pair.source === "upload" ? "bg-white" : 
                                                pair.source === "common" ? "bg-green" : 
                                                pair.source === "default" ? "bg-white": "bg-red" 
                                            ) : ( 
                                                "bg-white"
                                            )}`}
                                        />
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
                    {showHelp && editablePairs &&(
                        <div className="help">
                            <div className="common">
                                <p><span></span> Common Pairs</p>
                            </div>
                            <div className="unWanted">
                                <p><span></span> Unused Pairs</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}