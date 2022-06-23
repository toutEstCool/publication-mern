import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.validation.js'
import UserModel from './models/user.models.js'

mongoose
	.connect(
		'mongodb+srv://admin:admin123@cluster0.m00tk.mongodb.net/publication-mern?retryWrites=true&w=majority'
	)
	.then(() => console.log('Connect to DB'))
	.catch(err => console.log(`Invalid error DB ${err}`))

const app = express()
const port = 4444
app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret#45$2',
			{
				expiresIn: '10d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Упс:) попробутей позже',
		})
	}
})

app.listen(port, err => {
	if (err) return console.log(err)
	return console.log('Server OK!')
})
