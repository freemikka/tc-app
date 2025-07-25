import React, { useState, useEffect } from "react";
import { getProfile } from "../services/profileService";
import PickAssociation from "../components/PickAssociation";
import { Navigate, useNavigate } from "react-router-dom";

import AssociationView from "./AssociationView";

const HomePage = () => {
    return (
        <div>
            {/* <button onClick={handleClick}>click me</button> */}
            <div>{<AssociationView />}</div>
        </div>
    );
};

export default HomePage;
