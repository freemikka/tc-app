import { useMemo } from "react";
import { useTeams } from "@/hooks/useTeams";
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

const chartConfig = {
    desktop: {
        label: "gender",
        color: "blue",
    },
} satisfies ChartConfig;

export function BarChartTeams() {
    const {
        data: teams,
        isLoading: isTeamsLoading,
        isError: isTeamsError,
    } = useTeams();

    // Aggregate teams by gender
    const chartData = useMemo(() => {
        if (!teams || !Array.isArray(teams)) return [];

        // Count teams by gender
        const genderCounts = teams.reduce((acc, team) => {
            const gender = team.gender || "Unknown"; // Handle missing gender
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        // Transform to chart format
        return Object.entries(genderCounts).map(([gender, count]) => ({
            gender: gender,
            count: count,
        }));
    }, [teams]);

    if (isTeamsLoading) {
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

    if (isTeamsError || !teams) {
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
                <CardTitle>TeamChart</CardTitle>
                <CardDescription>Number of teams per gender</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="gender"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default BarChartTeams;
