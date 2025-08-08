import { useState, useEffect } from "react";
import { getAllAssociations } from "../services/associationService";
import { useJoinAssociationRequest } from "../mutations/createAssociationJoinRequest";

const JoinAssociation = () => {
    const [associationName, setAssociationName] = useState("");
    const [allAssociations, setAllAssociations] = useState([]);
    const [filteredAssociations, setFilteredAssociations] = useState([]);

    const { mutate: joinAssociationRequest } = useJoinAssociationRequest();

    useEffect(() => {
        const fetchAssociations = async () => {
            const getCurrAssociations = await getAllAssociations();
            setAllAssociations(getCurrAssociations);
        };
        fetchAssociations();
    }, []);

    // Filter associations as user types
    const handleAssociationChange = (e) => {
        const value = e.target.value;
        setAssociationName(value);

        const filtered = allAssociations.filter((assoc) =>
            assoc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredAssociations(filtered);
        console.log(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        joinAssociationRequest({ name: associationName });
    };

    const selectAssociation = (name) => {
        setAssociationName(name);
        setFilteredAssociations([]);
    };
    return (
        <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit}>
                <label className="block relative">
                    Association name:
                    <input
                        type="text"
                        placeholder="Search associations..."
                        value={associationName}
                        onChange={handleAssociationChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                </label>

                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Join association
                </button>
            </form>
        </div>
    );
};

export default JoinAssociation;
