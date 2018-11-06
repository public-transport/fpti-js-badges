'use strict'

const { fetch } = require('fetch-ponyfill')()
const pkginfo = require('package-json')

const getVersion = async (repo) => {
	// todo
	if (!repo || !repo.file) throw new Error('invalid github repository')

	const packageURL = repo.file('package.json')
	const packageInfo = await (fetch(packageURL).then(res => res.json()).catch(e => null))
	if (!packageInfo) throw new Error('repository / package.json not found')

	const depVersion = packageInfo.dependencies ? packageInfo.dependencies['fpti-tests'] : null
	const devDepVersion = packageInfo.devDependencies ? packageInfo.devDependencies['fpti-tests'] : null

	const fptiTestsVersion = depVersion || devDepVersion
	if (!fptiTestsVersion) throw new Error('fpti-tests not found in dependencies or devDependencies')

	const fptiTestsInfo = await (pkginfo('fpti-tests', { version: fptiTestsVersion, fullMetadata: true }).catch(e => null))
	if (!fptiTestsInfo) throw new Error('matching fpti-tests version not found')

	const fpti = fptiTestsInfo.dependencies.fpti || fptiTestsInfo.devDependencies.fpti
	if (!fpti) throw new Error('fpti-js version not found for given fpti-tests')

	return fpti
}

module.exports = getVersion
