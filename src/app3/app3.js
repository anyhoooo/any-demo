(function (global) {
    let domEl;
    global['purehtml'] = {
        bootstrap: function () {
            domEl = document.createElement('div');
            domEl.id = 'app3';
            document.body.appendChild(domEl);
            return Promise.resolve();
        },
        mount: function (props) {
            domEl.textContent = 'App 3 is mounted!'

            return Promise.resolve();
        },
        unmount: function () {
            domEl.textContent = '';
            return Promise.resolve();
        },
    };
})(window);