import { AppStatus } from './app.helper'

export async function toBootstrapPromise(app) {
	await app.bootstrap(app)
	app.status = AppStatus.NOT_MOUNTED
	return app
}

export async function toLoadPromise(app) {
	let { bootstrap, mount, unmount } = await app.loadApp()
	app.status = AppStatus.NOT_BOOTSTRAPPED
	app.bootstrap = bootstrap
	app.mount = mount
	app.unmount = unmount
	return app
}

export async function toMountPromise(app) {
	await app.mount(app)
	app.status = AppStatus.MOUNTED
	return app
}

export async function toUnmountPromise(app) {
	if(app.status === AppStatus.MOUNTED){
		await app.unmount()
		app.status = AppStatus.NOT_MOUNTED
	}
	return app
}
