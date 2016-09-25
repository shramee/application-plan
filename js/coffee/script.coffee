appData = localStorage.getItem( 'appData' );
appData = if appData then JSON.parse appData else []
app = do ( $ = jQuery ) ->
	$( '.wrap:first' ).fadeIn 350
	# app object to return

	s     : {} # screens
	i     : null
	module: {} #Current module data

	saveAppData: ->
		localStorage.setItem( 'appData', JSON.stringify( appData ) );

	init: ->
		app.initVars()
		app.initEvents()
		app.modules()
		app.sortable()

	sortable: ->
		$( '.multi-list' ).sortable connectWith: ".multi-chosen"
		$( '.multi-chosen' ).sortable connectWith: ".multi-list"
		$( '.single-list' ).sortable connectWith: ".single-chosen"
		$( '.single-chosen' ).sortable connectWith: ".single-list"


	initVars: ->
		app.$mods = $ '.modules'
		app.$n = $ '#module'
		app.$tax = $ '.tax .list'
		app.$meta = $ '.meta .list'
		app.$multi = $ '.multi .list'
		app.$single = $ '.single .list'

	initEvents: ->
		app.$mods.on 'click', '.module', ->
			$t = $ this
			app.i = $t.attr( 'i' )
			app.module = appData[app.i]
			app.initModule()

	switchS: ( screen )->
		$s = $ '#' + screen
		if ( ! $s.is( ':visible' ) )
			$( '.wrap' ).fadeOut 350
			$s.fadeIn 350

	initModule: ->
		app.switchS 'module'
		m = app.module
		$( '#name' ).val( m.name )
		app.$tax.html '' # Empty existing data
		app.$meta.html '' # Empty existing data
		app.$multi.html '' # Empty existing data
		app.$single.html '' # Empty existing data
		for name, val of m.Taxo
			do ( name, val )->
				app.$tax.append '<span class="btn pu-bg field">' + name + '</span>'
				app.$multi.append '<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>'
				app.$single.append '<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>'
		for name, val of m.Meta
			do ( name, val )->
				app.$meta.append '<span class="btn pu-bg field">' + name + '</span>'
				app.$multi.append '<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>'
				app.$single.append '<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>'
		for name, val of m.MultiView
			do ( name, val )->
				app.$multi.children '[data-name="' + name + '"]'
				.appendTo app.$multi.siblings( '.chosen' )
		for name, val of m.SingleView
			do ( name, val )->
				app.$single.children '[data-name="' + name + '"]'
				.appendTo app.$single.siblings( '.chosen' )
		$( '.multi-list, .multi-chosen, .single-list, .single-chosen' ).each -> $( this ).sortable "refresh"

	newModule: ->
		app.i = null
		app.module =
			name      : ''
			Taxo      : {}
			Meta      : {}
			MultiView : {}
			SingleView: {}
		app.initModule()

	modules: ->
		app.switchS 'modules'
		if appData.length
			app.$mods.html ''
			for i, mod of appData
				do ( i, mod )->
					app.$mods.append '<a i="' + i + '" class="btn pu-bg module">' + mod.name + '</a>'

	modTaxo: ->
		app.insertFieldCallback = ( name, example ) ->
			app.module.Taxo[name] = example
		app.insertFieldDlog 'New Taxonomy'

	modMeta: ->
		app.insertFieldCallback = ( name, example ) ->
			app.module.Meta[name] = example
		app.insertFieldDlog 'New Metadata field'

	insertFieldDlog: ( label = '' )->
		$( '#field-name' ).val ''
		$( '#field-value' ).val ''
		$( '.add-field' ).fadeIn().find( 'h2' ).html label;

	insertField: ()->
		$dlog = $ '.add-field'
		name = $( '#field-name' ).val()
		value = $( '#field-value' ).val()
		if ! name then return alert 'Please type name for the ' + $dlog.find( 'h2' ).html() + ', Like City/Email for a person.'
		if ! value then return alert 'Please type an example value for the ' + $dlog.find( 'h2' ).html() + ', Like Kerala for City or alex@example.com for Email'
		app.insertFieldCallback( name, value )
		app.initModule()
		$dlog.fadeOut();

	save: ->
		app.module.name = $( '#name' ).val()
		if null == app.i
			appData.push app.module
		else
			appData[app.i] = app.module
		app.saveAppData()
		app.modules()
app.init()
# Storing the object before closing the window
window.beforeunload = app.saveAppData
