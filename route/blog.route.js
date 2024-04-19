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
  show_blog
  //   sortBlog,
} = require("../controllers/blog.controller");

//:todo =It should also be searchable by author, title and tags.
// blogRouter.get("/", getAllBlog);
// blogRouter.get("/", sortBlog);
blogRouter.get("/", show_blog);
blogRouter.post("/new", authenticateToken, createBlog);
blogRouter.get("/drafts", authenticateToken, getDraftBlog);
blogRouter.get("/author", authenticateToken, getByAuthor);
blogRouter.get("/title", authenticateToken, getByTitle);
blogRouter.get("/tag", authenticateToken, getByTags);
blogRouter.get("/:id", show_oneblog);
blogRouter.put("/edit/:id", authenticateToken, editForm);
blogRouter.get("/edit/:id", authenticateToken, get_editForm);
blogRouter.delete("/:id", authenticateToken, deleteBlog);

module.exports = blogRouter;
