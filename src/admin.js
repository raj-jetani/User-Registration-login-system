const express = require("express");
const path = require("path");
const hbs = require("hbs");

const router = express();

router.use(express.static(path.join(__dirname, "../public")));
router.set("views", path.join(__dirname, "../templates/views"));
router.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

router.get("/",(req, res)=>{
    res.render("admin-file",{
        "username": "username"
    });
})

module.exports = router;