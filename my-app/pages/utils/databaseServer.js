import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt'

const { Pool } = pkg

export const app = express()
app.use(bodyParser.json())
app.use(cors())

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
      res.status(201).json(result.rows[0])
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
    console.log(result.rows[0])
    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password)
    if (isValid) {
      res.status(201).json({
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

app.post("/api/addPackage", async (req, res) => {
  const { number, name } = req.body
  try {
    const client = await pool.connect()
    const initialStatus = "Sent"
    const result = await client.query(
      'INSERT INTO public.packages (number, name, status) VALUES ($1, $2, $3) RETURNING *',
      [number, name, initialStatus]
    )
    client.release()
    console.log(result.rows[0])
    res.status(201).json(result.rows[0])

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
setInterval(updatePackageStatus, 1 * 60 * 1000) //* co minute

app.get("/api/getPackage", async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM public.packages')
    client.release()
    res.status(201).json(result.rows)
  } catch (error) {
    res.status(500).send("error fetching datas")
  }
})

app.get("/api/getUserData", async (req, res) => {
  const { userId } = req.query
  console.log(userId)
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT name, surname, phone, addres FROM public.user WHERE id = $1',
      [userId]
    )
    client.release()
    res.status(201).json(result.rows)
  } catch (error) {
    res.status(500).send("error fetching user data")
  }
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})