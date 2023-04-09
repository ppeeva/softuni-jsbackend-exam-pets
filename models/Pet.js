const { Schema, model, Types } = require('mongoose');


const URL_PATTERN = /^https?:\/\/.+$/i;

const petSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Pet name must be at least 2 characters long']
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: (value) => { URL_PATTERN.test(value) },
            message: 'Image URL is not valid'
        }
    },
    age: {
        type: Number,
        required: true,
        min: [1, 'Age must be at least 1'],
        max: [100, 'Age must be at most 100']
    },
    description: {
        type: String,
        required: true,
        minlength: [5, 'Description must be at least 5 characters long'],
        maxlength: [50, 'Description must be at most 50 characters long']
    },
    location: {
        type: String,
        required: true,
        minlength: [5, 'Location must be at least 5 characters long'],
        maxlength: [50, 'Location must be at most 50 characters long']
    },
    commentList: {
        type: [
            {
                userId: { type: Types.ObjectId, ref: 'User' },
                comment: { type: String }
            }
        ],
    },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
});


const Pet = model('Pet', petSchema);

module.exports = Pet;