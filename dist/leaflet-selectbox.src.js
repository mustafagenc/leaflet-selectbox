/* 
 * Leaflet SelectBox v0.0.1 - 2025-01-15 
 * 
 * Copyright 2025 Mustafa Genc 
 * eposta@mustafagenc.info 
 * https://mustafagenc.info 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * https://github.com/mustafagenc/leaflet-selectbox#readme 
 * 
 * Source: 
 * git@github.com:mustafagenc/leaflet-selectbox.git 
 * 
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
})(function (L) {

    L.SelectBox = L.Control.extend({

        options: {
            title: 'Select',
            lookupProperty: 'Key',
            position: 'topright'
        },

        initialize: function (selectBoxData, options) {
            this.data = selectBoxData;
            L.Util.setOptions(this, options);
        },

        onAdd: function (map) {
            this.div = L.DomUtil.create('div', 'leaflet-selectbox-container');
            this.select = L.DomUtil.create('select', 'form-control', this.div);
            var content = '';

            if (this.options.title.length > 0) {
                content += `<option>${this.options.title}</option>`;
            }
            for (var i = 0; i < this.data.length; i++) {
                content += `<option>${this.data[i][this.options.lookupProperty]}</option>`;
            }

            this.select.innerHTML = content;
            this.select.onmousedown = L.DomEvent.stopPropagation;
            return this.div;
        },

        on: function (type, handler) {
            if (type == 'change') {
                this.onChange = handler;
                L.DomEvent.addListener(this.select, 'change', this._onChange, this);
            }
        },

        _onChange: function (e) {
            var selectedItemKey = this.select.options[this.select.selectedIndex].value;
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i][this.options.lookupProperty] == selectedItemKey) {
                    e.feature = this.data[i];
                    break;
                }
            }
            this.onChange(e);
        }
    });

    L.selectBox = function (selectBoxData, options) {
        return new L.SelectBox(selectBoxData, options);
    };

    return L.SelectBox;
});