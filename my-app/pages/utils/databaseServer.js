import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
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
  try {
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO public.user (name, surname, password, phone, addres) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, surname, password, phone, addres]
    )
    console.log(result.rows)
    client.release() 
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error inserting data into the database')
  }
})

app.get('/home', async (req, res) => {
  const { name, password } = req.query
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM public.user WHERE name = $1 AND password = $2',
      [name, password]
    )
    console.log(result.rows[0])
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0])
    } else {
      res.status(401).send('Invalid username or password')
    }
    client.release()

  } catch (err) {
    console.error(err)
    res.status(500).send('Error selecting data from database')
  }
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})