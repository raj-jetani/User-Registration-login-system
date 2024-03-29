require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Register = require("./models/registerModel");
const auth = require("./middleware/auth");
const bodyParser = require("body-parser");
// const session = require("express-session");
// const flash = require("connect-flash");
const methodOverride = require("method-override");

const app = express();
require("./db/conn");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../templates/views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

const adminRoute = require("./admin");
const pagesRoute = require("./pages");

app.use("/admin",adminRoute);
app.use("/admin/page/",pagesRoute);

app.get("/", (req, res) => {
  res.render("index", {
    username: "username",
  });
});

app.get("/secret", auth, (req, res) => {
  res.render("secret");
});

app.get("/logout", auth, async (req, res) => {
  try {

    // for logout from 1 device
    req.user.tokens = req.user.tokens.filter((currElem)=>{
      return currElem.token !== req.token; 
    })

    // for logout from all device
    req.user.tokens = [];
    res.clearCookie("jwt");
    
    await req.user.save();
    
    res.render("login");

  } catch (error) {
    res.status(500).send(error)
  }
});

app.get("/register", (req, res) => {
  res.render("register", {
    username: "username",
  });
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
    if (password == cpassword) {
      const registerEmployee = new Register({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
        // confirmPassword: req.body.confirmPassword
      });

      const token = await registerEmployee.generateAuthToken();

      res.cookie("jwt", token, {
        // expires: new Date(Date.now() + 60000),
        httpOnly: true
      });

      const registerd = await registerEmployee.save();
      res.status(201).redirect("/admin");
    } else {
      res.send("Passwords are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    username: "username",
  });
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;

    const user = await Register.findOne({ email });

    const password = await bcrypt.compare(req.body.password, user.password);
    const token = await user.generateAuthToken();

    res.cookie("jwt", token, {
      // expires: new Date(Date.now() + 30000),
      httpOnly: true
      // sameSite: "none"
    });

    if (password) {
      res.status(201).redirect("/admin");;
    } else {
      res.send("Invalid email or password");
    }
  } catch (error) {
    res.send("Invalid email or password");
  }
});


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
