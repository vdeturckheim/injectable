'use strict';
const Shimmer = require('shimmer');
module.exports.patchListeners = function (emitter) {
    const listeners = emitter.listeners('request');
    emitter.removeAllListeners('request');
    for (let i = 0; i < listeners.length; ++i) {
        const list = listeners[i];
        const holder = { list };
        Shimmer.wrap(holder, 'list', (original) => {

            return function (req, res) {
                console.log(req.method, req.url);
                return original.apply(this, arguments);
            }
        });
        emitter.on('request', holder.list);
    }
};
