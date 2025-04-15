import { getTeamsWithPlayers } from "../services/teamService";
import { getTrainingGroupsWithPlayers } from "../services/trainingGroupService";
import { TeamWithPlayers } from "../types/types";
import { Player } from "../types/types";
import * as XLSX from "xlsx-js-style";

const ExcelDownload = async (isTraining: any) => {
    const workbook = XLSX.utils.book_new();
    try {
        if (!isTraining) {
            const maleTeams = await getTeamsWithPlayers("Male");
            const femaleTeams = await getTeamsWithPlayers("Female");
            handleTeamsData(maleTeams, workbook, "Heren teams");
            handleTeamsData(femaleTeams, workbook, "Dames teams");
        } else {
            const maleTeams = await getTrainingGroupsWithPlayers("Male");
            const femaleTeams = await getTrainingGroupsWithPlayers("Female");
            handleTeamsData(
                maleTeams as TeamWithPlayers[],
                workbook,
                "Heren teams"
            );
            handleTeamsData(
                femaleTeams as TeamWithPlayers[],
                workbook,
                "Dames teams"
            );
        }
        // Write the workbook to a file
        XLSX.writeFile(workbook, "vertical_teams.xlsx");
    } catch (err) {
        console.log(err);
    }
};

const handleTeamsData = (
    teams: TeamWithPlayers[],
    workbook: XLSX.WorkBook,
    wsName: string
) => {
    const sortFn = (a: Player, b: Player) => {
        if (a.position.positionId !== b.position.positionId)
            return a.position.positionId - b.position.positionId;
        else return a.firstName.localeCompare(b.firstName);
    };
    // Sort players groups alphabetically and by id
    const sortedTeams = teams.map((team) => ({
        ...team, // spread all other properties (id, name, gender, etc.)
        players: [...team.players].sort(sortFn), // sorted players
    }));

    const maxPlayers = Math.max(...teams.map((team) => team.players.length));

    // Create a 2D array where the first row is the team names (headers)
    const worksheetData: any[][] = [];

    // Split teams into chunks of 3 to limit each row to 3 teams
    const chunkedTeams = chunkArray(sortedTeams, 3);

    // const worksheetData: (string[])[] = [];
    const positionMap: Record<string, string> = {}; // key: cell address, value: player.position

    chunkedTeams.forEach((chunk, rowIndex) => {
        const headerRow = chunk.map((team) => team.name);
        worksheetData.push(headerRow);
        // const headerRowAddress = `${worksheetData.length}${XLSX.utils.encode_col(colIndex)}`

        for (let i = 0; i < maxPlayers; i++) {
            const playerRow = chunk.map((team, colIndex) => {
                const player = team.players[i];
                const fullName = player
                    ? `${player.firstName} ${player.lastName}`
                    : "";

                if (player) {
                    // Calculate actual Excel row index
                    const excelRow = worksheetData.length + 1; // +1 because Excel rows are 1-indexed
                    const excelCol = XLSX.utils.encode_col(colIndex); // e.g., 0 => "A", 1 => "B"
                    const cellAddress = `${excelCol}${excelRow}`;

                    // Store the player's position at this cell
                    positionMap[cellAddress] = player.position.positionColor;
                }

                return fullName;
            });

            worksheetData.push(playerRow);
        }

        if (rowIndex < chunkedTeams.length - 1) {
            worksheetData.push([]); // blank row between chunks
        }
    });

    // Create a worksheet and apply styles
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Example styling function
    const getStyleForPosition = (positionColor: string) => {
        const whiteBoldFont = {
            name: "Arial",
            sz: 12,
            color: { rgb: "FFFFFF" }, // white font
        };
        const baseStyle = {
            font: whiteBoldFont,
            fill: {
                patternType: "solid",
                fgColor: { rgb: "" },
            },
            border: {}, // No borders at all
        };

        const styleMap = {
            ...baseStyle,
            fill: { fgColor: { rgb: positionColor.slice(1) } }, // Remove the "#"
        };

        return styleMap;
    };

    // Apply styles using the positionMap
    Object.keys(positionMap).forEach((cellAddress) => {
        if (!worksheet[cellAddress]) return;

        const position = positionMap[cellAddress];
        const style = getStyleForPosition(position);
        worksheet[cellAddress].s = style;
    });

    // Create a workbook and append the sheet
    worksheet["!cols"] = Array(3).fill({ wch: 30 });

    XLSX.utils.book_append_sheet(workbook, worksheet, wsName);
};

// Helper function to chunk the teams into smaller arrays
const chunkArray = (array: any[], size: number) => {
    const chunked: any[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};

export default ExcelDownload;
