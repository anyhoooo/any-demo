import { AppStatus, shouldBeActive } from "./app.helper"
import { reroute } from './reroute'

let apps = []
export function registerApplication(name, loadApp, activeWhen,customProps) {
	apps.push({
		name:name,
		loadApp: loadApp,
		activeWhen:activeWhen,
        customProps:customProps,
		status: AppStatus.NOT_LOADED,
	})
	reroute()
}
let flag = false
export function start() {
	flag = true
	reroute()
}

export function isStarted() {
	return flag
}

export function getAppChanges() {
	let appToLoad = []
	let appToMount = []
	let appToUnmount = []

	apps.forEach((app) => {
		let isShouldActive = shouldBeActive(app)
		if(isShouldActive){
			switch (app.status) {
				case AppStatus.NOT_LOADED:
					 appToLoad.push(app)
					break;
				case AppStatus.NOT_BOOTSTRAPPED:
				case AppStatus.NOT_MOUNTED:
					 appToMount.push(app)
					break;
				default:
					break;
			}
		}else{
			appToUnmount.push(app)
		}
	})
	return {
		appToLoad,
		appToMount,
		appToUnmount
	}
}

window.singleSpaNavigate = function (url) {
	history.pushState(null, null, url)
	reroute()
}
