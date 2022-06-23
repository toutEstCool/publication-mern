import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import UserModel from '../models/user.models.js'

// Registration
export const register = async (req, res) => {
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
}

// Log in
export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}
		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!isValidPassword) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}

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
}

// Get info profile
export const getProfileInfo = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			})
		}
		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (err) {
		console.log(err)
	}
}
