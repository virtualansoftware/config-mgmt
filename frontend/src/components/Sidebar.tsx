import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { API_GET_ENDPOINT_CONFIG_ALL, API_GET_ENDPOINT_GENERATE_ALL, API_GET_ENDPOINT_UPLOAD_ALL, API_GET_ENDPOINT_COMMON_ALL } from "../constants";

interface SidebarProps {
    onRetrieve: (application_name: string, env_name: string, configuration_file_name: string) => void;
}

interface MenuItem {
    [key: string]: {
        [env_name: string]: string[];
    };
}

interface UploadMenuItem {
    [key: string]: string[];
}

export default function Sidebar({ onRetrieve }: SidebarProps) {
    const [loading, setLoading] = useState(false);
    const [subMenu, setSubMenu] = useState(null);
    const [firstSubMenu, setFirstSubMenu] = useState(null);
    const [secondSubMenu, setSecondSubMenu] = useState(null);
    const [thirdSubMenu, setThirdSubMenu] = useState(null);
    const [subMenuDataConfig, setSubMenuDataConfig] = useState<MenuItem>({});
    const [subMenuDataGenerate, setSubMenuDataGenerate] = useState<MenuItem>({});
    const [subMenuDataUpload, setSubMenuDataUpload] = useState<UploadMenuItem>({});
    const [subMenuDataCommon, setSubMenuDataCommon] = useState<UploadMenuItem>({});
    const [subMenuDataHarness, setSubMenuDataHarness] = useState(null);

    const toggleSubMenu = (item: string) => {
        setSubMenu(subMenu === item ? null : item);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null); 
        setSubMenuDataHarness(null);

        if (item === "Config") {
            buildConfigMenu();
        } else if (item === "Generate") {
            buildGenerateMenu();
        } else if (item === "Upload") {
            buildUploadMenu();
        } else if (item === "Common") {
            buildCommonMenu();
        } else if (item === "Harness") {
            setSubMenuDataHarness(subMenuDataHarness === null ? "Harness" : null);
        }
    };

    const toggleFirstSubMenu = (item: string, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setFirstSubMenu(firstSubMenu === item ? null : item);
        setSecondSubMenu(null);
        setThirdSubMenu(null);
    };

    const toggleSecondSubMenu = (index: number, sublistTitle: string, e: React.MouseEvent<HTMLAnchorElement | HTMLLIElement>) => {
        e.stopPropagation();
        setSecondSubMenu(secondSubMenu === index ? null : index);
        setThirdSubMenu(null);
    };

    const toggleThirdSubMenu = (link: string, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        const [application_name, env_name, configuration_file_name] = link.split('/');
        onRetrieve(application_name, env_name, configuration_file_name);
        setThirdSubMenu(link);
    };
    
    // GET METHOD - GET ALL CONFIG
    async function buildConfigMenu() {
        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_CONFIG_ALL);
            setSubMenuDataConfig(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET METHOD - GET ALL GENERATE
    async function buildGenerateMenu() {
        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_GENERATE_ALL);
            setSubMenuDataGenerate(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET METHOD - GET ALL UPLOAD
    async function buildUploadMenu() {
        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_UPLOAD_ALL);
            setSubMenuDataUpload(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET METHOD - GET ALL COMMON
    async function buildCommonMenu() {
        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_COMMON_ALL);
            setSubMenuDataCommon(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <>
            <div className="sidebar">
                <ul className="col-md-12">
                    {/* Config Menu */}
                    <li onClick={(e) => toggleSubMenu("Config")}>
                        <Link to="/config">
                            <i className={`fa-solid ${subMenu === "Config" ? "fa-caret-down" : "fa-caret-right"}`}></i> Config
                        </Link>
                        {/* First Sub Menu */}
                        {subMenu === "Config" && (
                            <ul className="sublist">
                                {loading ? (
                                    <img className="sidebarSpinner" src='/images/spinner.svg' alt='spinner'/>
                                ) : (
                                    <>
                                        {Object.keys(subMenuDataConfig).map((key) => (
                                            <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                                <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                                {/* Second Sub Menu */}
                                                {firstSubMenu === key && (
                                                    <ul className="sublist">
                                                        {Object.entries(subMenuDataConfig[key]).map(([env_name, links], index) => (
                                                            <li key={env_name} onClick={(e) => toggleSecondSubMenu(index, env_name, e)}>
                                                                <i className={`fa-solid ${secondSubMenu === index ? "fa-caret-down" : "fa-caret-right"}`}></i> {env_name}
                                                                {/* Third Sub Menu */}
                                                                {secondSubMenu === index && (
                                                                    <ul className="lastlist">
                                                                        {links.map((link, linkIndex) => (
                                                                            <li key={linkIndex} onClick={(e) => toggleThirdSubMenu(link, e)} className={thirdSubMenu === link ? "selected" : ""}>
                                                                                <Link to={{ pathname: "/config", search: `?env_name=${env_name}&application_name=${key}&configuration_file_name=${link.replace(/\.json$/, "")}` }}>{link}</Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                    {/* Generate Menu */}
                    <li onClick={(e) => toggleSubMenu("Generate")}>
                        <Link to="/generate-config">
                            <i className={`fa-solid ${subMenu === "Generate" ? "fa-caret-down" : "fa-caret-right"}`}></i> Generate Config
                        </Link>
                        {/* First Sub Menu */}
                        {subMenu === "Generate" && (
                            <ul className="sublist">
                                {loading ? (
                                    <img className="sidebarSpinner" src='/images/spinner.svg' alt='spinner'/>
                                ) : (
                                    <>
                                        {Object.keys(subMenuDataGenerate).map((key) => (
                                            <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                                <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                                {/* Second Sub Menu */}
                                                {firstSubMenu === key && (
                                                    <ul className="sublist">
                                                        {Object.entries(subMenuDataGenerate[key]).map(([env_name, links], index) => (
                                                            <li key={env_name} onClick={(e) => toggleSecondSubMenu(index, env_name, e)}>
                                                                <i className={`fa-solid ${secondSubMenu === index ? "fa-caret-down" : "fa-caret-right"}`}></i> {env_name}
                                                                {/* Third Sub Menu */}
                                                                {secondSubMenu === index && (
                                                                    <ul className="lastlist">
                                                                        {links.map((link, linkIndex) => (
                                                                            <li key={linkIndex} onClick={(e) => toggleThirdSubMenu(link, e)} className={thirdSubMenu === link ? "selected" : ""}>
                                                                                <Link to={{ pathname: "/generate-config", search: `?env_name=${env_name}&application_name=${key}&configuration_file_name=${link.replace(/\.json$/, "")}` }}>{link}</Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                    {/* Upload Menu */}
                    <li onClick={(e) => toggleSubMenu("Upload")}>
                        <Link to="/upload-template">
                            <i className={`fa-solid ${subMenu === "Upload" ? "fa-caret-down" : "fa-caret-right"}`}></i> Upload Template
                        </Link>
                        {/* First Sub Menu */}
                        {subMenu === "Upload" && (
                            <ul className="sublist">
                                {loading ? (
                                    <img className="sidebarSpinner" src='/images/spinner.svg' alt='spinner'/>
                                ) : (
                                    <>
                                        {Object.keys(subMenuDataUpload).map((key) => (
                                            <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                                <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                                {/* Second Sub Menu */}
                                                {firstSubMenu === key && (
                                                    <ul className="sublist">
                                                        {subMenuDataUpload[key].map((configFile, index) => (
                                                            <li key={index} onClick={(e) => toggleThirdSubMenu(configFile, e)} className={thirdSubMenu === configFile ? "selected" : ""}>
                                                                <Link to={{ pathname: "/upload-template", search: `?application_name=${key}&configuration_file_name=${configFile.replace(/\.tpl$/, "")}` }}>{configFile}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                    {/* Common Menu */}
                    <li onClick={(e) => toggleSubMenu("Common")}>
                        <Link to="/common-config">
                            <i className={`fa-solid ${subMenu === "Common" ? "fa-caret-down" : "fa-caret-right"}`}></i> Common Files
                        </Link>
                        {/* First Sub Menu */}
                        {subMenu === "Common" && (
                            <ul className="sublist">
                                {loading ? (
                                    <img className="sidebarSpinner" src='/images/spinner.svg' alt='spinner'/>
                                ) : (
                                    <>
                                        {Object.keys(subMenuDataCommon).map((key) => (
                                            <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                                <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                                {/* Second Sub Menu */}
                                                {firstSubMenu === key && (
                                                    <ul className="sublist">
                                                        {subMenuDataCommon[key].map((commonFile, index) => (
                                                            <li key={index} onClick={(e) => toggleThirdSubMenu(commonFile, e)} className={thirdSubMenu === commonFile ? "selected" : ""}>
                                                                <Link to={{ pathname: "/common-config", search: `?env_name=${key}&configuration_file_name=${commonFile.replace(/\.json$/, "")}` }}>{commonFile}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
}