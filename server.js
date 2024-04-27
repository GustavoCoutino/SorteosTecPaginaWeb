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

app.get("/es-admin", authenticateToken, (req, res) => {
  const id = req.user.userId;
  connection.query(
    "SELECT esAdmin FROM Usuario WHERE usuario_id = ?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      if (results.length > 0) {
        res.json({ esAdmin: results[0].esAdmin });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  );
});

app.get("/monedas-totales", authenticateToken, (req, res) => {
  const id = req.user.userId;
  connection.query(
    "CALL SorteosTec.GetTarjetasAndSaldoByUsuarioId(?);",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      if (results.length > 0) {
        const { monedasBoletos } = results[1][0];
        res.json({ monedas: monedasBoletos });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  );
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
        { userId: user.usuario_id, role: user.esAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
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

  const query = `CALL CreateCuentaAndWallet(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

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

app.post("/signin-admin", authenticateToken, (req, res) => {
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

  const query = `CALL CreateAdmin(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

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

app.get("/wallet-info", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  connection.query(
    "CALL SorteosTec.GetComprasByUsuarioId(?);",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      if (results.length > 0) {
        res.json({ compras: results[0], total: results[1][0].Total });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  );
});

app.get("/payment-data", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  connection.query(
    "CALL SorteosTec.GetTarjetasAndSaldoByUsuarioId(?)",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      if (results.length > 0) {
        const { saldo } = results[1][0];
        res.json({
          cuentas: results[0],
          saldo: saldo,
        });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    }
  );
});

app.post("/add-card", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { numero, tipo, cvv, banco } = req.body;
  connection.query(
    "CALL SorteosTec.CreateTarjeta(?, ?, ?, ?, ?)",
    [userId, numero, tipo, cvv, banco],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ success: true, message: "Tarjeta agregada exitosamente" });
    }
  );
});

app.post("/delete-card", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const numero = req.body.numero;
  connection.query(
    "CALL SorteosTec.DeleteTarjeta(?, ?)",
    [userId, numero],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ success: true, message: "Tarjeta eliminada exitosamente" });
    }
  );
});

app.post("/update-game-session", authenticateToken, (req, res) => {
  const usuarioId = req.user.userId;
  const { puntaje, monedas, nombreJuego, tiempoJugado, fecha } = req.body;
  connection.query(
    "CALL SorteosTec.CreateEstructura(?, ?, ?, ?, ?, ?)",
    [puntaje, monedas, usuarioId, nombreJuego, tiempoJugado, fecha],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ success: true, message: "Accion registrada exitosamente" });
    }
  );
});

app.get("/cargas-saldo", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  connection.query(
    "Call SorteosTec.GetCargasSaldo(?)",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ cargas: results });
    }
  );
});

app.post("/update-saldo", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { numeroTarjeta, fecha, saldoAgregado } = req.body;
  connection.query(
    "CALL SorteosTec.agregarSaldo(?, ?, ?, ?)",
    [userId, numeroTarjeta, fecha, saldoAgregado],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ success: true, message: "Saldo actualizado exitosamente" });
    }
  );
});

app.post("/email-exists", (req, res) => {
  const email = req.body.email;
  connection.query(
    "Call SorteosTec.EmailExists(?)",
    [email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ exists: results });
    }
  );
});

app.post("/card-exists", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const numero = req.body.numero;
  connection.query(
    "CALL SorteosTec.TarjetaExists(?, ?)",
    [userId, numero],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error del servidor" });
      }
      res.json({ exists: results });
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
