CKEDITOR.editorConfig = function( config ) {
	config.language = 'vi';
	config.skin = "office2013"
    config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'Source,Save,Templates,ExportPdf,Preview,Print,PasteFromWord,PasteText,Paste,Copy,Cut,Undo,Replace,Find,SelectAll,Scayt,Form,Checkbox,Radio,Textarea,Select,ImageButton,HiddenField,Button,TextField,Redo,NewPage,CopyFormatting,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Table,HorizontalRule,Image,SpecialChar,PageBreak,Iframe,ShowBlocks,About';
};