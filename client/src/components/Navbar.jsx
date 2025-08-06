import { useState } from "react";
import AddPlayerForm from "./AddPlayerForm";
import AddTeamForm from "./AddTeamForm";
import AddTrainingGroupForm from "./AddTrainingGroupForm";
import { signOutUser } from "../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import ExcelDownload from "../features/excelDownload"; // Uses some NodeJs library that isnt supported in the browser TODO
import ShowJoinRequests from "./ShowJoinRequests";
import { Button } from "@/components/ui/button";

function Navbar({ gender, isTraining }) {
    const [activeModal, setActiveModal] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useProfile();
    console.log("profile ", profile);
    const route =
        gender === "Male"
            ? isTraining
                ? "/heren"
                : "/traininggroep-heren"
            : isTraining
            ? "/dames"
            : "/traininggroep-dames";

    const openModal = (modalName) => setActiveModal(modalName);
    const closeModal = () => setActiveModal(null);
    const queryClient = useQueryClient();
    const handleSignOut = async () => {
        const error = await signOutUser();
        if (!error) {
            queryClient.removeQueries({ queryKey: ["authSession"] });
            navigate("/login", { replace: true });
        } else {
            console.error("Sign out failed:", error);
        }
    };

    const createExcelPrintout = (gender, isTraining) => {
        ExcelDownload(gender, isTraining);
    };

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-white font-bold text-xl">
                            {!isProfileLoading &&
                                !isProfileError &&
                                profile.Associations?.name}
                        </span>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <button
                                onClick={() => {
                                    navigate(route, {
                                        state: { from: location },
                                        replace: true,
                                    });
                                }}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {isTraining ? "Teams" : "Trainingsgroepen"}
                            </button>
                            <button
                                onClick={() =>
                                    createExcelPrintout(gender, isTraining)
                                }
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Create Excel Printout
                            </button>
                            <Button
                                variant="outline"
                                onClick={() => openModal("AddTeam")}
                            >
                                Hey 2
                            </Button>
                            <button
                                onClick={() => openModal("AddTeam")}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Add Team
                            </button>
                            <button
                                onClick={() => {
                                    openModal("addPlayer");
                                }}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Add player
                            </button>
                            <button
                                onClick={() => {
                                    openModal("addTrainingGroup");
                                }}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Add Training Group
                            </button>
                        </div>
                    </div>
                    {/* Requests */}
                    {!isProfileLoading &&
                        !isProfileError &&
                        profile.association_id && <ShowJoinRequests />}
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-600 hover:cursor-pointer px-3 py-3 text-sm rounded bg-blue-500 text-white"
                    >
                        Sign out
                    </button>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => openModal("mobile")}
                            className="text-gray-300 hover:text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (as a modal) */}
            {activeModal === "mobile" && (
                <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50">
                    <div className="fixed inset-0 flex">
                        <div className="relative w-full max-w-xs">
                            <div className="absolute top-0 right-0 -mr-14 p-1">
                                <button
                                    onClick={closeModal}
                                    className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="h-full bg-gray-800 shadow-xl py-6 px-4">
                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={() => {
                                            openModal("about");
                                        }}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        About
                                    </button>
                                    <button
                                        onClick={createExcelPrintout}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Create Excel Printout
                                    </button>
                                    <button
                                        onClick={() => {
                                            openModal("contact");
                                        }}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Contact
                                    </button>
                                    <button
                                        onClick={() => {
                                            openModal("addPlayer");
                                        }}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Add player
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Modals */}
            {activeModal && activeModal !== "mobile" && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            {activeModal === "about" &&
                                                "About Us"}
                                            {activeModal === "contact" &&
                                                "Contact Us"}
                                            {activeModal === "addPlayer" &&
                                                "Add Player"}
                                            {activeModal ===
                                                "addTrainingGroup" &&
                                                "Add Training Group"}
                                        </h3>
                                        <div className="mt-2">
                                            {activeModal === "about" && (
                                                <p className="text-gray-500">
                                                    Here's some information
                                                    about our company.
                                                </p>
                                            )}
                                            {activeModal === "AddTeam" && (
                                                <AddTeamForm />
                                            )}
                                            {activeModal === "addPlayer" && (
                                                <AddPlayerForm />
                                            )}
                                            {activeModal ===
                                                "addTrainingGroup" && (
                                                <AddTrainingGroupForm />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
