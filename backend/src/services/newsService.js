const News = require('../models/News');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const config = require('config');

const BASE_URL = config.get('BASE_URL'); // Assuming BASE_URL is set in your config

const mongoURI = require('config').get('DB_URI');
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfsBucket;
conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, {
        bucketName: 'images'
    });
});

// Function to create news with a thumbnail
const createNews = async (title, content, author, thumbnailFile) => {
    let thumbnailId = null;

    if (thumbnailFile) {
        const thumbnailFileId = thumbnailFile.id;
        thumbnailId = mongoose.Types.ObjectId(thumbnailFileId);
    }

    const article = new News({
        title,
        content,
        author,
        thumbnail: thumbnailId
    });

    await article.save();
    const articleObject = article.toObject();

    articleObject.thumbnail = `${BASE_URL}/image/${articleObject.thumbnail}`;

    return articleObject;
};
 


// Service function to get all news articles
const getAllNews = async () => {
    const newsArticles = await News.find().populate('author', 'screenName').sort({ createdAt: -1 });

    return newsArticles.map(article => {
        if (article.thumbnail) {
            article = article.toObject();
            article.thumbnail = `${BASE_URL}/image/${article.thumbnail}`;
        }
        return article;
    });
};


// Service function to delete a news article by ID and its thumbnail
const deleteNewsById = async (newsId) => {
    const news = await News.findById(newsId);
    if (!news) {
        throw new Error('News article not found');
    }

    // Delete the thumbnail from GridFS if it exists
    if (news.thumbnail) {
        await gfsBucket.delete(mongoose.Types.ObjectId(news.thumbnail));
    }

    // Delete the news article from the database
    await News.findByIdAndDelete(newsId);

    return { message: 'News article and its thumbnail deleted successfully' };
};


module.exports = { createNews, getAllNews,deleteNewsById };
