import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCreateAssociation } from "../mutations/createAssociation";
import { useJoinAssociation } from "../mutations/createJoinAssociation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CreateAssociation = () => {
    const [associationName, setAssociationName] = useState("");

    const { mutate: mutateAssociation } = useCreateAssociation();
    const { mutate: joinAssociation } = useJoinAssociation();
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const handleAssociationChange = (e) => {
        const value = e.target.value;
        setAssociationName(value);
    };

    const handleCreateAssociation = (e) => {
        e.preventDefault();
        mutateAssociation(
            { name: associationName },
            {
                onSuccess: () => {
                    joinAssociation({ name: associationName });
                    queryClient.invalidateQueries(["profile"]);
                    navigate(0, { replace: true });
                },
                onError: () => {
                    toast.error("Something went wrong");
                },
            }
        );
    };

    return (
        <div className="ml-8 mt-auto mb-auto">
            <form onSubmit={handleCreateAssociation}>
                <Label className="block">
                    New association name:
                    <Input
                        type="text"
                        placeholder="Association name"
                        value={associationName}
                        onChange={handleAssociationChange}
                        required
                        className="mt-1 block"
                    />
                </Label>
                <Button type="submit" className="mt-2">
                    Create association
                </Button>
            </form>
        </div>
    );
};

export default CreateAssociation;
