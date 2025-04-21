import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCreateAssociation } from "../mutations/createAssociation";
import { useJoinAssociation } from "../mutations/createJoinAssociation";
import { useQueryClient } from "@tanstack/react-query";

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
            }
        );
    };

    return (
        <div className="ml-8 mt-auto mb-auto">
            <form onSubmit={handleCreateAssociation}>
                <label className="block">
                    New association name:
                    <input
                        type="text"
                        placeholder="Association name"
                        value={associationName}
                        onChange={handleAssociationChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create association
                </button>
            </form>
        </div>
    );
};

export default CreateAssociation;
