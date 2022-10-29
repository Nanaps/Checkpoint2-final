import { Router } from "express";
import { pool } from "../utils/db.js";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  const newUsers = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    created_at: new Date(),
    last_login: new Date(),
    updated_at: new Date(),
  };
  await pool.query(
    `insert into users(username,password,firstname,lastname,created_at,last_login,updated_at)
values($1,$2,$3,$4,$5,$6,$7)`,
    [
      newUsers.username,
      newUsers.password,
      newUsers.firstname,
      newUsers.lastname,
      newUsers.created_at,
      newUsers.last_login,
      newUsers.updated_at,
    ]
  );

  return res
    .status(201)
    .json({ message: "New user has been created successfully" });
});

export default userRouter;
// userRouter.post("/", async (req, res) => {
//   await pool.query(
//     `insert into users (username, password, position, firstname, lastname, created_at, updated_at, last_logged_in) values($1,$2,$3,$4,$5,$6,$7,$8)`,
//     [
//       newUser.username,
//       newUser.password,
//       newUser.firstname,
//       newUser.lastname,
//       newUser.created_at,
//       newUser.last_login,
//       newUser.updated_at,

//     ]
//   );
// });

userRouter.get("/", async (req, res) => {
  const totalUser = await pool.query(`select * from users`);

  return res.status(201).json({
    data: totalUser.rows,
    message: "successfully",
  });
});

userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const userItem = await pool.query(`select * from users where post_id=$1`, [
    userId,
  ]);

  return res.status(201).json({
    data: userItem.rows,
    message: "successfully",
  });
});
