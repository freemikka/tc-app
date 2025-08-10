import { useState, useEffect } from "react";
import { getAllAssociations } from "../services/associationService";
import { useJoinAssociationRequest } from "../mutations/createAssociationJoinRequest";
import { useRejectAssociation } from "../mutations/rejectJoinAssociation";

import { getAssociationJoinRequests } from "../services/associationService";
import { useAssociationJoinRequests } from "../hooks/useAssociationJoinRequests";
import { useProfile } from "../hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const JoinAssociation = () => {
    const [associationName, setAssociationName] = useState("");
    const [allAssociations, setAllAssociations] = useState([]);
    const [filteredAssociations, setFilteredAssociations] = useState([]);
    const [allJoinRequests, setAllJoinRequests] = useState({});

    const { mutate: joinAssociationRequest } = useJoinAssociationRequest();
    const { mutate: deleteJoinAssociationRequest } = useRejectAssociation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useProfile();

    const {
        data: joinRequests,
        isLoading: isJoinRequestsLoading,
        isError: isjoinRequestsError,
    } = useAssociationJoinRequests(profile?.user_id, {
        enabled: !!profile?.user_id, // only runs when user_id exists
    });

    useEffect(() => {
        const fetchAssociations = async () => {
            const getCurrAssociations = await getAllAssociations();
            setAllAssociations(getCurrAssociations);
        };
        fetchAssociations();
    }, [profile]);

    // Filter associations as user types
    const handleAssociationChange = (e) => {
        const value = e.target.value;
        setAssociationName(value);

        const filtered = allAssociations.filter((assoc) =>
            assoc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredAssociations(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        joinAssociationRequest({ name: associationName });
    };

    const selectAssociation = (name) => {
        setAssociationName(name);
        setFilteredAssociations([]);
    };

    const removeRequest = async () => {
        setAllJoinRequests(null);
        deleteJoinAssociationRequest(profile.user_id);
    };

    return (
        <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit}>
                <Label className="block relative">
                    Association name:
                    <Input
                        type="text"
                        placeholder="Search associations..."
                        value={associationName}
                        onChange={handleAssociationChange}
                        required
                        className="mt-1"
                    />
                    {/* Dropdown results */}
                    {filteredAssociations.length > 0 && associationName && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredAssociations.map((assoc) => (
                                <div
                                    key={assoc.id}
                                    className="p-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                        selectAssociation(assoc.name)
                                    }
                                >
                                    {assoc.name}
                                </div>
                            ))}
                        </div>
                    )}
                </Label>

                <Button
                    type="submit"
                    className="text-white rounded-md mt-2  
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                >
                    Join association
                </Button>
                {joinRequests?.length > 0 && (
                    <Button
                        type="button"
                        className="mx-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={removeRequest}
                    >
                        Remove request
                    </Button>
                )}
            </form>
        </div>
    );
};

export default JoinAssociation;
