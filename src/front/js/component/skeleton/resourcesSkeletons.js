import React from "react";

import "../../../styles/profile.css";

/* MY MOOD COMPONENTS */
import ResourcesListSkeletons from "./resourcesListSkeletons";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'


/* REACT-BOSTRAP */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



export const ResourcesSkeletons = () => {

    return (
        <>
            <Row className="mb-2 justify-content-center">
                <Col xs={11} md={6} lg={10}>
                    <h1 className="heading1">Recursos</h1>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col xs={12} md={12} lg={12}>
                    <h4 className="border-bottom border-dark mb-3">¡No te pierdas lo último!</h4>
                </Col>
            </Row>

            <Row>
                <Col className="resources">
                    <ResourcesListSkeletons count={2} />
                </Col>
                <Col className="resources">
                    <ResourcesListSkeletons count={2} />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col xs={12} md={12} lg={12}>
                    <h4 className="border-bottom border-dark mb-4">Todos nuestros recursos</h4>
                </Col>
            </Row>

            <Row>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={1}
                    onSelect={1}
                    className="align-items-center justify-content-center "
                >
                    <Tab key={1} eventKey={1} title={<Skeleton />}>
                        <ResourcesListSkeletons count={5} />
                    </Tab>
                    <Tab key={2} eventKey={2} title={<Skeleton />}>
                        <ResourcesListSkeletons count={5} />
                    </Tab>
                    <Tab key={3} eventKey={3} title={<Skeleton />}>
                        <ResourcesListSkeletons count={5} />
                    </Tab>
                </Tabs>
            </Row>
        </>
    );
};

export default ResourcesSkeletons;