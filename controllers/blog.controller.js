const Blog = require("../model/blog.model");
const { getUserBlogs } = require("../services/blog.services");
const UserModel = require("../model/user.model");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../error/custom-error");


const AVERAGE_WORDS_PER_MINUTE = 215;

// const getAllBlog = asyncWrapper(async (req, res) => {
//   const blogs = await Blog.find({});
//   res.status(200).json({ blogs });
// });

const getDraftBlog = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;
  // const user = user.id
  const draftBlog = await Blog.find({ state: "draft", author: userId});
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
  res.json({publishedBlog})
  // res.render("published", { article: publishedBlog });
});

const createBlog = asyncWrapper(async (req, res) => {
  const read_time = Math.ceil(req.body.body.length / AVERAGE_WORDS_PER_MINUTE);
  req.body.state = "draft";
  req.body.reading_time = read_time;
  const newBlog = await Blog.create(req.body);
  res.status(201).json({ newBlog });
});

const publishBlog = asyncWrapper(async (req, res) => {
  const id = req.query.id;
  const blogToPublish = await Blog.findone({id});


});

const show_oneblog = async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("oneArticle", { article: blog });
};

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
  const user = req.user; 
  console.log(user)
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
  const user = req.user.id;
  const id = req.params.id;
  const read_count = read_count + 1 
  const { title, description, body, tags } = req.body;
  const blog = await Blog.findByIdAndUpdate(req.params.id, {
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

const get_editForm = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("edit", { article: blog });
};

const deleteBlog = asyncWrapper(async (req, res) => {
  const user = req.user.id;
  const id = req.params.id;
     if (user !== id) {
       const error = new Error();
       error.status = 401;
       return next(
         createCustomError(
           `You do not have permission to delete this blog.`,
           error.status
         )
       );
     }
  await Blog.findByIdAndDelete(id);
  res.redirect("/api/v1/blog/");
});

const show_blog = asyncWrapper(async (req, res) => {
  const blog = await Blog.find({ state: "published" });
  res.render("articles", { articles: blog });
})

const getUserBlogsHandler = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId; // Assuming userId is passed in the request params
  const user = req.user.id;
  const blogs = await getUserBlogs(userId);
  blogs.read_count + 1;

   if (user !== userId ) {
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
  // res.json(blogs);
  res.render("mybooks", { articles: blogs });
});

const show_myBlog = async(req,res)=>{
  const userId = req.params.id;
    const draftBlog = await Blog.find({ state: "draft", author: userId });
    if (!draftBlog) {
      const error = new Error();
      error.status = 400;
      return next(createCustomError(`no draft blog`, error.status));
    }
    res.status(200).json({ draftBlog });
  // res.render("mybooks", { articles: draftBlog });
}

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
  show_create,
  getUserBlogsHandler,
  show_myBlog,
};
