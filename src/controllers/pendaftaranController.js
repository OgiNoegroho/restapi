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
exports.addPendaftaran = (req, res) => {
  const {
    id_pendaftaran, NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1,
    nip_pembimbing2, nip_penguji1, nip_penguji2, status
  } = req.body;

  // Query untuk memeriksa apakah mahasiswa dengan NIM yang diberikan sudah ada
  const checkMahasiswaQuery = `SELECT * FROM Mahasiswa WHERE NIM = ?`;

  // Melakukan query untuk memeriksa keberadaan mahasiswa
  database.query(checkMahasiswaQuery, [NIM], (err, results) => {
    if (err) {
      console.error('Error checking mahasiswa:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Jika mahasiswa tidak ditemukan, kembalikan respons dengan pesan error
    if (results.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa not found' });
    }

    // Jika mahasiswa ditemukan, lanjutkan dengan menambahkan pendaftaran
    database.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Query untuk menambahkan pendaftaran
      const insertPendaftaranQuery = `
        INSERT INTO Pendaftaran (id_pendaftaran, NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1, nip_pembimbing2, nip_penguji1, nip_penguji2, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Melakukan query untuk menambahkan pendaftaran
      database.query(insertPendaftaranQuery, [id_pendaftaran, NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1, nip_pembimbing2, nip_penguji1, nip_penguji2, status || 'menunggu'], (err, results) => {
        if (err) {
          console.error('Error inserting pendaftaran:', err);
          // Rollback transaksi jika terjadi kesalahan
          return database.rollback(() => {
            console.error('Rollback transaction due to error:', err);
            res.status(500).json({ error: 'Internal server error' });
          });
        }

        // Commit transaksi jika operasi berhasil
        database.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(201).json({ success: true, message: 'Pendaftaran added successfully' });
          }
        });
      });
    });
  });
};