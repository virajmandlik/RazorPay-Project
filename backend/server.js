require("dotenv").config({
    path: './.env'
});
const { app } = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        const server = require('http').createServer(app);
        const { initSocket } = require('./socket');
        initSocket(server);

        server.listen(PORT, () => {
            console.log(`⚙️  Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
