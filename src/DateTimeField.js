/*
 * File: DateTimeField.js
 *
 * This file requires use of the Ext JS library, under independent license.
 * This is part of the UX for DateTimeField developed by Guilherme Portela
 */
Ext.define('Ext.ux.DateTimeField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['Ext.ux.DateTimePicker'],

    //<locale>
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse}.
     */
    format: "m/d/Y H:i",
    //</locale>
    //<locale>
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it does not match the defined
     * format.
     */
    altFormats: "m/d/Y H:i:s|c",
    width: 270,

    mimicBlur: function(e) {
        var me = this,
            picker = me.picker;

        // ignore mousedown events within the picker element
        if (!picker || !e.within(picker.el, false, true) && !e.within(picker.timePicker.el, false, true)) {
            me.callParent(arguments);
        }
    },
    triggerBlur: function() {
        return false;
    },
    collapseIf: function(e) {
        var me = this,
            picker = me.picker;

        if (picker.timePicker && !e.within(picker.timePicker.el,false,true)) {
            me.callParent([e]);
        }
    },
    createPicker: function() {
        var me = this,
            format = Ext.String.format,
            parentPicker = this.callParent(),
            o = {};
            for(var key in parentPicker) {
                if (parentPicker.hasOwnProperty(key) && parentPicker[key]){
                    o[key] = parentPicker[key]
                }
            }
        return new Ext.ux.DateTimePicker(o);
    },
    getRefItems: function() {
        var me = this,
            result = me.callParent();

        if (me.picker.timePicker){
            result.push(me.picker.timePicker);
        }
        
        return result;
    }
});