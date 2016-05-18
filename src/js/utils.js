/*
 * @Author: d12mnit
 * @Date:   2016-05-11 15:37:27
* @Last modified by:   d12mnit
* @Last modified time: 2016-05-17T21:55:50+08:00
 */
(function() {
    'use strict';
    var Utils = {
        randomId: function() {
            var random;
            var id = '';

            for (var i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    id += '-';
                }
                id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return id;
        },
        pluralize: function(count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function(key, value) {
            if (value) {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            var store = localStorage.getItem(key);
            return (store && JSON.parse(store)) || [];
        },
        extends: function() {
            var newObj = {};
            for (var i = 0; i < arguments.length; i++) {
                var obj = arguments[i];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }
    };
    module.exports = Utils;
}());
