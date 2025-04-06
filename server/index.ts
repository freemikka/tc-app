// import { Player, Team } from "./types/types";

// require("dotenv").config();
import "dotenv/config";
import express from "express";
import cors from "cors";
import playersRouter from "./routes/players.routes.ts";
import associationsRouter from "./routes/associations.routes.ts";
import profilesRouter from "./routes/profiles.routes.ts";
import positionsRouter from "./routes/positions.routes.ts";
import teamsRouter from "./routes/teams.routes.ts";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api", playersRouter);
app.use("/api", associationsRouter);
app.use("/api", profilesRouter);
app.use("/api", positionsRouter);
app.use("/api", teamsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
