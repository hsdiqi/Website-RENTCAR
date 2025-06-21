const App = require("./src/App");
// const { port } = require("./env");
require('dotenv').config();
port = process.env.PORT;

App.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
