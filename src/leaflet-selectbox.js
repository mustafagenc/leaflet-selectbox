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

    L.Control.SelectBox = L.Control.extend({

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

            if (this.options.title.length > 0) {
                var optionElement = L.DomUtil.create("option");
                optionElement.innerHTML = this.options.title;
                this.select.appendChild(optionElement);
            }

            for (var i = 0; i < this.data.length; i++) {
                var optionElement = L.DomUtil.create("option");
                optionElement.innerHTML = this.data[i][this.options.lookupProperty];
                optionElement.value = this.data[i][this.options.lookupProperty];

                this.select.appendChild(optionElement);
            }

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
            this.select.options[this.select.selectedIndex].selected = true;
            var selectedItemKey = this.select.options[this.select.selectedIndex].value;
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i][this.options.lookupProperty] == selectedItemKey) {
                    e.selectedItem = this.data[i];
                    break;
                }
            }
            this.onChange(e);
        }
    });

    L.control.selectBox = function (selectBoxData, options) {
        return new L.Control.SelectBox(selectBoxData, options);
    };

    return L.Control.SelectBox;
});