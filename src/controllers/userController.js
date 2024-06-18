const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

exports.register = async (req, res) => {
  try {
    const { email, password, name, nip, age, birthplace, birthdate, address, gender } = req.body;

    // Check if the email already exists
    const existingUser = await new Promise((resolve, reject) => {
      User.findByEmail(email, (err, user) => {
        if (err && err.kind !== "not_found") return reject(err);
        resolve(user);
      });
    });

    if (existingUser) {
      return res.status(400).send({ success: false, message: "Email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword
    };

    // Create new user
    const userData = await new Promise((resolve, reject) => {
      User.create(newUser, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

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

    // Create new profile
    const profileData = await new Promise((resolve, reject) => {
      User.createProfile(newProfile, (err, profile) => {
        if (err) return reject(err);
        resolve(profile);
      });
    });

    res.status(201).send({
      success: true,
      message: "User registered successfully!",
      user: userData,
      profile: profileData
    });

  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).send({ success: false, message: "Error registering user.", error: err.message });
  }
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

    res.status(200).send(profile);
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

exports.protectedRoute = (req, res) => {
  res.status(200).send({
    message: "Access granted",
    userId: req.userId,
    email: req.email
  });
};
