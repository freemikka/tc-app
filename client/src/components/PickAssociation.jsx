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
        <>
            <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
                <div>
                    Hey! Please join your own association or create a new one.{" "}
                </div>
                <div className="flex justify-center space-x-4">
                    <JoinAssociation />
                    <CreateAssociation />
                </div>
                <div>
                    <br></br>
                    When joining an association you must wait until one of the
                    other members of that association has granted you access.
                </div>
            </div>
        </>
    );
};

export default AssociationPicker;
