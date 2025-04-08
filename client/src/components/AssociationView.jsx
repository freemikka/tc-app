import React from "react";
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";

import { useNavigate } from "react-router-dom";

const AssociationView = () => {
    const navigate = useNavigate(); // For redirection

    return (
        <div>
            <div>
                <div>Ga naar heren of dames pagina</div>

                <button
                    className="
                            rounded-lg
                            bg-white
                            border-t border-r border-b border-black
                            px-4 py-2
                            cursor-pointer
                            hover:bg-gray-100
                            transition-colors
                        "
                    onClick={() => navigate("/heren", { replace: true })}
                >
                    Heren
                </button>
                <button
                    className="
                            rounded-lg
                            bg-white
                            border-t border-r border-b border-black
                            px-4 py-2
                            cursor-pointer
                            hover:bg-gray-100
                            transition-colors
                        "
                    onClick={() => navigate("/dames", { replace: true })}
                >
                    Dames
                </button>
            </div>
        </div>
    );
};

export default AssociationView;
