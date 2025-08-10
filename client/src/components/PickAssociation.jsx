import JoinAssociation from "./JoinAssociation";
import CreateAssociation from "./CreateAssociation";
import React, { useEffect } from "react";
import { getProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";

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
        <div
            className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-6 mx-2"
            style={{
                background:
                    "radial-gradient(125% 125% at 50% 90%, #fff 40%, #0e671d 100%)",
            }}
        >
            <div>
                <p>
                    Welcome! Please join your own association or create a new
                    one.
                </p>
            </div>
            <div className="flex justify-center space-x-4 mx-2">
                <JoinAssociation />
                <CreateAssociation />
            </div>
            <div className="mt-4 mx-2">
                When joining an association you must wait until one of the other
                members of that association has granted you access.
            </div>
        </div>
    );
};

export default AssociationPicker;
