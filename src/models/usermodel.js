const db = require('../config/mysql');

const User = {
  create: (newUser, result) => {
    db.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        console.log("Error in create:", err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newUser });
    });
  },

  findByEmail: (email, result) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
      if (err) {
        console.log("Error in findByEmail:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
  },

  createProfile: (profile, result) => {
    const { user_id, name, nip, age, birthplace, birthdate, address, gender } = profile;
    db.query(
      "INSERT INTO user_profiles SET ?",
      profile,
      (err, res) => {
        if (err) {
          console.log("Error in createProfile:", err);
          result(err, null);
          return;
        }
        result(null, { user_id, ...profile });
      }
    );
  },

  findProfileByUserId: (userId, result) => {
    db.query("SELECT * FROM user_profiles WHERE user_id = ?", [userId], (err, res) => {
      if (err) {
        console.log("Error in findProfileByUserId:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
  },

  updateProfile: (userId, profile, result) => {
    const { name, nip, age, birthplace, birthdate, address, gender } = profile;
    db.query(
      "UPDATE user_profiles SET name = ?, nip = ?, age = ?, birthplace = ?, birthdate = ?, address = ?, gender = ? WHERE user_id = ?",
      [name, nip, age, birthplace, birthdate, address, gender, userId],
      (err, res) => {
        if (err) {
          console.log("Error in updateProfile:", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        result(null, { user_id: userId, ...profile });
      }
    );
  }
};

module.exports = User;
