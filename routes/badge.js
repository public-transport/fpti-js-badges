'use strict'

const { BadgeFactory } = require('gh-badges')
const githubInfo = require('hosted-git-info')
const getVersion = require('../lib')

const badges = new BadgeFactory({ fontPath: './Verdana.ttf' })

const error = (msg, code) => {
	const e = new Error(msg)
	e.statusCode = code
	return e
}

const badge = (text, color) => badges.create({
	text: ['fpti-js', text],
	colorB: color,
	template: 'flat'
})

const route = async (req, res, next) => {
	const path = req.path.slice('/badge/'.length) // todo
	const repo = githubInfo.fromUrl(path)
	const fpti = await (getVersion(repo).catch(e => {
		// next(error(e, 400))
		return null
	}))
	let b
	if (!fpti) b = await (badge('invalid', '#9f9f9f').catch(e => null))
	else b = badge(fpti, '#ff66bb')
	if (!b) return next(error('error while generating badge', 500))

	res.setHeader('Content-Type', 'image/svg+xml')
	res.end(b)
}

module.exports = route
