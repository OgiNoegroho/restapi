const database = require('../config/mysql');

exports.getAllMahasiswa = (req, res) => {
  const sqlQuery = `SELECT * FROM Mahasiswa`;

  database.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching mahasiswa:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

exports.getMahasiswaByNIM = (req, res) => {
  const nim = req.params.nim;
  const sqlQuery = `SELECT * FROM Mahasiswa WHERE NIM = ?`;

  database.query(sqlQuery, [nim], (err, results) => {
    if (err) {
      console.error('Error fetching mahasiswa by NIM:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Mahasiswa not found' });
      }
    }
  });
};

exports.addMahasiswa = (req, res) => {
  const { nim, nama, email, jenisKelamin } = req.body;
  const sqlQuery = `INSERT INTO Mahasiswa (NIM, Nama, Email, JenisKelamin) VALUES (?, ?, ?, ?)`;

  database.query(sqlQuery, [nim, nama, email, jenisKelamin], (err, results) => {
    if (err) {
      console.error('Error inserting mahasiswa:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ success: true, message: 'Mahasiswa inserted successfully' });
    }
  });
};

exports.updateMahasiswaByNIM = (req, res) => {
  const nim = req.params.nim;
  const { nama, email, jenisKelamin } = req.body;
  const sqlQuery = `UPDATE Mahasiswa SET Nama = ?, Email = ?, JenisKelamin = ? WHERE NIM = ?`;

  database.query(sqlQuery, [nama, email, jenisKelamin, nim], (err, results) => {
    if (err) {
      console.error('Error updating mahasiswa:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.affectedRows > 0) {
        res.json({ success: true, message: 'Mahasiswa updated successfully' });
      } else {
        res.status(404).json({ error: 'Mahasiswa not found' });
      }
    }
  });
};