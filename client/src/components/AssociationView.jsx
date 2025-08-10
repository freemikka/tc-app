import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChartTeams } from "@/components/BarChartTeams";
import { BarChartPlayers } from "@/components/BarChartPlayers";

const AssociationView = () => {
    const navigate = useNavigate(); // For redirection

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Option 3: Side-by-side layout */}
            <div className="grid grid-cols-2 gap-3 mt-8 ml-2">
                <Button
                    size="lg"
                    onClick={() => navigate("/heren", { replace: true })}
                    className="h-16 flex-col gap-1"
                >
                    <span className="font-semibold">Gents</span>
                    <span className="text-xs opacity-80">
                        Go to men's Teams
                    </span>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/dames", { replace: true })}
                    className="h-16 flex-col gap-1"
                >
                    <span className="font-semibold">Women</span>
                    <span className="text-xs opacity-80">
                        Go to women's Teams
                    </span>
                </Button>
            </div>
            <BarChartTeams />
            <BarChartPlayers gender="Male" />
            <BarChartPlayers gender="Female" />
        </div>
    );
};

export default AssociationView;
