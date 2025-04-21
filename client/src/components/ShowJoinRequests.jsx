import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { getAllAssociationJoinRequests } from "../services/associationService";
import { Check, X } from "lucide-react";
import {
    acceptAssociationJoinRequest,
    rejectAssociationJoinRequest,
} from "../services/associationService";
import { useAcceptAssociation } from "../mutations/acceptJoinAssociation";
import { useRejectAssociation } from "../mutations/rejectJoinAssociation";

export function ShowJoinRequests() {
    const [joinRequests, setAllJoinRequests] = useState(null);

    const { mutate: acceptUser } = useAcceptAssociation();
    const { mutate: rejectUser } = useRejectAssociation();
    useEffect(() => {
        const fetchJoinAssociationRequests = async () => {
            try {
                const response = await getAllAssociationJoinRequests();
                setAllJoinRequests(response);
            } catch (err) {
                console.error("Error fetching join requests:", err);
            }
        };

        fetchJoinAssociationRequests();
    }, []);

    const handleAccept = async (userId, associationId) => {
        acceptUser({ userId: userId, associationId: associationId });
        setAllJoinRequests(
            joinRequests.filter((request) => request.user_id !== userId)
        );
    };

    const handleReject = async (userId) => {
        rejectUser(userId);
        setAllJoinRequests(
            joinRequests.filter((request) => request.user_id !== userId)
        );
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 bg-blue-600 text-white rounded">
                Requests
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {joinRequests === null ? (
                    <DropdownMenuItem>Loading...</DropdownMenuItem>
                ) : joinRequests.length === 0 ? (
                    <DropdownMenuItem>No requests</DropdownMenuItem>
                ) : (
                    joinRequests.map((request) => (
                        <DropdownMenuItem
                            key={request.id}
                            className="flex items-center gap-2"
                        >
                            {request.user_id}
                            <Button
                                onClick={() =>
                                    handleAccept(
                                        request.user_id,
                                        request.association_id
                                    )
                                }
                                className="hover:bg-green-400"
                                variant="outline"
                            >
                                <Check size={16} />
                            </Button>
                            <Button
                                onClick={() => handleReject(request.user_id)}
                                className="hover:bg-red-400"
                                variant="outline"
                            >
                                <X size={16} />
                            </Button>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ShowJoinRequests;
