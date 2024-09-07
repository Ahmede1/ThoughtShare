const Tag = require('../models/Tag');


 

const getAllTags = async () => {
    const tags = await Tag.find();
    const groupedTags = tags.reduce((acc, tag) => {
        if (!acc[tag.category]) {
            acc[tag.category] = [];
        }
        acc[tag.category].push({ id: tag._id, name: tag.name, parent: tag.parent });
        return acc;
    }, {});

    return groupedTags;
};

// Service function to insert a new tag
const insertTag = async (name, category, type) => {
    const tag = new Tag({
        name,
        category,
        type
    });
    return await tag.save();
};

module.exports = { getAllTags, insertTag };
