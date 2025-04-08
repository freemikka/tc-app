import React from "react";
import DragAndDropTeams from "./DragAndDropTeams";
import Navbar from "./Navbar";

const DragAndDropHome = ({ gender }) => {
    return (
        <div>
            <Navbar />
            {/* Padding to account for fixed navbar */}
            <DragAndDropTeams gender={gender} />
        </div>
    );
};

export default DragAndDropHome;
