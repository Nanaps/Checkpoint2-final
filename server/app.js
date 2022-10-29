import express from "express";
import bodyParser from "body-parser";
import userRouter from "./apps/users.js";
import postRouter from "./apps/posts.js";

const app = express();
const PORT = 4000;
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/posts", postRouter);
app.listen(PORT, () => {
  console.log(`Server start at Port ${PORT}`);
});
