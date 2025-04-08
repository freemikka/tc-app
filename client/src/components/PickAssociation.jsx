import { useState, useEffect } from "react";
// import { supabase } from "../utils/supabase"; // Adjust import path
import { getAllAssociations } from "../services/associationService";
import { createProfile } from "../services/profileService";

const AssociationPicker = () => {
    const [associationName, setAssociationName] = useState("");
    const [allAssociations, setAllAssociations] = useState([]);
    const [filteredAssociations, setFilteredAssociations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load associations on component mount
    useEffect(() => {
        const fetchAssociations = async () => {
            try {
                const data = await getAllAssociations();
                if (error) throw error;
                if (data) {
                    setAllAssociations(data);
                    setFilteredAssociations(data); // Initially show all
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching associations:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssociations();
    }, []); // Empty dependency array = runs once on mount

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
        console.log(associationName);
        const result = await createProfile(associationName);
        if (result.success) {
            alert(`Joined association successfully!`);
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    if (isLoading) return <div>Loading associations...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4">
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
                    Submit
                </button>
            </form>

            {/* Optional: Display filtered associations */}
            {filteredAssociations.length > 0 && associationName && (
                <div className="mt-4">
                    <h3 className="font-medium">Matching Associations:</h3>
                    <ul className="mt-2 space-y-1">
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

export default AssociationPicker;
