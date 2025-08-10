import { useMemo } from "react";
import { useTeamsWithPlayers } from "@/hooks/useTeamsWithPlayers";
import { usePositions } from "../hooks/usePositions";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

interface BarChartPlayersProps {
    gender: string;
}

export function BarChartPlayers({ gender }: BarChartPlayersProps) {
    const {
        data: teamsWithPlayers,
        isLoading: isTeamsWithPlayersLoading,
        isError: isTeamsWithPlayersError,
    } = useTeamsWithPlayers(gender);

    const { data: positions } = usePositions();

    const chartConfig = {
        // Create entries for each position with proper colors
        ...positions?.reduce((acc: any, position: any, index: any) => {
            acc[position.position_name] = {
                label: position.position_name,
                color: `hsl(var(--chart-${index + 1}))`,
            };
            return acc;
        }, {}),
    } satisfies ChartConfig;

    console.log("positions", positions);

    const chartData = useMemo(() => {
        // Create a template with all positions set to 0
        const positionTemplate =
            positions?.reduce((acc: Record<string, number>, position: any) => {
                acc[position.position_name] = 0;
                return acc;
            }, {}) || {};

        const positionCountsByTeam = teamsWithPlayers?.map((team) => {
            const teamPositionCount = team.players.reduce(
                (acc: Record<string, number>, player) => {
                    const positionName = player.position?.positionName;
                    if (positionName) {
                        acc[positionName] = (acc[positionName] || 0) + 1;
                    }
                    return acc;
                },
                { ...positionTemplate } // Start with all positions at 0
            );

            return {
                teamId: team.id,
                teamName: team.name,
                ...teamPositionCount,
            };
        });
        console.log("positionCountsByTeam", positionCountsByTeam);

        return positionCountsByTeam;
    }, [teamsWithPlayers, positions]);

    if (isTeamsWithPlayersLoading) {
        return (
            <Card className="mt-2">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-64">
                        Loading...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isTeamsWithPlayersError || !teamsWithPlayers) {
        return (
            <Card className="mt-2">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-64 text-red-500">
                        Error loading teams data
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>PlayerChart</CardTitle>
                <CardDescription>Players per team</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="teamName"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        {positions &&
                            positions.map((position: any) => {
                                return (
                                    <Bar
                                        key={position.id}
                                        dataKey={position.position_name}
                                        stackId="positions"
                                        fill={position.position_color}
                                        radius={8}
                                    />
                                );
                            })}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default BarChartPlayers;
