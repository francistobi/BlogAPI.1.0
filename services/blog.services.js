const Blog = require('../model/blog.model'); 


const getUserBlogs = async (userId) => {
    try {
        // Find all blogs authored by the user
        const blogs = await Blog.find({ author: userId });

        return blogs
    } catch (error) {
        // Handle errors
        console.error('Error fetching user blogs:', error);
        throw error;
    }
};

module.exports = { getUserBlogs };