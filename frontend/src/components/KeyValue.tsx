import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_POST_ENDPOINT, API_GET_ENDPOINT, API_GET_ENDPOINT_CONFIG_ALL, API_GET_ENDPOINT_COMMON, API_POST_ENDPOINT_COMMON } from '../constants';
import Sidebar from './Sidebar';

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
    const[message, setMessage] = useState({text:"", type:""});
    const[loading, setLoading] = useState(false);
    const[isDisabled, setIsDisabled] = useState(false);
    const[editablePairs, setEditablePairs] = useState(false);
    const[subMenuData, setSubMenuData] = useState<SubMenuData>({})
    const[commonPairs, setCommonPairs] = useState<any[]>([]);

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
            resetState();
        }
    }, [window.location.search]);

    const resetState = () => {
        setApplicationName("");
        setEnvName("");
        setConfigurationFileName("");
        setMessage({ text: "", type: "" });
        setIsDisabled(false);
        setPairs([]);
        setKey("");
        setValue("");
    };

    async function allMenus() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_CONFIG_ALL);
            setSubMenuData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET METHOD - GET COMMON PAIRS
    async function fetchCommonPairs(env_name:string) {
        if (!env_name) return;

        try {
            setLoading(true);
            setEditablePairs(true);

            const response = await axios.get(API_GET_ENDPOINT_COMMON, {
                params: { env_name },
            });

            if (response.data.env_name === env_name) {
                const data = response.data.commonMap;
                const commonPairs = data ? Object.entries(data).map(([key, value]) => ({ key, value })) : [];

                setPairs(commonPairs);
                setCommonPairs(commonPairs);
                setMessage({ text: "Common pairs fetched successfully", type: "success" });
                setLoading(false);
            } else {
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error fetching common pairs:", error);
            setMessage({ text: "Failed to fetch common pairs", type: "error" });
        }
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    }  

    // GET METHOD - GET KEY
    async function fetchKey(application_name: string, env_name: string, configuration_file_name: string) { 
        if (!applicationName || !envName || !configurationFileName) return;
        // await allMenus();

        const configFileName = configurationFileName.replace(/\.json$/, '');
        if (subMenuData[applicationName]?.[envName]?.some(file => file.replace(/\.json$/, '') === configFileName)) {
            // console.log("Data Already Exists");
            setLoading(true);
        } else {
            return;
        }
        
        try {
            setEditablePairs(true);
            const response = await axios.get(API_GET_ENDPOINT, {
                params: {
                    application_name,
                    env_name,
                    configuration_file_name
                }
            });

            const data = response.data.configMap;
            const keyPairs = data ? Object.entries(data).map(([key]) => ({ key })) : [];
            
            const commonKeysSet = new Set(commonPairs.map(pair => pair.key));
            const filteredKeyPairs = keyPairs.filter(pair => !commonKeysSet.has(pair.key));
            const mergedPairs = [...commonPairs, ...filteredKeyPairs];

            setPairs(mergedPairs);
            setMessage({ text: "Key fetched successfully", type: "success" });
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            console.error("Error fetching key:", error);
            setMessage({ text: "Failed to fetch key", type: "error" });
        }
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    }

    async function handleInput(type:any) {
        switch (type) {
            case 'appName':
                allMenus();
                break;
    
            case 'envName':
                if (envName) {
                    await fetchCommonPairs(envName);
                }
                break;
    
            case 'fileName':
                if (configurationFileName) {
                    await fetchKey(applicationName, envName, configurationFileName);
                }
                break;
    
            default:
                break;
        }
    }    

    const toggleEditMode = () => {
        setEditablePairs(!editablePairs);
    };

    // ADDING KEY & VALUE PAIRS
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

    // REMOVING KEY & VALUE PAIRS
    function handleRemove(index: number){
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    // POST METHOD - UPLOAD CONFIG
    async function submit(){
        if (!applicationName || !envName || !configurationFileName) {
            setMessage({ text: "Please fill in all fields", type: "error" });
            setTimeout(() => {
                setMessage({text:"", type:""});
            }, 3000);
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
            const response = await axios.post(API_POST_ENDPOINT, requestData, {
                headers: { "Content-Type": "application/json" },
            });
            setMessage({text:"Data sent successfully", type:"success"});
            setPairs([]);
            setApplicationName("");
            setEnvName("");
            setConfigurationFileName("");
            setIsDisabled(false);
        } catch(error){
            console.error("Error sending data: ", error);
            setMessage({text:"Failed to send data", type:"error"});
        }

        setTimeout(() => {
            setMessage({text:"", type:""});
        }, 3000);
    }

    // GET METHOD - GET CONFIG
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
            setLoading(false);
            setIsDisabled(true);
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
                    <h5>{isDisabled ? "Re-Configuration" : "Configuration"}</h5>
                    <div className="input-container">
                        <div>
                            <label>Application Name</label>
                            <input 
                                type="text"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                                disabled={isDisabled}
                                onBlur={() => handleInput("appName")}
                            />
                        </div>
                        <div>
                            <label>ENV Name</label><br/>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                                disabled={isDisabled}
                                onBlur={() => handleInput("envName")}
                            />
                        </div>
                        <div>
                            <label>Configuration File Name</label><br/>
                            <input 
                                type="text"
                                value={configurationFileName}
                                onChange={(e) => setConfigurationFileName(e.target.value)}
                                disabled={isDisabled}
                                onBlur={() => handleInput("fileName")}
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
                    <p className={message.type === "success" ? "success" : "error" }>{message.text}</p>
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