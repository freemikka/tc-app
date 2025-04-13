import { getTeamsWithPlayers } from "../services/teamService";
import { TeamWithPlayers } from "../types/types";
import { Player } from "../types/types";
import * as XLSX from "xlsx-js-style";

const ExcelDownload = async () => {
    const workbook = XLSX.utils.book_new();
    try {
        const maleTeams = await getTeamsWithPlayers("Male");
        const femaleTeams = await getTeamsWithPlayers("Female");
        handleTeamsData(maleTeams, workbook, "Heren teams");
        handleTeamsData(femaleTeams, workbook, "Dames teams");
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
        if (a.position !== b.position) return a.position - b.position;
        else return a.firstName.localeCompare(b.firstName);
    };
    // Sort players groups alphabetically and by id
    console.log(teams);
    const sortedTeams = teams.map((team) => ({
        ...team, // spread all other properties (id, name, gender, etc.)
        players: [...team.players].sort(sortFn), // sorted players
    }));

    console.log(sortedTeams);
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
                    positionMap[cellAddress] = player.position;
                }

                return fullName;
            });

            worksheetData.push(playerRow);
        }

        if (rowIndex < chunkedTeams.length - 1) {
            worksheetData.push([]); // blank row between chunks
        }
    });

    console.log("worksheetData", worksheetData);

    // Create a worksheet and apply styles
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // // Style the headers (team names)
    // const headerStyle = {
    //     font: { bold: true, color: { rgb: "FFFFFF" } },
    //     fill: { fgColor: { rgb: "4F81BD" } }, // Blue background for headers
    //     alignment: { horizontal: "center", vertical: "center" },
    // };

    // Example styling function
    const getStyleForPosition = (position: string) => {
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

        const positionId = Number(position) - 3;

        const styleMap = [
            { ...baseStyle, fill: { fgColor: { rgb: "ff0000" } } }, // Setter
            { ...baseStyle, fill: { fgColor: { rgb: "02c923" } } }, // Middle
            { ...baseStyle, fill: { fgColor: { rgb: "a69b06" } } }, // Outside
            { ...baseStyle, fill: { fgColor: { rgb: "0008f0" } } }, // Diagonal
            { ...baseStyle, fill: { fgColor: { rgb: "dc179a" } } }, // Libero
        ];

        return styleMap[positionId];
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
