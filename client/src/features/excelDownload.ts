import { getTeamsWithPlayers } from "../services/teamService";
import { TeamWithPlayers } from "../types/types";
import * as XLSX from "xlsx-js-style";

const ExcelDownload = async () => {
    try {
        const maleTeams = await getTeamsWithPlayers("Male");
        const femaleTeams = await getTeamsWithPlayers("Female");
        handleTeamsData(maleTeams);
        // handleTeamsData(femaleTeams);
    } catch (err) {
        console.log(err);
    }
};

const handleTeamsData = (teams: TeamWithPlayers[]) => {
    console.log(teams);
    const maxPlayers = Math.max(...teams.map((team) => team.players.length));

    // Create a 2D array where the first row is the team names (headers)
    const worksheetData: any[][] = [];

    // Split teams into chunks of 3 to limit each row to 3 teams
    const chunkedTeams = chunkArray(teams, 3);

    // Create header rows for each chunk of teams
    chunkedTeams.forEach((chunk, rowIndex) => {
        const row = chunk.map((team) => team.name);
        worksheetData.push(row);

        // Fill rows with player names per team
        for (let i = 0; i < maxPlayers; i++) {
            const playerRow = chunk.map((team) => {
                const player = team.players[i];
                return player ? `${player.firstName} ${player.lastName}` : "";
            });
            worksheetData.push(playerRow);
        }

        // Add a blank row between chunks if needed
        if (rowIndex < chunkedTeams.length - 1) {
            worksheetData.push([]);
        }
    });

    console.log("worksheetData", worksheetData);

    // Create a worksheet and apply styles
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Style the headers (team names)
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } }, // Blue background for headers
        alignment: { horizontal: "center", vertical: "center" },
    };

    // Apply header styles for each header cell dynamically
    for (let row = 0; row < worksheetData.length; row++) {
        for (let col = 0; col < worksheetData[row].length; col++) {
            const cellAddress = { r: row, c: col };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            console.log("cellAddress", cellAddress);
            console.log("cellRef", cellRef);

            // Apply styles only to header row (first row)
            if (row === 0) {
                worksheet[cellRef].s = headerStyle;
            }
        }
    }

    // Create a workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "vertical_teams.xlsx");
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
