const newsService = require('../services/newsService');


// Controller function to create news with a thumbnail
const createNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const author = req.user.id;
        const thumbnailFile = req.file;

        const news = await newsService.createNews(title, content, author, thumbnailFile);
        res.status(201).json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Controller function to get all news articles
const getAllNews = async (req, res) => {
    try {
        const news = await newsService.getAllNews();
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching news articles' });
    }
};


// Controller function to delete a news article by ID
const deleteNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const result = await newsService.deleteNewsById(newsId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { createNews, getAllNews, deleteNewsById };
