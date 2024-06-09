const db = require('../config/mysql');

const User = {
    create: (newUser, result) => {
        db.query("INSERT INTO users SET ?", newUser, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            result(null, { id: res.insertId, ...newUser });
        });
    },

    findByEmail: (email, result) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
            if (err) {
                console.log("error: ", err);
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
            "INSERT INTO user_profiles SET user_id = ?, name = ?, nip = ?, age = ?, birthplace = ?, birthdate = ?, address = ?, gender = ?",
            [user_id, name, nip, age, birthplace, birthdate, address, gender],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                result(null, { user_id, ...profile });
            }
        );
    },

    createProfilePic: (profilePic, result) => {
        const { user_id, profile_pic } = profilePic;
        db.query(
            "INSERT INTO profile_pics SET user_id = ?, profile_pic = ?",
            [user_id, profile_pic],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                result(null, { id: res.insertId, ...profilePic });
            }
        );
    },

    findProfileByUserId: (userId, result) => {
        db.query("SELECT * FROM user_profiles WHERE user_id = ?", [userId], (err, res) => {
            if (err) {
                console.log("error: ", err);
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

    findProfilePicByUserId: (userId, result) => {
        db.query("SELECT * FROM profile_pics WHERE user_id = ?", [userId], (err, res) => {
            if (err) {
                console.log("error: ", err);
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
                    console.log("error: ", err);
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
    },

    updateProfilePicture: (userId, profile_pic, result) => {
        db.query(
            "UPDATE profile_pics SET profile_pic = ? WHERE user_id = ?",
            [profile_pic, userId],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                if (res.affectedRows == 0) {
                    result({ kind: "not_found" }, null);
                    return;
                }
                result(null, { user_id: userId, profile_pic });
            }
        );
    }
};

module.exports = User;
