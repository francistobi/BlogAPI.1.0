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
  show_blog,
  show_create,
  getUserBlogsHandler,
  show_myBlog,
  //   sortBlog,
} = require("../controllers/blog.controller");

//:todo =It should also be searchable by author, title and tags.
// blogRouter.get("/", getAllBlog);
// blogRouter.get("/", sortBlog);
blogRouter.get("/", getBlogs);
blogRouter.post("/new", authenticateToken, createBlog);
blogRouter.get("/n", authenticateToken, show_create);
blogRouter.get("/:id/drafts", authenticateToken, getDraftBlog);
blogRouter.get("/:id/myblogs", authenticateToken, show_myBlog);
blogRouter.get("/author", authenticateToken, getByAuthor);
blogRouter.get("/title", authenticateToken, getByTitle);
blogRouter.get("/tag", authenticateToken, getByTags)
blogRouter.get("/:id", show_oneblog)
blogRouter.get("/:userId/me", authenticateToken, getUserBlogsHandler);
blogRouter.put("/edit/:id", authenticateToken, editForm);
blogRouter.get("/edit/:id", authenticateToken, get_editForm);
blogRouter.delete("/:blogid/:id", authenticateToken, deleteBlog);

module.exports = blogRouter;
