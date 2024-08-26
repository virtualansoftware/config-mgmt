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
    const [subMenu, setSubMenu] = useState(null);
    const [firstSubMenu, setFirstSubMenu] = useState(null);
    const [secondSubMenu, setSecondSubMenu] = useState(null);
    const [thirdSubMenu, setThirdSubMenu] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
    const [subMenuData, setSubMenuData] = useState<MenuItem>({});

    const updateBreadcrumbs = (newCrumb: string) => {
        setBreadcrumbs(prevBreadcrumbs => {
            if (prevBreadcrumbs.includes(newCrumb)) {
                return prevBreadcrumbs.slice(0, prevBreadcrumbs.indexOf(newCrumb) + 1);
            }
            return [...prevBreadcrumbs, newCrumb];
        });
    };

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
        updateBreadcrumbs(sublistTitle);
        setThirdSubMenu(null);
    };

    const toggleThirdSubMenu = (link: string, e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        updateBreadcrumbs(link);
        const [application_name, env_name, configuration_file_name] = link.split('/');
        onRetrieve(application_name, env_name, configuration_file_name);
        setThirdSubMenu(link);
    };

    const toggleGenerateList = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setSubMenu(null);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null);
    };
    
    const toggleUploadList = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setSubMenu(null);
        setFirstSubMenu(null);
        setSecondSubMenu(null);
        setThirdSubMenu(null);
    };
    

    async function buildMenu() {
        try {
            const response = await axios.get(API_GET_ENDPOINT_ALL);
            setSubMenuData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        buildMenu();
    }, []);

    return (
        <div className="sidebar">
            <ul className="col-md-12">
                {/* Main Menu */}
                <li onClick={(e) => toggleSubMenu("Config")}>
                    <i className={`fa-solid ${subMenu === "Config" ? "fa-caret-down" : "fa-caret-right"}`}></i> Config
                    {/* First Sub Menu */}
                    {subMenu === "Config" && (
                        <ul className="sublist">
                            {Object.keys(subMenuData).map((key) => (
                                <li key={key} onClick={(e) => toggleFirstSubMenu(key, e)}>
                                    <i className={`fa-solid ${firstSubMenu === key ? "fa-caret-down" : "fa-caret-right"}`}></i> {key}
                                    {/* Second Sub Menu */}
                                    {firstSubMenu === key && (
                                        <ul className="sublist">
                                            {Object.entries(subMenuData[key]).map(([env_name, links], index) => (
                                                <li key={env_name}>
                                                    <Link to={{ pathname: links[1], search: `?env_name=${env_name}` }}
                                                        onClick={(e) => toggleSecondSubMenu(index, env_name, e)}>
                                                        <i className={`fa-solid ${secondSubMenu === index ? "fa-caret-down" : "fa-caret-right"}`}></i> {env_name}
                                                    </Link>
                                                    {/* Third Sub Menu */}
                                                    {secondSubMenu === index && (
                                                        <ul>
                                                            {links.map((link, linkIndex) => (
                                                                <li key={linkIndex} onClick={(e) => toggleThirdSubMenu(link, e)}>
                                                                    <Link to={{ pathname: "/keyvalue", search: `?env_name=${env_name}&application_name=${key}&configuration_file_name=${link.split(".")[0]}` }}>{link}</Link>
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
                        </ul>
                    )}
                </li>
                {/* Generate List */}
                <li className="generateList" onClick={toggleGenerateList}>
                    <Link to={"/generate-config"} onClick={(e) => e.stopPropagation()}>Generate Config</Link>
                </li>
                {/* Upload List */}
                <li className="uploadList" onClick={toggleUploadList}>
                    <Link to={"/upload-template"} onClick={(e) => e.stopPropagation()}>Upload Template</Link>
                </li>
            </ul>
        </div>
    );
}