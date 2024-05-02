import React from "react";
import "../../styles/resources.css";
import Button from 'react-bootstrap/Button';

const ResourcesList = ({ list }) => {
    const getIconUrl = (resourceType) => {
        switch (resourceType) {
            case 'articulo':
                return 'https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Farticle.png?alt=media&token=139ea2e3-df12-42e0-a5c9-283b1838e526';
            case 'video':
                return 'https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fvideo.png?alt=media&token=20c0a734-73d9-4842-90d6-b88b73a89722';
            case 'podcast':
                return 'https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fpodcast.png?alt=media&token=2cf50f74-4ad8-4706-bf34-8b07b918ccf7';
            default:
                return ''; // URL por defecto o vacío si no hay ícono
        }
    };

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('es-ES', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        }).format(dateObj);
    
        return formattedDate.toUpperCase();
    };
    

    return (
        <div className="resources">
            <ul>
                {list.map((resource, index) => (
                    <li key={index} className={resource.resource_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}>
                        <span className="icon-container" style={{backgroundImage: `url(${getIconUrl(resource.resource_type.toLowerCase())})`}}></span>
                        <div className="content-container">
                            <div className="resource-title">{resource.title}</div>
                            <div className="resource-description">{resource.description} <em className="resource-date">{formatDate(resource.created_at)}</em></div>
                            <Button variant="outline-dark" size="sm" className="resource-button rounded-pill" href={resource.url} target="_blank">Ver recurso &rarr;</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourcesList;
