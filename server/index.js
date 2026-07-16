const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {

    console.log(

        `Server running on http://localhost:${PORT}`

    );

});