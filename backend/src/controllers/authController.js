const db = require("../config/db");
const queryAsync = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { namaDepan, namaBelakang, nik, email, noTelp, password, alamat } = req.body;
    if (!namaDepan || !namaBelakang || !nik || !email || !noTelp || !alamat || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const cekUser = await queryAsync(
      "SELECT * FROM pelanggan WHERE email = :email OR nik = :nik",
      { email, nik }
    );

    if (cekUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Email atau NIK sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      namaDepan,
      namaBelakang,
      nik,
      email,
      noTelp,
      alamat,
      password: hashedPassword,
    };

    const result = await queryAsync(
      `INSERT INTO pelanggan 
    (nama_depan, nama_belakang, nik, email, nomor_telepon, alamat, password) 
   VALUES 
    (:nama_depan, :nama_belakang, :nik, :email, :no_telp, :alamat, :password)`,
      {
        nama_depan: namaDepan,
        nama_belakang: namaBelakang,
        nik,
        email,
        no_telp: noTelp,
        alamat,
        password: hashedPassword,
      }
    );

    res.status(201).json({
      message: "Pendaftaran berhasil",
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat pendaftaran",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password harus diisi" });
    }
    console.log(email, password);

    const checker = await queryAsync(
      "SELECT * FROM pelanggan WHERE email = :email",
      { email }
    );
    console.log(checker) // ✅

    if (checker.length === 0) {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }

    const user = checker[0];
    console.log("user: ", user) // ✅

    const checkPass = await bcrypt.compare(password, user.PASSWORD);
    if (!checkPass) {
      return res.status(400).json({ message: "Password salah" });
    }

    console.log("status pass:" + checkPass)

    const token = jwt.sign(
      { email: user.email, nik: user.nik },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("login berhasil token: ", token)

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.ID_PELANGGAN,
        namaDepan: user.NAMA_DEPAN,
        namaBelakang: user.NAMA_BELAKANG,
        email: user.EMAIL,
        noTelp: user.NOMOR_TELEPON,
        nik: user.NIK,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat login",
      error: error.message,
    });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const {
      namaLengkap,
      alamat,
      nomor_telepon,
      gaji,
      jabatan,
      email,
      password,
    } = req.body;
    if (!namaLengkap || !alamat || !nomor_telepon || !jabatan || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const cekUser = await queryAsync(
      "SELECT * FROM karyawan WHERE email = :email",
      { email }
    );
    if (cekUser.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      nama_lengkap: namaLengkap,
      alamat: alamat,
      nomor_telepon: nomor_telepon,
      gaji: gaji,
      jabatan: jabatan,
      email: email,
      password: hashedPassword,
    };

    const result = await queryAsync(
      `INSERT INTO karyawan (
    nama_lengkap, alamat, nomor_telepon, gaji, jabatan, email, password
  ) VALUES (
    :nama_lengkap, :alamat, :nomor_telepon, :gaji, :jabatan, :email, :password
  )`,
      {
        nama_lengkap: namaLengkap,
        alamat,
        nomor_telepon,
        gaji,
        jabatan,
        email,
        password: hashedPassword,
      }
    );

    res.status(201).json({
      message: "Pendaftaran karyawan berhasil",
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mendaftarkan karyawan",
      error: err.message,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email, password });
    console.log('email:', email, 'password:', password)
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password harus diisi" });
    }
    const checker = await queryAsync(
      "SELECT ID_karyawan, nama_lengkap, nomor_telepon, jabatan, email, password FROM karyawan WHERE email = :email",
      { email }
    );
    console.log("Checker result:", checker);

    if (checker.length === 0) {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }

    const admin = checker[0];
    const checkPass = await bcrypt.compare(password, admin.PASSWORD);
    if (!checkPass) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin.ID_karyawan, jabatan: admin.jabatan },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login berhasil",
      token: token,
      user: {
        id: admin.ID_KARYAWAN,
        namaLengkap: admin.NAMA_LENGKAP,
        nomorTelepon: admin.NOMOR_TELEPON,
        jabatan: admin.JABATAN,
        email: admin.EMAIL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat login",
      error: error.message,
    });
  }
};
