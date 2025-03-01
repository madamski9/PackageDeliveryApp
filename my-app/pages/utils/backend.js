import express from 'express'
import pkg from 'pg'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookie from "cookie"
import mqtt from 'mqtt'
import jwt from "jsonwebtoken"
import fs from 'fs'
import https from 'https'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import WebSocket from 'ws'
dotenv.config()

const { Pool } = pkg
const allowedOrigins = ['https://localhost:3000']
export const app = express()
app.use(bodyParser.json())
//! kontrola jakie domeny uzyskuja dostep do serwera
app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST'],
  credentials: true, 
}))
app.use(cookieParser())

//! MQTT
const clientMqtt = mqtt.connect('wss://localhost:9001', {
  rejectUnauthorized: false, 
})

clientMqtt.on("connect", () => {
    console.log("Connected to MQTT broker")
})
clientMqtt.on("error", (error) => {
    console.error("mqtt error: ", error)
})

app.post("/mqtt/publish", (req, res) => {
    const { topic, message } = req.body

    if (!topic || !message) {
        return res.status(400).json({ error: 'Brak tematu lub wiadomości w żądaniu' })
    }
    
    clientMqtt.publish(topic, message, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd podczas publikowania wiadomości' })
        }
        console.log(`Wiadomość opublikowana na temacie ${topic}: ${message}`)
        res.status(200).json({ message: 'Wiadomość opublikowana pomyślnie' })
    })
})

const options = {
  key: fs.readFileSync('../../certificates/localhost.key'),
  cert: fs.readFileSync('../../certificates/localhost.crt')
}
app.server = https.createServer(options, app)
const server = app.server

//! WEBSOCKETS

const wss = new WebSocket.Server({ server })

//! DATABASE API

export const pool = new Pool({
  user: 'macciek',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

app.post('/register', async (req, res) => {
  const { name, surname, email, password, phone, addres } = req.body
  const hash = await bcrypt.hash(password, 10)
  try {
    const client = await pool.connect()
    const checkName = await client.query(
      'SELECT email FROM public.user WHERE email = $1',
      [email]
    )
    console.log(checkName.rows)
    if (checkName.rows.length > 0) {
      console.log("email juz istnieje")
      client.release() 
      res.status(409).send("Email is taken")
    } else {
      const result = await client.query(
        'INSERT INTO public.user (name, surname, email, password, phone, addres) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, surname, email, hash, phone, addres]
      )
      console.log(result.rows)
      res.status(200).json(result.rows[0])
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Error inserting data into the database')
  }
})

app.post('/home', async (req, res) => {
  const { email, password } = req.body
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM public.user WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) {
      res.status(401).send('Invalid username or password')
      client.release()
      return
    }
    console.log("login: ", result.rows[0])
    const user = result.rows[0]
    //! sprawdzenie czy zgadza sie hasz hasla
    const isValid = await bcrypt.compare(password, user.password)
    if (isValid) {
      //! jsonwebtoken
      const token = jwt.sign(
        { id: user.id, name: user.name },  
        process.env.NEXT_PUBLIC_JWT_SECRET,          
        { expiresIn: '1h' }               
      )
      console.log(token)
      //! ustawienie ciasteczka z tokenem sesji
      res.setHeader("Set-Cookie", cookie.serialize("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 120 * 60,
        sameSite: "strict",
        path: "/"
      }))
      res.status(200).json({
        id: user.id,
        name: user.name
      })
    } else {
      res.status(401).send('Invalid email or password')
    }
    client.release()
  } catch (err) {
    console.error(err)
    res.status(500).send('Error selecting data from database')
  }
})

//! JWT VERIFY
const verifyToken = (req, res, next) => {
  const token = req.cookies['token'] //! odczytanie tokenu z ciasteczka
  if (!token) {
    return res.status(403).json({ message: "Access denied" })
  }
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET)
    req.user = decoded.id
    console.log("id user:", req.user)
    next() //! kontynuacja
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

app.post("/logout", (req, res) => {
  console.log("logout succesful")
  res.setHeader("Set-Cookie", cookie.serialize("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: -1, 
    sameSite: "strict",
    path: "/"
  }));
  res.status(200).json({ message: "Logged out successfully" })
  res.redirect('/login')
})

