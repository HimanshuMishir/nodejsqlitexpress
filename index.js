import express from "express";
const app = express();
import md5 from "md5";
import config from "./config.js";

import users from "./src/routes/users.js";

app.use(express.json());

app.use("/", users);

// Default response for any other request

app.use(function (req, res) {
  res.status(404).json({ message: "Url Not found!" });
});

app.listen(config.HTTP_PORT, () => {
  console.log(
    "Server running on port %PORT%".replace("%PORT%", config.HTTP_PORT)
  );
});
