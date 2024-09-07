const tagService = require('../services/tagService');

// Controller function to get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to insert a new tag
const insertTag = async (req, res) => {
    try {
        const { name, category, type } = req.body;
        const tag = await tagService.insertTag(name, category, type);
        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllTags, insertTag };