app.post("/api/addPackage", verifyToken, async (req, res) => {
  const { number, name, packageLocker } = req.body
  const userId = req.user
  try {
    const client = await pool.connect()
    const initialStatus = "Sent"
    const result = await client.query(
      'INSERT INTO public.packages (userId, number, name, status, packageLocker) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, number, name, initialStatus, packageLocker]
    )
    client.release()
    console.log(result.rows[0])
    res.status(200).json(result.rows[0])

  } catch (error) {
    console.error("Error adding package:", error)
    res.status(500).send("Error adding package")
  }
})
const statusSequence = ["Sent", "Accepted for execution", "On the way", "Delivered"]
clientMqtt.on('connect', () => {
  console.log('Połączono z brokerem MQTT');
})
clientMqtt.on('error', (error) => {
  console.error('Błąd połączenia z brokerem MQTT:', error);
})

wss.on("connection", (ws) => {
  console.log("New WebSocket connection")
  ws.on("message", (msg) => {
    console.log("Received: ", msg)
  })
})

const updatePackageStatus = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query(`SELECT * FROM public.packages WHERE status != 'Delivered'`)
    console.log(result.rows)

    for (let packages of result.rows) {
      const currIdx = statusSequence.indexOf(packages.status)
      if (currIdx >= 0 && currIdx < statusSequence.length - 1) {
        const newStatus = statusSequence[currIdx + 1]
        await client.query(
          'UPDATE public.packages SET status = $1 WHERE id = $2',
          [newStatus, packages.id]
        )
        console.log(`Updated package ${packages.id} to status: ${newStatus}`)

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              console.log("Sending delivered package to WebSocket client");
              client.send(JSON.stringify(packages))
          }
        })
        if (newStatus === "Delivered") {
          if (!packages.lockernumber) {
            const randomNum = Math.floor(Math.random()*60) + 1
            await client.query(
              'UPDATE public.packages SET lockernumber = $1 WHERE id = $2',
              [randomNum, packages.id]
            )
          }
          if (packages.userid === undefined) {
            console.error("Brak userId w paczce:", packages);
            return; 
          }
          
          clientMqtt.publish(`/user/${packages.userid}/package/delivered`, JSON.stringify({
            message: `Package number ${packages.number} is delivered!`,
          }), (err) => {
            if (err) {
              console.error('Błąd podczas publikowania dostarczenia paczki:', err);
            } else {
              console.log(`Paczka ${packages.id} została dostarczona!`);
            }
          })
        }
      }
    }
    client.release()
  } catch (error) {
    console.error("Error updating package status:", error)
  }
}

setInterval(updatePackageStatus, 200 * 1000) //* czas dostarczenia paczki

app.post("/api/addLockerNumber", async (req, res) => {
  const { lockernumber, number } = req.body
  try {
    const client = await pool.connect()
    const result = await client.query('UPDATE public.packages SET lockernumber = $1 WHERE number = $2',
      [lockernumber, number]
    )
    client.release()
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).send("Error updating package locker number")
  }
})

app.get("/api/getPackage", verifyToken, async (req, res) => {
  const userId = req.user
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM public.packages WHERE userId = $1',
      [userId]
    )
    client.release()
    console.log(result.rows)
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).send("error fetching datas")
  }
})

app.get("/api/getUserData", verifyToken, async (req, res) => {
  const userId = req.user
  console.log("userId: ", userId)
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT name, surname, phone, addres FROM public.user WHERE id = $1',
      [userId]
    )
    client.release()
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).send("error fetching user data")
  }
})
app.delete("/api/deletePackage", verifyToken, async (req, res) => {
  const { number } = req.body
  const userId = req.user
  try {
    const client = await pool.connect()
    const result = await client.query('DELETE FROM public.packages WHERE number = $1 AND userId = $2 RETURNING *',
      [number, userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Package not found" })
    }
    console.log("Deleted package number: ", result.rows)
    client.release()
    res.status(200).json({
      message: `Package number ${number} deleted successfully`,
      deletedPackage: result.rows[0]
    })
  } catch (error) {
    console.error("Error deleting package:", error)
    res.status(500).send("error deleting package")
  }
})

app.delete("/api/deleteAllPackages", verifyToken, async (req, res) => {
  const userId = req.user
  try {
    const client = await pool.connect()
    const result = await client.query(`DELETE FROM public.packages WHERE status = 'Delivered' AND userId = $1`, 
      [userId]
    )
    console.log("Deleted all packages")
    client.release()
    res.status(200).json(result.rows)
  } catch (error) {
    console.error("error deleting all packages: ", error)
    res.status(500).send("error deleting all packages")
  }
})

app.server.listen(3001, () => {
  console.log('API + WSS server running on https://localhost:3001');
});