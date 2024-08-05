const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

/*Configure multer for file upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profile/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original file name
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    console.log("Uploaded file details :", req.file);
    console.log("Request body :", req.body);
    const { username, email, password } = req.body;

    //uploaded file available as req.file
    const profileImage = req.file;

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    //path to uploaded profile
    const profileImagePath = req.file.path;

    //check if user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exist!!" });
    }

    //hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    //save new user
    await newUser.save();

    //send successful message
    res.status(200).json({ message: "Registered successfully", user: newUser });
  } catch (err) {
    console.log("Error during registration:", err);
    res
      .status(500)
      .json({ message: "Registration failed!!", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    /* Take the infomation from the form */
    const { email, password } = req.body;

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Not found User data!" });
    }

    /* Compare the password with the hashed password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
