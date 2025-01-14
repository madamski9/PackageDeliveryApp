import express from 'express'
import pkg from 'pg'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookie from "cookie"
import jwt from "jsonwebtoken"
import fs from 'fs'
import https from 'https'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()

const { Pool } = pkg
const allowedOrigins = ['https://localhost:3000']
export const app = express()
app.use(bodyParser.json())
app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST'],
  credentials: true, 
}))
app.use(cookieParser())

const options = {
  key: fs.readFileSync('../../certificates/localhost.key'),
  cert: fs.readFileSync('../../certificates/localhost.crt'),
};

export const pool = new Pool({
  user: 'macciek',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

app.post('/register', async (req, res) => {
  const { name, surname, password, phone, addres } = req.body
  const hash = await bcrypt.hash(password, 10)
  try {
    const client = await pool.connect()
    const checkName = await client.query(
      'SELECT name FROM public.user WHERE name = $1',
      [name]
    )
    console.log(checkName.rows)
    if (checkName.rows.length > 0) {
      console.log("nazwa juz istnieje")
      client.release() 
      res.status(409).send("Name is taken")
    } else {
      const result = await client.query(
        'INSERT INTO public.user (name, surname, password, phone, addres) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, surname, hash, phone, addres]
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
  const { name, password } = req.body
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM public.user WHERE name = $1',
      [name]
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
        maxAge: 60 * 60,
        sameSite: "strict",
        path: "/"
      }))
      console.log("Set-Cookie header:", res.getHeaders()['set-cookie']);
      console.log("ciasteczka1:", req.cookies)
      res.status(200).json({
        id: user.id,
        name: user.name
      })
    } else {
      res.status(401).send('Invalid username or password')
    }
    client.release()
  } catch (err) {
    console.error(err)
    res.status(500).send('Error selecting data from database')
  }
})
app.post("/logout", (req, res) => {
  console.log("logout succesful")
  res.setHeader("Set-Cookie", cookie.serialize("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: -1, 
    sameSite: "strict",
    path: "/"
  }));
  res.status(200).json({ message: "Logged out successfully" });
})

app.post("/api/addPackage", async (req, res) => {
  const { userId, number, name } = req.body
  try {
    const client = await pool.connect()
    const initialStatus = "Sent"
    const result = await client.query(
      'INSERT INTO public.packages (userId, number, name, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, number, name, initialStatus]
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
const updatePackageStatus = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query(`SELECT id, status FROM public.packages WHERE status != 'Delivered'`)
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
      }
    }
    client.release()
  } catch (error) {
    console.error("Error updating package status:", error)
  }
}
setInterval(updatePackageStatus, 30 * 60 * 1000) //* co pol godziny

app.get("/api/getPackage", async (req, res) => {
  const { userId } = req.query
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM public.packages WHERE userId = $1',
      [userId]
    )
    client.release()
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).send("error fetching datas")
  }
})

app.get("/api/getUserData", async (req, res) => {
  const { userId } = req.query
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

https.createServer(options, app).listen(3001, () => {
  console.log('API server running on https://localhost:3001');
});