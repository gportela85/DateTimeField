/*
 * File: DateTimePicker.js
 *
 * This file requires use of the Ext JS library, under independent license.
 * This is part of the UX for DateTimeField developed by Guilherme Portela
 */
 
Ext.define('Ext.ux.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    requires: [
        'Ext.picker.Date',
        'Ext.slider.Single',
        'Ext.form.field.Time',
        'Ext.form.Label'
    ],
    todayText: 'Current Date',
    initComponent: function() {
        var me = this,
            dtAux = me.value ? new Date(me.value) : new Date();

        me.timeFormat = ~me.format.indexOf("h") ? 'h' : 'H';

        me.hourSlider = new Ext.slider.Single({
            fieldLabel: 'Hour',
            labelAlign: 'top',
            labelSeparator: ' ',
            padding: '0 0 10 17',
            focusable : false,
            value: 0,
            minValue: 0,
            maxValue: 23,
            vertical: true,
            listeners: {
                change: me.changeTimeValue,
                scope: me
            }
        });

        me.minuteSlider = new Ext.slider.Single({
            fieldLabel: 'Minutes',
            labelAlign: 'top',
            labelSeparator: ' ',
            padding: '0 10 10 0',
            focusable : false,
            value: 0,
            increment: 1,
            minValue: 0,
            maxValue: 59,
            vertical: true,
            listeners: {
                change: me.changeTimeValue,
                scope: me
            }
        });

        me.callParent();

        dtAux.setSeconds(0);
        me.setValue(new Date(dtAux));
    },
    afterRender: function() {
        var me = this,
            el = me.el;

        me.timePicker = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            border: false,
            defaults: {
                flex: 1
            },
            width: 130,
            floating: true,
            onMouseDown: function(e) {
                e.preventDefault();
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                ui: 'footer',
                items: [
                    '->', {
                        xtype: 'label',
                        text: me.timeFormat == 'h' ? '12:00 AM' : '00:00'
                    },
                    '->'
                ]
            }],
            items: [me.hourSlider, me.minuteSlider]
        });

        me.callParent();
    },
    changeTimeValue: function(slider, e, eOpts) {
        var me = this,
            label = me.timePicker.down('label'),
            hourPrefix = '',
            minutePrefix = me.minuteSlider.getValue() < 10 ? '0' : '',
            timeSufix = '',
            hourDisplay = me.hourSlider.getValue(),
            auxDate = new Date();

        if (me.timeFormat == 'h') {
            timeSufix = me.hourSlider.getValue() < 12 ? ' AM' : ' PM';
            hourDisplay = me.hourSlider.getValue() < 13 ? hourDisplay : hourDisplay - 12;
            hourDisplay = hourDisplay || '12';
        }
        hourPrefix = hourDisplay < 10 ? '0' : '';

        label.setText(hourPrefix + hourDisplay + ':' + minutePrefix + me.minuteSlider.getValue() + timeSufix);

        if (me.pickerField && me.pickerField.getValue()) {
            me.pickerField.setValue(new Date(me.pickerField.getValue().setHours(me.hourSlider.getValue(), me.minuteSlider.getValue())));
        }
    },
    onShow: function() {
        var me = this;
        me.showTimePicker();
        me.callParent();
    },
    showTimePicker: function() {
        var me = this,
            el = me.el,
            timePicker = me.timePicker;
        Ext.defer(function() {
            var body = Ext.getBody(),
                bodyWidth = body.getViewSize().width,
                alignTo = (bodyWidth < (el.getX() + el.getWidth() + 140)) ? 'tl' : 'tr',
                xPos = alignTo == 'tl' ? -135 : 5,
                backgroundColor, toolbar;

            me.timePicker.setHeight(el.getHeight());
            me.timePicker.showBy(me, alignTo, [xPos, 0]);

            toolbar = me.timePicker.down('toolbar').getEl();
            backgroundColor = toolbar.getStyle('background-color');
            if (backgroundColor == 'transparent') {
                toolbar.setStyle('background-color', toolbar.getStyle('border-color'));
            }
        }, 1);
    },
    onHide: function() {
        var me = this;
        me.timePicker.hide();
        me.callParent();
    },
    beforeDestroy: function() {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.timePicker,
                me.minuteSlider,
                me.hourSlider
            );
        }
        me.callParent();
    },
    setValue: function(value) {
        value.setSeconds(0);
        this.value = new Date(value);
        return this.update(this.value);
    },
    selectToday: function() {
        var me = this,
            btn = me.todayBtn,
            handler = me.handler
        auxDate = new Date;

        if (btn && !btn.disabled) {
            me.setValue(new Date(auxDate.setSeconds(0)));
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },
    handleDateClick: function(e, t) {
        var me = this,
            handler = me.handler,
            hourSet = me.timePicker.items.items[0].getValue(),
            minuteSet = me.timePicker.items.items[1].getValue(),
            auxDate = new Date(t.dateValue);
        e.stopEvent();
        if (!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
            me.doCancelFocus = me.focusOnSelect === false;
            auxDate.setHours(hourSet, minuteSet, 0);
            me.setValue(new Date(auxDate));
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }

            me.onSelect();
        }
    },
    selectedUpdate: function(date) {
        var me = this,
            dateOnly = Ext.Date.clearTime(date, true),
            currentDate = (me.pickerField && me.pickerField.getValue()) || new Date();

        this.callParent([dateOnly]);

        if (currentDate) {
            Ext.defer(function() {
                me.timePicker.items.items[0].setValue(currentDate.getHours());
                me.timePicker.items.items[1].setValue(currentDate.getMinutes());
            }, 10);

        }

    },
    fullUpdate: function(date) {
        var me = this,
            dateOnly = Ext.Date.clearTime(date, true),
            currentDate = (me.pickerField && me.pickerField.getValue()) || new Date();

        this.callParent([dateOnly]);

        if (currentDate) {
            Ext.defer(function() {
                me.timePicker.items.items[0].setValue(currentDate.getHours());
                me.timePicker.items.items[1].setValue(currentDate.getMinutes());
            }, 10);

        }

    }
});