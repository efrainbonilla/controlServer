/*global define*/
define(function (require) {
    'use strict';

    function Notification (notificationProvider, TranslationService) {
        var traductor = TranslationService.$get();
        notificationProvider.$get().log = function (html, o, cb, defaults) {
             var msg = {}
             if (defaults)
               for (var opt in defaults)
                   msg[opt] = defaults[opt]

             if (typeof o == 'function') cb = o
             else if (o)
                for (var opt in o) msg[opt] = o[opt]

             msg.html = traductor.trans(html);
             if (cb) msg.cb = cb
             this.queue.push(msg)
             this._run()
             return this
        };

    }

    Notification.$inject = ['notificationProvider', 'TranslationServiceProvider'];

    return Notification;
});