const mongoose = require('mongoose');

// Role schema definition
const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Role', RoleSchema);
