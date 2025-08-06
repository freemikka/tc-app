import JoinAssociation from "./JoinAssociation";
import CreateAssociation from "./CreateAssociation";
import React, { useEffect } from "react";
import { getProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const AssociationPicker = () => {
    // Load associations on component mount
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                if (response.association_id) {
                    navigate("/");
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <Navbar />
            <div className=" w-[800px] grid grid-flow-col auto-cols-[minmax(300px,_300px)] ml-auto mr-auto h-screen justify-center">
                <JoinAssociation />
                <CreateAssociation />
            </div>
        </div>
    );
};

export default AssociationPicker;
