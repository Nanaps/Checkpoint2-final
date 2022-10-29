import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.post("/", async (req, res) => {
  const newPost = {
    user_id: req.body.user_id,
    title: req.body.title,
    content: req.body.content,
    img: req.body.img,
    video: req.body.video,
    categories: req.body.category_tag,
    created_at: new Date(),
    updated_at: new Date(),
  };

  let categoryId;
  const postCategortId = [];
  newPost.categories.map(async (item) => {
    categoryId = await pool.query(
      `select category_id from categories where name = $1`,
      [item]
    );
    if (categoryId.rows.length === 0) {
      categoryId = await pool.query(
        `insert into categories (name) values($1) returning category_id`,
        [item]
      );
      console.log("Create new category");
    }
    postCategortId.push(categoryId.rows[0].category_id);
  });

  const postId = await pool.query(
    `insert into posts (user_id,title,content,img,video,categories,created_at,updated_at)
values($1,$2,$3,$4,$5,$6,$7,$8) returning post_id`,
    [
      newPost.user_id,
      newPost.title,
      newPost.content,
      newPost.img,
      newPost.video,
      newPost.categories,
      newPost.created_at,
      newPost.updated_at,
    ]
  );
  postCategortId.map(async (category_id) => {
    await pool.query(
      `insert into category_tag (post_id,category_id) values ($1,$2)`,
      [postId.rows[0].post_id, category_id]
    );
  });

  return res.status(201).json({ message: "category was created" });
});

postRouter.get("/", async (req, res) => {
  const totalPosts = await pool.query(`select * from posts`);
  return res.status(201).json({
    data: totalPosts.rows,
    message: "successfully",
  });
});
export default postRouter;

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const postsItem = await pool.query(`select * from posts where post_id=$1`, [
    postId,
  ]);
  return res.status(201).json({
    data: postsItem.rows,
    message: "",
  });
});

postRouter.post("/:id/comments", async (req, res) => {
  const newComment = {
    user_id: req.body.user_id,
    post_id: req.body.post_id,
    content: req.body.content,
    img: req.body.img,
    video: req.body.video,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await pool.query(
    `insert into comments (user_id,post_id,content,img,video,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7)`,
    [
      newComment.user_id,
      newComment.post_id,
      newComment.content,
      newComment.img,
      newComment.video,
      newComment.created_at,
      newComment.updated_at,
    ]
  );
  return res
    .status(201)
    .json({ message: "you has been created comment sucessfully" });
});

postRouter.put("/:id", async (req, res) => {
  const postId = req.params.id;
  const updatePost = {
    user_id: req.body.user_id,
    title: req.body.title,
    content: req.body.content,
    img: req.body.img,
    video: req.body.video,
    categories: req.body.category_tag,
    updated_at: new Date(),
  };

  await pool.query(
    `update posts set user_id = $1, title = $2, content = $3 ,img = $4, video = $5 , updated_at = $6 where post_id = $7 returning *`,
    [
      updatePost.user_id,
      updatePost.title,
      updatePost.content,
      updatePost.img,
      updatePost.video,
      updatePost.updated_at,
      postId,
    ]
  );

  return res.status(201).json({
    message: "your post has been updated post sucessfully",
  });
});

postRouter.put("/:id/comments", async (req, res) => {
  const commentId = req.params.id;
  const updateComment = {
    user_id: req.body.user_id,
    post_id: req.body.post_id,
    content: req.body.content,
    img: req.body.img,
    video: req.body.video,
    updated_at: new Date(),
  };

  await pool.query(
    `update comments set user_id = $1, post_id = $2, content = $3 ,img = $4, video = $5 , updated_at = $6 where comment_id = $7 returning *`,
    [
      updateComment.user_id,
      updateComment.post_id,
      updateComment.content,
      updateComment.img,
      updateComment.video,
      updateComment.updated_at,
      commentId,
    ]
  );

  return res.status(201).json({
    message: "your comment has been updated post sucessfully",
  });
});

postRouter.delete("/:id", async (req, res) => {
  const deleteId = req.params.id;
  await pool.query(`delete from post_id where post_id = $1`, [deleteId]);

  return res.status(201).json({
    message: "you has been deleted post sucessfully",
  });
});

// //upvote and downvote
// postRouter.post("user/:id/votes", async (req, res) => {
//   const postId = req.params.id;
//   const userId = req.body.user_id;
//   const votes = req.params.votes;

//   if (votes == upvote) {
//     await pool.query(`insert into votes where user_id=$1 post_id=$2 votes=$3`, [
//       userId,
//       postId,
//       true,
//     ]);
//   }
//   else (votes == downvote) {
//     await pool.query(`insert into votes where user_id=$1 post_id=$2 votes=$3`, [
//       userId,
//       postId,
//       false,
//     ]);
//   }

//   return res.status(201).json({
//     message: "votes sucessfully",
//   });
// });
