import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChartTeams } from "@/components/BarChartTeams";
import { BarChartPlayers } from "@/components/BarChartPlayers";

const AssociationView = () => {
    const navigate = useNavigate(); // For redirection

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
                <div className="mt-2">Ga naar heren of dames pagina</div>

                <Button onClick={() => navigate("/heren", { replace: true })}>
                    Heren
                </Button>
                <Button onClick={() => navigate("/dames", { replace: true })}>
                    Dames
                </Button>
            </div>
            <BarChartTeams />
            <BarChartPlayers gender="Male" />
            <BarChartPlayers gender="Female" />
        </div>
    );
};

export default AssociationView;
