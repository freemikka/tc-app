import { useState } from "react";
import { useCreateTrainingGroup } from "../mutations/createTrainingGroup";

const AddTrainingGroupForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        gender: "Male",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTrainingGroup({ name: formData.name, gender: formData.gender });
    };

    const { mutate: createTrainingGroup } = useCreateTrainingGroup();

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 max-w-md mx-auto bg-white rounded shadow"
        >
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                >
                    Gender
                </label>
                <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Submit
            </button>
        </form>
    );
};

export default AddTrainingGroupForm;
