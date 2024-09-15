import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { API_GET_ENDPOINT_ALL } from "../constants";

interface SidebarProps {
    onRetrieve: (application_name: string, env_name: string, configuration_file_name: string) => void;
}

interface MenuItem {
    [key: string]: {
        [env_name: string]: string[];
    };
}

export default function Sidebar({ onRetrieve }: SidebarProps) {
    const [loading, setLoading] = useState(false);
    const [subMenu, setSubMenu] = useState(null);
    const [firstSubMenu, setFirstSubMenu] = useState(null);
    const [secondSubMenu, setSecondSubMenu] = useState(null);
    const [thirdSubMenu, setThirdSubMenu] = useState(null);
    const [subMenuData, setSubMenuData] = useState<MenuItem>({});
    // const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

    // const updateBreadcrumbs = (newCrumb: string) => {
    //     setBreadcrumbs(prevBreadcrumbs => {
    //         if (prevBreadcrumbs.includes(newCrumb)) {
    //             return prevBreadcrumbs.slice(0, prevBreadcrumbs.indexOf(newCrumb) + 1);
    //         }
    //         return [...prevBreadcrumbs, newCrumb];
    //     });
    // };

    // const handleBreadcrumbClick = (index: number) => {
    //     setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    //     if (index === 0) {
    //         setThirdSubMenu(null);
    //     }
    // }

    const toggleSubMenu = (item: string) => {
        setSubMenu(subMenu === item ? null : item);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null); 
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
        // updateBreadcrumbs(sublistTitle);
        setThirdSubMenu(null);
    };

    const toggleThirdSubMenu = (link: string, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        // updateBreadcrumbs(link);
        const [application_name, env_name, configuration_file_name] = link.split('/');
        onRetrieve(application_name, env_name, configuration_file_name);
        setThirdSubMenu(link);
    };

    const toggleGenerateList = () => {
        setSubMenu(null);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null);
    };
    
    const toggleUploadList = () => {
        setSubMenu(null);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null);
    };
    
    // GET METHOD
    async function buildMenu() {
        try {
            setLoading(true);
            const response = await axios.get(API_GET_ENDPOINT_ALL);
            setSubMenuData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        buildMenu();
    }, []);

    return (
        <div className="sidebar">
            {/* <div className="breadcrumbs">
                <ul>
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index}>
                            {index < breadcrumbs.length - 1 ? (
                                <Link to="#" onClick={() => handleBreadcrumbClick(index)}>{crumb}</Link>
                            ) : (
                                <span>{crumb}</span>
                            )}
                            {index < breadcrumbs.length - 1 && " > "}
                        </li>
                    ))}
                </ul>
            </div> */}
            <ul className="col-md-12">
                {/* Main Menu */}
                <li onClick={(e) => toggleSubMenu("Config")}>
                    <Link to={"/config"}>
                        <i className={`fa-solid ${subMenu === "Config" ? "fa-caret-down" : "fa-caret-right"}`}></i> Config
                    </Link>
                    {/* First Sub Menu */}
                    {subMenu === "Config" && (
                        <ul className="sublist">
                            {loading ? (
                                <img className="sidebarSpinner" src='/images/spinner.svg' alt='spinner'/>
                            ) : (
                                <>
                                    {Object.keys(subMenuData).map((key) => (
                                        <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                            <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                            {/* Second Sub Menu */}
                                            {firstSubMenu === key && (
                                                <ul className="sublist">
                                                    {Object.entries(subMenuData[key]).map(([env_name, links], index) => (
                                                        <li key={env_name} onClick={(e) => toggleSecondSubMenu(index, env_name, e)}>
                                                            <i className={`fa-solid ${secondSubMenu === index ? "fa-caret-down" : "fa-caret-right"}`}></i> {env_name}
                                                            {/* Third Sub Menu */}
                                                            {secondSubMenu === index && (
                                                                <ul className="lastlist">
                                                                    {links.map((link, linkIndex) => (
                                                                        <li key={linkIndex} onClick={(e) => toggleThirdSubMenu(link, e)} className={thirdSubMenu === link ? "selected" : ""}>
                                                                            {/* <Link to={{ pathname: "/config", search: `?env_name=${env_name}&application_name=${key}&configuration_file_name=${link.split(".")[0]}` }}>{link}</Link> */}
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
                {/* Generate List */}
                <li className="generateList">
                    <Link to={"/generate-config"} onClick={toggleGenerateList}>Generate Config</Link>
                </li>
                {/* Upload List */}
                <li className="uploadList">
                    <Link to={"/upload-template"} onClick={toggleUploadList}>Upload Template</Link>
                </li>
            </ul>
        </div>
    );
}