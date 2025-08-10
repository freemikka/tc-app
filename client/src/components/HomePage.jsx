import { useLocation } from "react-router-dom";
import AssociationView from "./AssociationView";
const HomePage = () => {
    const location = useLocation();

    return (
        <div
            style={{
                background:
                    "radial-gradient(125% 125% at 50% 90%, #fff 40%, #0e671d 100%)",
            }}
        >
            {/* <button onClick={handleClick}>click me</button> */}
            {<AssociationView />}
        </div>
    );
};

export default HomePage;
