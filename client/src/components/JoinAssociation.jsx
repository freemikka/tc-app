import React, { useState, useEffect } from "react";
import { getAllAssociations } from "../services/associationService";
import { useJoinAssociationRequest } from "../mutations/createAssociationJoinRequest";

const JoinAssociation = () => {
    const [associationName, setAssociationName] = useState("");
    const [allAssociations, setAllAssociations] = useState([]);
    const [filteredAssociations, setFilteredAssociations] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);

    const { mutate: joinAssociationRequest } = useJoinAssociationRequest();

    useEffect(() => {
        const fetchAssociations = async () => {
            try {
                const data = await getAllAssociations();
                if (data) {
                    setAllAssociations(data);
                    setFilteredAssociations(data); // Initially show all
                }
            } catch (err) {
                console.error("Error fetching associations:", err);
            }
        };

        fetchAssociations();
    }, []); //

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
    return (
        <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit}>
                <label className="block">
                    Association name:
                    <input
                        type="text"
                        placeholder="Search associations..."
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
                    Join association
                </button>
            </form>

            {filteredAssociations.length > 0 && associationName && (
                <div>
                    <h3 className="font-medium">Matching Associations:</h3>
                    <ul className="space-y-1">
                        {filteredAssociations.map((assoc) => (
                            <li key={assoc.id} className="p-2 hover:bg-gray-50">
                                {assoc.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default JoinAssociation;
