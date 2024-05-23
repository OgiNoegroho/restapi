const database = require('../config/mysql');

// Get all dosen names with optional exclusion
exports.getMahasiswaPDosen = (req, res) => {
  const pembimbing1NIP = req.query.pembimbing1NIP;

  let sqlQuery;
  let params = [];

  if (pembimbing1NIP) {
    sqlQuery = `SELECT NIP, Nama AS nama_dosen FROM Dosen WHERE NIP != ?;`;
    params = [pembimbing1NIP];
  } else {
    sqlQuery = `SELECT NIP, Nama AS nama_dosen FROM Dosen;`;
  }

  database.query(sqlQuery, params, (err, results) => {
    if (err) {
      console.error('Error fetching dosen list:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ dosenList: results });
    }
  });
};

// Get details of a specific mahasiswa by NIM
exports.getMahasiswaP = (req, res) => {
  const nim = req.params.nim;
  const sqlQuery = `
    SELECT 
      CURDATE() AS tanggal,
      m.Nama AS nama, 
      p.NIM AS nim, 
      m.Email AS email, 
      p.Judul_TA AS judul, 
      d1.Nama AS calonPembimbing1, 
      d2.Nama AS calonPembimbing2, 
      NULL AS berkas, 
      NULL AS catatan, 
      p.status AS status,
      p.KategoriTA AS kategoriTA
    FROM 
      Pendaftaran p
    JOIN 
      Mahasiswa m ON p.NIM = m.NIM
    JOIN 
      Dosen d1 ON p.nip_pembimbing1 = d1.NIP
    JOIN 
      Dosen d2 ON p.nip_pembimbing2 = d2.NIP
    WHERE
      p.NIM = ?;
  `;

  database.query(sqlQuery, [nim], (err, result) => {
    if (err) {
      console.error('Error fetching mahasiswa details:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ error: 'Mahasiswa not found' });
      }
    }
  });
};

// Get all mahasiswa
exports.getAllMahasiswaP = (req, res) => {
  const sqlQuery = `
    SELECT 
      ADDDATE('2024-06-15', INTERVAL 10 DAY) AS tanggal,
      m.Nama AS nama, 
      p.NIM AS nim, 
      m.Email AS email, 
      p.Judul_TA AS judul, 
      d1.Nama AS calonPembimbing1, 
      d2.Nama AS calonPembimbing2, 
      NULL AS berkas, 
      NULL AS catatan, 
      p.status AS status,
      p.KategoriTA AS kategoriTA
    FROM 
      Pendaftaran p
    JOIN 
      Mahasiswa m ON p.NIM = m.NIM
    JOIN 
      Dosen d1 ON p.nip_pembimbing1 = d1.NIP
    JOIN 
      Dosen d2 ON p.nip_pembimbing2 = d2.NIP;
  `;

  database.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching mahasiswa list:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

// Add new mahasiswa and pendaftaran
exports.addMahasiswaP = (req, res) => {
  const {
    tanggal,
    nama,
    nim,
    email,
    judul,
    calonPembimbing1,
    calonPembimbing2,
    kategoriTA
  } = req.body;

  const insertMahasiswaQuery = `
    INSERT INTO Mahasiswa (NIM, Nama, Email) VALUES (?, ?, ?);
  `;

  const insertPendaftaranQuery = `
    INSERT INTO Pendaftaran (NIM, Judul_TA, KategoriTA, nip_pembimbing1, nip_pembimbing2) VALUES (?, ?, ?, ?, ?);
  `;

  database.query(insertMahasiswaQuery, [nim, nama, email], (err, result) => {
    if (err) {
      console.error('Error adding mahasiswa:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      database.query(insertPendaftaranQuery, [nim, judul, kategoriTA, calonPembimbing1, calonPembimbing2], (err, result) => {
        if (err) {
          console.error('Error adding pendaftaran:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json({ message: 'Data added successfully' });
        }
      });
    }
  });
};

// Update the status of a specific mahasiswa by NIM
exports.updateMahasiswaPStatus = (req, res) => {
  const nim = req.params.nim;
  const { status } = req.body;

  const sqlQuery = `
    UPDATE Pendaftaran
    SET status = ?
    WHERE NIM = ?;
  `;

  database.query(sqlQuery, [status, nim], (err, result) => {
    if (err) {
      console.error('Error updating mahasiswa status:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'Mahasiswa status updated successfully' });
      } else {
        res.status(404).json({ error: 'Mahasiswa not found' });
      }
    }
  });
};
