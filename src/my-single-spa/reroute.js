import { getAppChanges, isStarted } from './app.js'
import { toLoadPromise, toUnmountPromise, toBootstrapPromise, toMountPromise } from './lifecycles'

export function reroute() {
	let appList = getAppChanges()
	if (isStarted()) {
		appChange()
	} else {
		loadApps()
	}

	async function loadApps() {
		await Promise.all(appList.appToLoad.map(toLoadPromise))
	}

	async function appChange() {
		appList.appToUnmount.map(toUnmountPromise)
		appList.appToLoad.map(async (app) => {
			await toLoadPromise(app)
			await toBootstrapPromise(app)
			await toMountPromise(app)
		})
		appList.appToMount.map(async (app) => {
			await toBootstrapPromise(app)
			await toMountPromise(app)
		})
	}
}
