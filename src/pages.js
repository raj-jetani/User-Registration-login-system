const express = require("express");
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "D:/Registration_Login/public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error("Only jpeg, jpg, png and gif Image allow"))
        }
    }
});

const pageModel = require("../src/models/pageModel");
// const pageModel = require("../public/images");
// const customjs = require("../public/ckeditor");

const router = express();

router.use(express.static(path.join(__dirname, "../public")));
router.set("views", path.join(__dirname, "../templates/views"));
router.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

router.get("/", (req, res) => {
    pageModel.find({})
        .then((result) => {
            res.render("page-file", {
                "username": "username",
                result
            })
            // console.log(result);
        })
});

router.get("/add-page", (req, res) => {
    res.render("add-page-file", {
        "username": "username"
    });
});

router.post("/add-page", upload.single("pageImage"), (req, res) => {

    pageModel.findOne({
        pageUrl: req.body.pageUrl
    }).then((a) => {
        if (a) {
            res.send("Invalid URL...Please change the URL")
        } else {
            if (req.file) {
                pageModel.create({
                    pageUrl: req.body.pageUrl,
                    navDisplayText: req.body.navDisplayText,
                    pageTitle: req.body.pageTitle,
                    pageMetaDescription: req.body.pageMetaDescription,
                    pageMetaKeyword: req.body.pageMetaKeyword,
                    pageHeading: req.body.pageHeading,
                    pageImage: req.file.filename,
                    pageDetails: req.body.pageDetails,
                })
                    .then((x) => {
                        // req.flash("success", "Your data has been saved successfully")
                        res.redirect("/admin/page")
                    })
            }
            else {
                pageModel.create({
                    pageUrl: req.body.pageUrl,
                    navDisplayText: req.body.navDisplayText,
                    pageTitle: req.body.pageTitle,
                    pageMetaDescription: req.body.pageMetaDescription,
                    pageMetaKeyword: req.body.pageMetaKeyword,
                    pageHeading: req.body.pageHeading,
                    // pageImage: req.file.filename,
                    pageDetails: req.body.pageDetails,
                })
                    .then((x) => {
                        // req.flash("success", "Your data has been saved successfully")
                        res.redirect("/admin/page")
                    })
            }

        }
    })
});

router.get("/edit-page/:id", (req, res) => {

    pageModel.find({
        pageUrl: req.params.id
    }).then((x) => {
        res.render("edit-page-file", {
            "username": "username",
            x
        });
    }).catch((err) => {
        res.send(err);
    })
});

router.put("/edit-page/:id", upload.single("pageImage"), (req, res) => {

    if (req.file) {
        pageModel.updateOne({ pageUrl: req.params.id }, {
            $set: {
                pageUrl: req.body.pageUrl,
                navDisplayText: req.body.navDisplayText,
                pageTitle: req.body.pageTitle,
                pageMetaDescription: req.body.pageMetaDescription,
                pageMetaKeyword: req.body.pageMetaKeyword,
                pageHeading: req.body.pageHeading,
                pageImage: req.file.filename,
                pageDetails: req.body.pageDetails,
            }
        }).then((x) => {
            // req.flash("success", "Your data has been saved successfully")
            res.redirect("/admin/page")
        }).catch((err) => {
            res.send(err);
        })
    }
    else {
        pageModel.updateOne({ pageUrl: req.params.id }, {
            $set: {
                pageUrl: req.body.pageUrl,
                navDisplayText: req.body.navDisplayText,
                pageTitle: req.body.pageTitle,
                pageMetaDescription: req.body.pageMetaDescription,
                pageMetaKeyword: req.body.pageMetaKeyword,
                pageHeading: req.body.pageHeading,
                // pageImage: req.file.filename,
                pageDetails: req.body.pageDetails,
            }
        }).then((x) => {
            // req.flash("success", "Your data has been saved successfully")
            res.redirect("/admin/page")
        }).catch((err) => {
            res.send(err);
        })
    }
});

router.delete("/delete-page/:id" ,(req, res)=>{
    pageModel.deleteOne({
        pageUrl: req.params.id
    }).then((x)=>{
        res.redirect("/admin/page")
    })
})



module.exports = router;