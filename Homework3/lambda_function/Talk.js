const mongoose = require('mongoose');

const talk_schema = new mongoose.Schema({
    _id : String,
    title: String,
    main_author: String,
    details: String,
    urls: Array,
    next: Array
}, { collection: 'tedz_data' });

module.exports = mongoose.model('talk', talk_schema);


//watch_next_idx potrebbe essere evitato, interessa url del prossimo video