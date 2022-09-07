/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

const app = require("./controller/app");

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
