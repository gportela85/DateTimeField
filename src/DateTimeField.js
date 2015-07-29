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

    // localization example
    // TODO : check browsers and ExtJS versions compatibility
    config: Object.defineProperties({
        timeFormat: "H:i",
        timeFormatSec: "H:i:s"
    }, {
        // inherit Ext.form.field.Date.format localization
        format: {
            get: function () {
                return Ext.form.field.Date.prototype.format + " " + this.timeFormat;
            },
            configurable: true, enumerable: true
        },
        // inherit Ext.form.field.Date.altFormats localization
        altFormats: {
            get: function () {
                return Ext.form.field.Date.prototype.altFormats + " " + this.timeFormatSec + "|" + "c";
            },
            configurable: true, enumerable: true
        }
    }),

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

        if ((Ext.getVersion().major == 4 && !me.isDestroyed && 
          !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true) && 
          !e.within(me.picker.timePicker.el, false, true)) || 
          (Ext.getVersion().major == 5 && 
          !Ext.fly(e.target).isFocusable() && 
          !me.isDestroyed && 
          !e.within(me.bodyEl, false, true) && !me.owns(e.target)) 
          && !e.within(picker.timePicker.el, false, true)) {
            me.collapse();
        }
    },
    createPicker: function() {
        var me = this,
            format = Ext.String.format;

        return new Ext.ux.DateTimePicker({
            pickerField: me,
            floating: true,
            hidden: true,
            focusable: false, // Key events are listened from the input field which is never blurred
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    }
});
