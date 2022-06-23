import express from 'express'
import mongoose from 'mongoose'

import { registerValidation } from './validations/auth.validation.js'
import checkAuth from './utils/checkAuth.js'
import * as userControllers from './controllers/userControllers.js'

mongoose
	.connect(
		'mongodb+srv://admin:admin123@cluster0.m00tk.mongodb.net/publication-mern?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connect to DB'))
	.catch(err => console.log(`Invalid error DB ${err}`))

const app = express()
const port = 4444
app.use(express.json())

// Registration
app.post('/auth/register', registerValidation, userControllers.register)

// Log in
app.post('/auth/login', userControllers.login)

// My info

app.get('/auth/me', checkAuth, userControllers.getProfileInfo)

app.listen(port, err => {
	if (err) return console.log(err)
	return console.log('Server OK!')
})
