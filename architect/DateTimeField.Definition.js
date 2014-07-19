{
    classAlias: 'widget.datetimefield',
    className : 'Ext.ux.DateTimeField',
    inherits  : 'Ext.form.field.Date',
    autoName  : 'MyDateTimeField',
    helpText  : 'Provides a date time field input with a dropdown picker.',
 
    toolbox: {
        name     : 'DateTime Field',
        category : 'Form Fields',
        groups   : ['Forms']
    },
 
    configs: [{
        name : 'format',
        type : 'string',
        initialValue : 'm/d/Y H:i'
    },{
        name : 'altFormats',
        type : 'string',
        initialValue : 'm/d/Y H:i:s|c'
    },{
        name : 'fieldLabel',
        type : 'string',
        initialValue : 'Label'
    }]
 
}