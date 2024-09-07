const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Tag = require('./src/models/Tag'); // Adjust the path as needed
const config = require('config');

const mongoURI = config.get('DB_URI');

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    // const filePath = path.join(__dirname, 'available_topics.json');
    const filePath = path.join(__dirname, './available_topics.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    console.log(data);
    const topics = JSON.parse(data);


    const mandatoryFields = ['SubjectArea', 'Branch', 'Topic', 'Subtopic','Concept'];
    const optionalFields = ['DifficultyLevel', 'Interactivity', 'ResourceType'];

    for (const topic of topics) {
        let parentTagId = null;

        for (const field of mandatoryFields) {
            const tagName = field;
            const tagValue = topic[field];

            let tag = await Tag.findOne({ name: tagValue, category: tagName });

            if (!tag) {
                tag = new Tag({
                    name: tagValue,
                    category: tagName,
                    type: 'mandatory',
                    parent: parentTagId
                });
                await tag.save();
            }

            parentTagId = tag._id;
        }

        for (const field of optionalFields) {
            const tagName = field;
            const tagValue = topic[field];

            let tag = await Tag.findOne({ name: tagValue, category: tagName });

            if (!tag) {
                tag = new Tag({
                    name: tagValue,
                    category: tagName,
                    type: 'optional',
                    parent: null
                });
                await tag.save();
            }
        }
    }

    console.log('Tags imported successfully');
    mongoose.connection.close();
});
