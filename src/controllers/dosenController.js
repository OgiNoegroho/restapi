const database = require('../config/mysql');

exports.getAllDosen = (req, res) => {
  const sqlQuery = `
    SELECT NIP, Nama, JenisKelamin FROM Dosen
  `;

  database.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'Dosen not found' });
      }
    }
  });
};

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

exports.insertDosen = (req, res) => {
  const { NIP, Nama, JenisKelamin, Email } = req.body;
  const sqlQuery = `
    INSERT INTO Dosen (NIP, Nama, JenisKelamin) VALUES (?, ?, ?);
  `;

  database.query(sqlQuery, [NIP, Nama, JenisKelamin], (err, result) => {
    if (err) {
      console.error('Error inserting dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Dosen inserted successfully' });
    }
  });
};

exports.updateDosenByNIP = (req, res) => {
  const nip = req.params.nip;
  const { Nama, JenisKelamin, Email } = req.body;
  const sqlQuery = `
    UPDATE Dosen SET Nama = ?, JenisKelamin = ? WHERE NIP = ?;
  `;

  database.query(sqlQuery, [Nama, JenisKelamin, nip], (err, result) => {
    if (err) {
      console.error('Error updating dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'Dosen updated successfully' });
      } else {
        res.status(404).json({ error: 'Dosen not found' });
      }
    }
  });
};

exports.deleteDosenByNIP = (req, res) => {
  const nip = req.params.nip;
  const sqlQuery = `
    DELETE FROM Dosen WHERE NIP = ?;
  `;

  database.query(sqlQuery, [nip], (err, result) => {
    if (err) {
      console.error('Error deleting dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'Dosen deleted successfully' });
      } else {
        res.status(404).json({ error: 'Dosen not found' });
      }
    }
  });
};

exports.getMahasiswaByDosen = (req, res) => {
  const nipPembimbing = req.params.nip_pembimbing;
  const sqlQuery = `
    SELECT DISTINCT
      d.Nama AS dosen_nama,
      d.NIP AS dosen_nip,
      d.JenisKelamin AS dosen_jk,
      m.NIM AS nim_mahasiswa,
      m.Nama AS nama_mahasiswa
    FROM 
      Dosen d
    LEFT JOIN 
      Pendaftaran p ON p.nip_pembimbing1 = d.NIP OR p.nip_pembimbing2 = d.NIP
    JOIN 
      Mahasiswa m ON p.NIM = m.NIM
    WHERE
      d.NIP = ?;
  `;

  database.query(sqlQuery, [nipPembimbing], (err, results) => {
    if (err) {
      console.error('Error fetching mahasiswa mentored by dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const dosen = {
          nama: results[0].dosen_nama,
          nip: results[0].dosen_nip,
          jk: results[0].dosen_jk
        };
        const mahasiswaList = results.map(row => ({
          nim: row.nim_mahasiswa,
          nama: row.nama_mahasiswa
        }));
        res.json({ dosen, mahasiswaList });
      } else {
        res.status(404).json({ error: 'Dosen not found' });
      }
    }
  });
};

exports.getAllDosenPembimbing = (req, res) => {
  const sqlQuery = `
    SELECT DISTINCT 
        d.NIP AS nip_pembimbing,
        d.Nama AS nama_pembimbing
    FROM 
        Dosen d
    JOIN 
        Pendaftaran p ON d.NIP = p.nip_pembimbing1

    UNION

    SELECT DISTINCT 
        d.NIP AS nip_pembimbing,
        d.Nama AS nama_pembimbing
    FROM 
        Dosen d
    JOIN 
        Pendaftaran p ON d.NIP = p.nip_pembimbing2;
  `;

  database.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching dosen pembimbing list:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

exports.getMahasiswaByPenguji = (req, res) => {
  const nippenguji = req.params.nip_penguji;
  const sqlQuery = `
    SELECT DISTINCT
      d.Nama AS dosen_nama,
      d.NIP AS dosen_nip,
      d.JenisKelamin AS dosen_jk,
      m.NIM AS nim_mahasiswa,
      m.Nama AS nama_mahasiswa
    FROM 
      Dosen d
    LEFT JOIN 
      Pendaftaran p ON p.nip_penguji1 = d.NIP OR p.nip_penguji2 = d.NIP
    JOIN 
      Mahasiswa m ON p.NIM = m.NIM
    WHERE
      d.NIP = ?;
  `;

  database.query(sqlQuery, [nippenguji], (err, results) => {
    if (err) {
      console.error('Error fetching mahasiswa examined by dosen:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const dosen = {
          nama: results[0].dosen_nama,
          nip: results[0].dosen_nip,
          jk: results[0].dosen_jk
        };
        const mahasiswaList = results.map(row => ({
          nim: row.nim_mahasiswa,
          nama: row.nama_mahasiswa
        }));
        res.json({ dosen, mahasiswaList });
      } else {
        res.status(404).json({ error: 'Dosen not found' });
      }
    }
  });
};

exports.getAllDosenPenguji = (req, res) => {
  const sqlQuery = `
    SELECT DISTINCT 
        d.NIP AS nip_penguji,
        d.Nama AS nama_penguji
    FROM 
        Dosen d
    JOIN 
        Pendaftaran p ON d.NIP = p.nip_penguji1

    UNION

    SELECT DISTINCT 
        d.NIP AS nip_penguji,
        d.Nama AS nama_penguji
    FROM 
        Dosen d
    JOIN 
        Pendaftaran p ON d.NIP = p.nip_penguji2;
  `;

  database.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching dosen penguji list:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};