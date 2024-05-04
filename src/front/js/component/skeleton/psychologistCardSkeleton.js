import React from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

/* MY MOOD STYLES */
import "../../../styles/psychologist_card.css";

/* REACT-BOOSTRAP */
import Card from 'react-bootstrap/Card';

const PsychologistCardSkeleton = ( ) => {


    return (
        <>    
            <Card className="ps-card " >
                <Card.Header className="bg-white">
                    <Skeleton circle={true} height={100} width={100} />
                </Card.Header>
                <Card.Body>
                    <Card.Title></Card.Title>
                    <Card.Text> <Skeleton count={3} /> 
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white"><button className="btn btn-dark rounded-pill">Ver perfil &rarr;</button></Card.Footer>
            </Card>
        </>
    );
};

export default PsychologistCardSkeleton;
