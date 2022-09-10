import Vue from 'vue'
import App from './App.vue'
import singleSpaVue from 'single-spa-vue';
// Vue.config.productionTip = false;
const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        render: (h) => h(App),
    }
});

export function bootstrap(props) {
    return vueLifecycles.bootstrap(props);
}

export function mount(props) {
    console.log('1', 1)
    return vueLifecycles.mount(props);
}

export function unmount(props) {
    return vueLifecycles.unmount(props);
}