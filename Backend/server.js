const http = require("http");
require("dotenv").config();
const app = require("./app");
const { initializeSocket } = require("./socket");

const server = http.createServer(app);

initializeSocket(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
