//Punto de entrada para servidor backend.

const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión establecida correctamente.");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send("Ocurrió un error en el servidor");
});

function authenticateToken(req, res, next) {
  const token = req.cookies["auth-token"];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Acceso permitido" });
});

// (GET) Endpoint para obtener datos de la base de datos
app.get("/datos", (req, res, next) => {
  connection.query("SELECT * FROM Usuario", (error, results, fields) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      return next(error);
    }
    console.log("Resultados de la consulta:", results);
    res.json(results);
  });
});

app.post("/login", (req, res) => {
  const { usuario, contraseña } = req.body;

  const query = `SELECT * FROM Usuario WHERE email = ?  AND contraseña = ?`;

  connection.query(query, [usuario, contraseña], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta de login:", error);
      return res
        .status(500)
        .json({ error: "Error en el servidor al intentar iniciar sesión" });
    }
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign(
        { userId: user.usuario_id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      res.cookie("auth-token", token, { httpOnly: true, sameSite: "strict" });
      console.log("Inicio de sesión exitoso para:", usuario);
      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        role: results[0].esAdmin,
      });
    } else {
      console.log("Credenciales inválidas para:", usuario);
      res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }
  });
});

app.post("/signin", (req, res) => {
  const {
    nombre,
    apellido_materno,
    apellido_paterno,
    estado,
    ciudad,
    password,
    email,
    telefono,
    fecha_registro,
  } = req.body;

  const query = `INSERT INTO Usuario (email, telefono, estado, ciudad, contraseña, nombre, apellido_materno, apellido_paterno, fecha_registro, esAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, false);`;

  connection.query(
    query,
    [
      email,
      telefono,
      estado,
      ciudad,
      password,
      nombre,
      apellido_materno,
      apellido_paterno,
      fecha_registro,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta de registro:", error);
        return res
          .status(500)
          .json({ error: "Error en el servidor al intentar registrarse" });
      }
      console.log("Usuario registrado exitosamente:", email);
      res.status(200).json({
        success: true,
        message: "Usuario registrado exitosamente",
      });
    }
  );
});

app.get("/user-info", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  connection.query(
    "SELECT nombre, email FROM Usuario WHERE usuario_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      if (results.length > 0) {
        const { nombre, email } = results[0];
        res.json({ nombre, email });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});

console.log(app._router.stack);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
