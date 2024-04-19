const Blog = require("../model/blog.model");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../error/custom-error");

// const getAllBlog = asyncWrapper(async (req, res) => {
//   const blogs = await Blog.find({});
//   res.status(200).json({ blogs });
// });

const getDraftBlog = asyncWrapper(async (req, res, next) => {
  const draftBlog = await Blog.find({ state: "draft" });
  if (!draftBlog) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`no draft blog`, error.status));
  }
  res.status(200).json({ draftBlog });
});

const getBlogs = asyncWrapper(async (req, res, next) => {
  const publishedBlog = await Blog.find({ state: "published" });
  if (!publishedBlog) {
    const error = new Error();
    error.status = 400;
    return next(createCustomError(`no published blogs`, error.status));
  }
  res.status(200).json({ publishedBlog });
});

const createBlog = asyncWrapper(async (req, res) => {
  req.body.state = "draft";
  const newBlog = await Blog.create(req.body);
  res.status(201).json({ newBlog });
});

const publishBlog = asyncWrapper(async (req, res) => {
  const blogName = req.query.name;
  const blogToPublish = await Blog.findone({ name: blogName });
});


const show_oneblog = async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render("oneArticle", { article: blog })
};



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
  if (!blogs || blogs.length === 0) {
    const error = new Error();
    error.status = 404;
    return next(
      createCustomError(`Blogs with this tag don't exist`, error.status)
    );
  }
  res.status(200).json({ blogs });
});

const editForm = asyncWrapper(async (req, res) => {
  const { title, description, body, tags } = req.body;
  const blog = await Blog.findByIdAndUpdate(req.params.id, {
    title,
    state: "Published",
    description,
    body,
    tags,
    timestamp: new Date(),
    read_count: 1,
  });
  res.redirect(`/api/v1/blog/edit/${blog.id}`);
})

const get_editForm = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("edit", { article: blog });
};

const deleteBlog =  asyncWrapper(async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.redirect("/api/v1/blog/")
})

const show_blog = asyncWrapper(async (req, res) => {
  const blog = await Blog.find({ state: "published" });
  res.render("articles", { articles: blog })
})
// const sortBlog= asyncWrapper(async (req, res, next) => {
//   let query = Blog.find();

//   if (req.query.sortBy) {
//     const sortBy = req.query.sortBy;
//     if (sortBy === "read_count" || sortBy === "reading_time" || sortBy === "timestamp") {
//       query = query.sort({ [sortBy]: 1 });
//     } else if (sortBy === "-read_count" || sortBy === "-reading_time" || sortBy === "-timestamp") {
//       query = query.sort({ [sortBy.slice(1)]: -1 });
//     }
//   }
//   const blogs = await query;

//   res.status(200).json({ blogs });
// });

module.exports = {
  getDraftBlog,
  getBlogs,
  createBlog,
  publishBlog,
  getByAuthor,
  getByTitle,
  getByTags,
  show_oneblog,
  editForm,
  get_editForm,
  deleteBlog,
  show_blog,
};
