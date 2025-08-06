import React, { useState, useEffect } from "react";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import AssociationView from "./AssociationView";
const HomePage = () => {
    const location = useLocation();

    return (
        <div>
            {/* <button onClick={handleClick}>click me</button> */}
            {<AssociationView />}
        </div>
    );
};

export default HomePage;
