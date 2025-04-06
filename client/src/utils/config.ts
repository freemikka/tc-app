require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI =
    process.env.NODE_ENV === "dev"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;
const BASEURL = process.env.DEV_API_BASE_URL;

module.exports = {
    MONGODB_URI,
    PORT,
    BASEURL,
};
