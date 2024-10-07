import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { API_GET_ENDPOINT_COMMON, API_POST_ENDPOINT_COMMON } from '../constants';
import { toast } from 'react-toastify';

export default function Common(){
    const[key, setKey] = useState("");
    const[value, setValue] = useState("");
    const[envName, setEnvName] = useState("");
    const[pairs, setPairs] = useState<any[]>([]);
    // const[message, setMessage] = useState({text:"", type:""});
    const[loading, setLoading] = useState(false);
    const[isDisabled, setIsDisabled] = useState(false);
    const[editablePairs, setEditablePairs] = useState(false);

    // CLEAR ALL FIELDS
    useEffect(() => {
        const authResult = new URLSearchParams(window.location.search);
        const env_name = authResult.get('env_name');

        if (env_name) {
            setEnvName(env_name);
        } else {
            setEnvName("");
            // setMessage({ text: "", type: "" });
            setIsDisabled(false);
            setPairs([]);
            setKey("");
            setValue("");
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

    // ADDING KEY & VALUE PAIRS
    function handleAdd(){
        if(key || value){
            const newPairs = [...pairs, {key, value}];
            setPairs(newPairs);
            setKey("");
            setValue("");
        } else {
            // setMessage({text:"Please enter key or value", type:"error"});
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

    // POST METHOD - UPLOAD COMMON
    async function submit(){
        if(editablePairs){
            // setMessage({ text: "Please save before proceeding", type: "error" });
            toast.error("Please save before proceeding");
            return;
        }
        if (!envName) {
            // setMessage({ text: "Please fill in all fields", type: "error" });
            toast.error("Please fill in all fields");
            return;
        }

        const requestData ={
            commonMap: {
                ...Object.fromEntries(pairs.map(pair => [pair.key, pair.value]))    
            },
            env_name: envName
        };
        try{
            const response = await axios.post(API_POST_ENDPOINT_COMMON, requestData, {
                headers: { "Content-Type": "application/json" },
            });
            // setMessage({text:"Data sent successfully", type:"success"});
            toast.success("Data fetched successfully");
            setPairs([]);
            setEnvName("");
            setIsDisabled(false);
        } catch(error){
            console.error("Error sending data: ", error);
            // setMessage({text:"Failed to send data", type:"error"});
            toast.error("Failed to send data");
        }
    }

    // GET METHOD - GET UPLOADED COMMON
    async function retrieve() { 
        const authResult = new URLSearchParams(window.location.search);
        const env_name = authResult.get('env_name')

        setEnvName(env_name);

        try {
            setLoading(true);
            setEditablePairs(false);
            const response = await axios.get(API_GET_ENDPOINT_COMMON, {
                params: {
                    env_name
                }
            });
            const data = response.data.commonMap;
            const newPairs = data ? Object.entries(data).map(([key, value]) => ({ key, value })) : [];
            setPairs(newPairs);
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

    // ENABLE EDITABLE PAIRS
    const toggleEditMode = () => {
        setEditablePairs(!editablePairs);
    };

    return (
        <>
            <Sidebar onRetrieve={retrieve}/>
            <div className="config">    
                <div className="form-group">
                    <h5>{isDisabled ? "Re-Configure Common Files" : "Common Files"}</h5>
                    <div className="input-container">
                        <div>
                            <label>ENV Name</label><br/>
                            <input 
                                type="text"
                                value={envName}
                                onChange={(e) => setEnvName(e.target.value)}
                                disabled={isDisabled}
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
                    {/* <p className={message.type === "success" ? "success" : "error" }>{message.text}</p> */}
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