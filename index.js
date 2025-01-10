const app = require("./server");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
