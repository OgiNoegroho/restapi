const database = require('../config/mysql');

exports.getMahasiswaP = (req, res) => {
  const nim = req.params.nim;
  const sqlQuery = `
    SELECT 
      p.created_at AS tanggal,
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
        // Format the date
        result[0].tanggal = new Date(result[0].tanggal).toISOString().split('T')[0];
        res.json(result[0]);
      } else {
        res.status(404).json({ error: 'Mahasiswa not found' });
      }
    }
  });
};


exports.getAllMahasiswaP = (req, res) => {
  const sqlQuery = `
    SELECT 
      p.created_at AS tanggal,
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
      // Format the dates
      results.forEach(result => {
        result.tanggal = new Date(result.tanggal).toISOString().split('T')[0];
      });
      res.json(results);
    }
  });
};



exports.updateMahasiswaPStatus = (req, res) => {
  const nim = req.params.nim;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

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
    NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1,
    nip_pembimbing2, nip_penguji1, nip_penguji2, status
  } = req.body;

  if (!NIM || !Judul_TA || !KategoriTA || !JenisTA || !nip_pembimbing1 || !nip_pembimbing2) {
    return res.status(400).json({ error: 'All fields except Penguji are required' });
  }

  const checkMahasiswaQuery = `SELECT * FROM Mahasiswa WHERE NIM = ?`;

  database.query(checkMahasiswaQuery, [NIM], (err, results) => {
    if (err) {
      console.error('Error checking mahasiswa:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa not found' });
    }

    database.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const insertPendaftaranQuery = `
        INSERT INTO Pendaftaran (NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1, nip_pembimbing2, nip_penguji1, nip_penguji2, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const penguji1 = nip_penguji1 || null;
      const penguji2 = nip_penguji2 || null;

      database.query(insertPendaftaranQuery, [NIM, Judul_TA, KategoriTA, JenisTA, nip_pembimbing1, nip_pembimbing2, penguji1, penguji2, status || 'menunggu'], (err, results) => {
        if (err) {
          console.error('Error inserting pendaftaran:', err);

          return database.rollback(() => {
            console.error('Rollback transaction due to error:', err);
            res.status(500).json({ error: 'Internal server error' });
          });
        }

        database.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);

            return database.rollback(() => {
              console.error('Rollback transaction due to error:', err);
              res.status(500).json({ error: 'Internal server error' });
            });
          }

          res.status(201).json({ success: true, message: 'Pendaftaran added successfully' });
        });
      });
    });
  });
};



exports.updatePenguji = (req, res) => {
  const nim = req.params.nim;
  const { nip_penguji1, nip_penguji2 } = req.body;

  console.log('Received NIM:', nim);
  console.log('Received nip_penguji1:', nip_penguji1);
  console.log('Received nip_penguji2:', nip_penguji2);

  if (!nim || !nip_penguji1 || !nip_penguji2) {
    return res.status(400).json({ error: 'NIM, nip_penguji1, and nip_penguji2 are required' });
  }

  const sqlQuery = `
    UPDATE Pendaftaran
    SET nip_penguji1 = ?, nip_penguji2 = ?
    WHERE NIM = ?;
  `;

  database.query(sqlQuery, [nip_penguji1, nip_penguji2, nim], (err, result) => {
    if (err) {
      console.error('Error updating penguji:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows > 0) {
      res.json({ message: 'Penguji updated successfully' });
    } else {
      res.status(404).json({ error: 'Mahasiswa not found' });
    }
  });
};
