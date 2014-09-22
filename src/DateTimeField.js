/*
 * File: DateTimeField.js
 *
 * This file requires use of the Ext JS 4.2.x/5.0.x library, under independent license.
 * For more details see http://www.sencha.com/license or contact license@sencha.com.
 *
 */
 Ext.define('Ext.ux.DateTimeField', {
  extend: 'Ext.form.field.Date',
  alias: 'widget.datetimefield',
  requires: ['Ext.ux.DateTimePicker'],


  fieldLabel: 'Label',
  //<locale>
  /**
   * @cfg {String} format
   * The default date format string which can be overriden for localization support. The format must be valid
   * according to {@link Ext.Date#parse}.
  */
  format : "m/d/Y H:i",
  //</locale>
  //<locale>
  /**
   * @cfg {String} altFormats
   * Multiple date formats separated by "|" to try when parsing a user input value and it does not match the defined
   * format.
  */
  altFormats : "m/d/Y H:i:s|c",
  width: 270,
  mimicBlur: function(e) {
    var me = this,
    picker = me.picker;
    // ignore mousedown events within the picker element
    if (!picker || !e.within(picker.el, false, true) && !e.within(picker.timePicker.el, false, true) && !me.isEventWithinPickerLoadMask(e)) {
      me.callParent(arguments);
    }
  },
  collapseIf: function(e) {
    var me = this;
    if ((Ext.getVersion().major < 5 
      && !me.isDestroyed 
      && !e.within(me.bodyEl, false, true) 
      && !e.within(me.picker.el, false, true) 
      && !e.within(me.picker.timePicker.el, false, true) 
      && !me.isEventWithinPickerLoadMask(e)) ||
      (Ext.getVersion().major >4
      && !me.isDestroyed 
      && !e.within(me.bodyEl, false, true) 
      && !me.owns(e.target))
      ) {
        me.collapse();
    } 
  },
  onExpand: function() {
    var value = this.getValue();
    this.picker.setValue(Ext.isDate(value) ? value : new Date());
  },
  createPicker: function() {
    var me = this,
    format = Ext.String.format;

    return new Ext.ux.DateTimePicker({
      pickerField: me,
      ownerCt: me.ownerCt,
      renderTo: document.body,
      floating: true,
      hidden: true,
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