const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/profile_pics')); // Adjusted path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('profile_pic');

exports.register = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ success: false, message: "Error uploading profile picture." });
    } else if (err) {
      return res.status(500).json({ success: false, message: "Unknown error uploading profile picture." });
    }

    const { email, password, name, nip, age, birthplace, birthdate, address, gender } = req.body;
    const profile_pic = req.file ? `/uploads/profile_pics/${req.file.filename}` : null;

    User.findByEmail(email, (err, existingUser) => {
      if (err && err.kind !== "not_found") {
        console.error("Error checking email:", err);
        return res.status(500).send({ success: false, message: "Error checking email." });
      }

      if (existingUser) {
        return res.status(400).send({ success: false, message: "Email already exists!" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send({ success: false, message: "Error hashing password." });
        }

        const newUser = {
          email: email,
          password: hashedPassword
        };

        User.create(newUser, (err, userData) => {
          if (err) {
            console.error("Error registering user:", err);
            return res.status(500).send({ success: false, message: "Error registering user." });
          }

          const newProfile = {
            user_id: userData.id,
            name,
            nip,
            age,
            birthplace,
            birthdate,
            address,
            gender
          };

          User.createProfile(newProfile, (err, profileData) => {
            if (err) {
              console.error("Error creating profile:", err);
              return res.status(500).send({ success: false, message: "Error creating profile." });
            }

            const newProfilePic = {
              user_id: userData.id,
              profile_pic
            };

            User.createProfilePic(newProfilePic, (err, profilePicData) => {
              if (err) {
                console.error("Error creating profile picture:", err);
                return res.status(500).send({ success: false, message: "Error creating profile picture." });
              }

              res.status(201).send({
                success: true,
                message: "User registered successfully!",
                user: userData,
                profile: profileData,
                profilePic: profilePicData
              });
            });
          });
        });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).send({ success: false, message: "Error finding user." });
    }

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send({ success: false, message: "Error comparing passwords." });
      }

      if (!result) {
        return res.status(401).send({ success: false, message: "Invalid Password!" });
      }

      const tokenPayload = {
        id: user.id,
        email: user.email
      };

      const tokenOptions = {
        expiresIn: 86400 // 24 hours
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, tokenOptions);

      res.status(200).send({
        success: true,
        message: "Login successfully",
        id: user.id,
        email: user.email,
        token: token
      });
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.userId;

  User.findProfileByUserId(userId, (err, profile) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).send({ success: false, message: "Error fetching profile." });
    }

    if (!profile) {
      return res.status(404).send({ success: false, message: "Profile not found." });
    }

    User.findProfilePicByUserId(userId, (err, profilePic) => {
      if (err) {
        console.error("Error fetching profile picture:", err);
        return res.status(500).send({ success: false, message: "Error fetching profile picture." });
      }

      res.status(200).send({
        ...profile,
        profile_pic: profilePic ? profilePic.profile_pic : null
      });
    });
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, nip, age, birthplace, birthdate, address, gender } = req.body;

  const updatedProfile = {
    name,
    nip,
    age,
    birthplace,
    birthdate,
    address,
    gender
  };

  User.updateProfile(userId, updatedProfile, (err, profileData) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).send({ success: false, message: "Error updating profile." });
    }

    if (!profileData) {
      return res.status(404).send({ success: false, message: "Profile not found." });
    }

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      profile: profileData
    });
  });
};

exports.updateProfilePicture = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ success: false, message: "Error uploading profile picture." });
    } else if (err) {
      return res.status(500).json({ success: false, message: "Unknown error uploading profile picture." });
    }

    const userId = req.userId;
    const profile_pic = req.file ? `/uploads/profile_pics/${req.file.filename}` : null;

    if (!profile_pic) {
      return res.status(400).json({ success: false, message: "No profile picture provided." });
    }

    User.updateProfilePicture(userId, profile_pic, (err, profilePicData) => {
      if (err) {
        console.error("Error updating profile picture:", err);
        return res.status(500).send({ success: false, message: "Error updating profile picture." });
      }

      if (!profilePicData) {
        return res.status(404).send({ success: false, message: "Profile picture not found." });
      }

      res.status(200).send({
        success: true,
        message: "Profile picture updated successfully",
        profilePic: profilePicData
      });
    });
  });
};

exports.protectedRoute = (req, res) => {
  res.status(200).send({
    message: "Access granted",
    userId: req.userId,
    email: req.email
  });
};
