const Blog = require("../model/blog.model");
const { getUserBlogs } = require("../services/blog.services");
const UserModel = require("../model/user.model");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../error/custom-error");
const { query } = require("express");

const AVERAGE_WORDS_PER_MINUTE = 215;

const getDraftBlog = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;
  const user = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const totalBlogs = await Blog.countDocuments();
  const totalPages = Math.ceil(totalBlogs / limit);
  const draftBlog = await Blog.find({ state: "draft", author: userId })
    .skip((page - 1) * limit)
    .limit(limit);
  if (!draftBlog) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`no draft blog`, error.status));
  }
  if (user !== userId) {
    const error = new Error();
    error.status = 401;
    return next(
      createCustomError(
        `You do not have permission to get others draft blog.`,
        error.status
      )
    );
  }
  res.status(200).json({
    draftBlog,
    currentPage: page,
    totalPages: totalPages,
    totalBlogs: totalBlogs,
  });
});

const getBlogs = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const totalBlogs = await Blog.countDocuments();
  const totalPages = Math.ceil(totalBlogs / limit);
  const publishedBlog = await Blog.find({ state: "Published" })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!publishedBlog) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`No published blogs`, error.status));
  }
 res.render("published", { articles: publishedBlog });
//  res.status(200).json({
//    publishedBlog,
//    page,
//    totalBlogs,
//    totalPages,
//  });
});

const createBlog = asyncWrapper(async (req, res) => {
  const { title, description, body, tags } = req.body;
  const user = req.user.id;

  const read_time = Math.ceil(body.length / AVERAGE_WORDS_PER_MINUTE);
  const author = await UserModel.findOne({ _id: user });
  const Author = author._id;
  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }
  const newBlog = await Blog.create({
    title,
    description,
    body,
    tags,
    state: "draft",
    reading_time: read_time,
    author: Author,
  });

  res.status(201).json({ message: "Blog created successfully!", newBlog });
});

const show_oneblog = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  blog.read_count += 1; // Increment the read_count by 1
  await blog.save();
  res.render("oneArticle", { article: blog });
});

const show_create = asyncWrapper(async (req, res, next) => {
  res.render("newArticle");
});

const getByAuthor = asyncWrapper(async (req, res, next) => {
  const author = req.query.author;
  const blogs = await Blog.find({ author });
  if (!blogs) {
    const error = new Error();
    error.status = 400;
    return next(
      createCustomError(
        `blog with from this author dosen't exist`,
        error.status
      )
    );
  }
  res.status(200).json({ blogs });
});

const getByTitle = asyncWrapper(async (req, res, next) => {
  const title = req.query.title;
  const blogs = await Blog.find({ title });
  if (!blogs) {
    const error = new Error();
    error.status = 400;
    return next(
      createCustomError(`blog with from this title dosen't exist`, error.status)
    );
  }
  res.status(200).json({ blogs });
});

const getByTags = asyncWrapper(async (req, res, next) => {
  const tag = req.query.tag;
  const blogs = await Blog.find({ tags: tag });
  if (!blogs) {
    const error = new Error();
    error.status = 404;
    return next(
      createCustomError(`Blogs with this tag don't exist`, error.status)
    );
  }
  res.status(200).json({ blogs });
});

const editForm = asyncWrapper(async (req, res) => {
  const user = req.user.id;
  const id = req.params.id;
  const read_count = read_count + 1;
  const { title, description, body, tags } = req.body;
  const blog = await Blog.findByIdAndUpdate(id, {
    title,
    state: "Published",
    description,
    body,
    tags,
    timestamp: new Date(),
    read_count: read_count,
  });

  if (user !== id) {
    const error = new Error();
    error.status = 401;
    return next(
      createCustomError(
        `You do not have permission to edit  this blog.`,
        error.status
      )
    );
  }
  res.redirect(`/api/v1/blog/edit/${blog.id}`);
});

const get_editForm = asyncWrapper(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("edit", { article: blog });
});

const deleteBlog = asyncWrapper(async (req, res) => {
  const user = req.user.id;
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.redirect(`/api/v1/blog/${user}/me`);
});

const getUserBlogsHandler = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const user = req.user.id;
  const blogs = await getUserBlogs(userId);
  blogs.read_count + 1;

  if (!blogs) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`no blog`, error.status));
  }
  if (user !== userId) {
    const error = new Error();
    error.status = 401;
    return next(
      createCustomError(
        `You do not have permission to view this blog.`,
        error.status
      )
    );
  }
  if (!blogs || blogs.length === 0) {
    const error = new Error();
    error.status = 404;
    return next(createCustomError(`No blog found`, error.status));
  }
  res.render("mybooks", { articles: blogs });
});

const show_myBlog = asyncWrapper(async (req, res) => {
  const user = req.user.id;
  const draftBlog = await Blog.find({ state: "draft", author: user });
  if (!draftBlog) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`no draft blog`, error.status));
  }
  res.render("mybooks", { articles: draftBlog });
});

const sortBlog = asyncWrapper(async (req, res, next) => {
  let query = Blog.find();

  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    if (
      sortBy === "read_count" ||
      sortBy === "reading_time" ||
      sortBy === "timestamp"
    ) {
      query = query.sort({ [sortBy]: 1 });
    } else if (
      sortBy === "-read_count" ||
      sortBy === "-reading_time" ||
      sortBy === "-timestamp"
    ) {
      query = query.sort({ [sortBy.slice(1)]: -1 });
    }
  }
  const blogs = await query;

  res.status(200).json({ blogs });
});

const publishedBlog = asyncWrapper(async (req, res, next) => {
  const blogid = req.params.id;
  const published = await Blog.findByIdAndUpdate(blogid, {
    state: "Published",
  });
  if (!published) {
    const error = new Error();
    error.status = 404;
    return next(createCustomError(`blog not found`, error.status));
  }
  res.status(200).json({ message: "Blog published successfully", published });
});

module.exports = {
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
  show_create,
  getUserBlogsHandler,
  show_myBlog,
  sortBlog,
  publishedBlog,
};
