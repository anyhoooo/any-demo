// import * as singleSpa from 'single-spa';

// import * as singleSpa from '../../../../code/single-spa/src/single-spa';
//本地调试，需要__DEV__ = true;
// window.__DEV__ = true;

import * as singleSpa from '../my-single-spa/app';

singleSpa.registerApplication('app-1', () =>
    import('../app1/app1.js'), pathPrefix('/app1'));
singleSpa.registerApplication('app-2', () =>
    import('../app2/app2.js'), pathPrefix('/app2'));
singleSpa.registerApplication('app-3', async () => {
    await createScript('远端js')
    return window['purehtml']
}, pathPrefix('/app3'));
singleSpa.registerApplication('app-4', () =>
    import('../app4/app4.js'), pathPrefix('/app4'));
singleSpa.registerApplication('app-5', () =>
    import('../app5/app5.js'), pathPrefix('/app5'));
singleSpa.start();

function pathPrefix(prefix) {
    return function (location) {
        return location.pathname.startsWith(`${prefix}`);
    }
}

function createScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = resolve
        script.onerror = reject
        const firstScript = document.getElementsByTagName('script')[0]
        firstScript.parentNode.insertBefore(script, firstScript)
    })
}

