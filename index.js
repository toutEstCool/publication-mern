import express from 'express'

const app = express()
const port = 4444
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello world!')
})

app.post('/auth/login', (req, res) => {
	console.log(req.body)
	res.json({
		success: true,
	})
})

app.listen(port, err => {
	if (err) return console.log(err)
	return console.log('Server OK!')
})
