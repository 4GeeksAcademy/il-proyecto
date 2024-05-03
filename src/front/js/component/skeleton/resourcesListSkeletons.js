import React from "react";
import "../../../styles/resources.css";
import Button from 'react-bootstrap/Button';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'



const ResourcesListSkeletons = () => {
    return (
        <div className="resources">
            <ul>
                <li>
                    <span className="icon-container"><Skeleton height={35} /></span>
                    <div className="content-container">
                        <div className="resource-title"><Skeleton height={35} /></div>
                        <div className="resource-description"><Skeleton count={3} /> </div>
                        <Button variant="outline-dark" size="sm" className="resource-button rounded-pill">Ver recurso &rarr;</Button>
                    </div>
                </li>
                <li>
                    <span className="icon-container"><Skeleton height={35} /></span>
                    <div className="content-container">
                        <div className="resource-title"><Skeleton height={35} /></div>
                        <div className="resource-description"><Skeleton count={3} /> </div>
                        <Button variant="outline-dark" size="sm" className="resource-button rounded-pill">Ver recurso &rarr;</Button>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ResourcesListSkeletons;
