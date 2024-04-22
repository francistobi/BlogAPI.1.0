const express = require("express");
const blogRouter = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getDraftBlog,
  getBlogs,
  createBlog,
  getByAuthor,
  getByTitle,
  getByTags,
  show_oneblog,
  editForm,
  get_editForm,
  deleteBlog,
  sortBlog,
  show_create,
  getUserBlogsHandler,
  show_myBlog,
  publishedBlog,
} = require("../controllers/blog.controller");

//:todo =It should also be searchable by author, title and tags.
// blogRouter.get("/", getAllBlog);
blogRouter.get("/", sortBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/author", getByAuthor);
blogRouter.get("/title", getByTitle);
blogRouter.get("/tag", getByTags);
blogRouter.get("/sort", sortBlog);
blogRouter.post("/new", authenticateToken, createBlog);
blogRouter.get("/n", authenticateToken, show_create);
blogRouter.get("/:id/drafts", authenticateToken, getDraftBlog);// returns draft in json format
blogRouter.get("/:id/myblogs", authenticateToken, show_myBlog);//shows draft blogs
blogRouter.get("/:id", show_oneblog);
blogRouter.get("/:userId/me", authenticateToken, getUserBlogsHandler);//gets all my blog both draft and published
blogRouter.put("/edit/:id", authenticateToken, editForm)
blogRouter.put("/publish/:id", authenticateToken, publishedBlog);//publish the blog
blogRouter.get("/edit/:id", authenticateToken, get_editForm)
blogRouter.delete("/:id", authenticateToken, deleteBlog)

module.exports = blogRouter;
