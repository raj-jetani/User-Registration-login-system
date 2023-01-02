const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    pageUrl: String,
    navDisplayText: String,
    pageTitle: String,
    pageMetaDescription: String,
    pageMetaKeyword: String,
    pageHeading: String,
    pageImage: String,
    pageDetails: String,
});

const pageModel = mongoose.model("pagesTable", pageSchema);

module.exports = pageModel