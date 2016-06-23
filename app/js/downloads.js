module.exports = {
	torrentSelected: null,

	selectTr: elem => {
		if($('#table tbody td').hasClass('dataTables_empty')) return false 

		if (elem.hasClass('selected')) { 
			elem.removeClass('selected')
			$('#btns-hided').hide()
			torrentSelected = null
		} else {
			table.$('tr.selected').removeClass('selected')
			elem.addClass('selected')
			$('#btns-hided').show()
			torrentSelected = client.get(elem.data("hash")) 
		}

		return torrentSelected
	},

	torrent: {

		add: torrentID => {
			let temp = table.row.add([
				' ',
				locale.loading,
				'0 Kb/s',
				gui.progressBar(0, $('#table')),
				'0 Kb/s',
				'0 Kb/s',
				'0',
				'0',
				'-'
			]).draw()
			
			let torrent = client.add(torrentID,	{ path: $('#tb-add-folder').val() }, torrent => {  })

			torrent.on('infoHash', error => {
				$(temp.node()).attr('data-hash', torrent.infoHash)
				if(!torrents[torrent.infoHash]) torrents[torrent.infoHash] = new Torrent()
			})

			torrent.on('error', error => {
				temp.row().remove().draw()
				gui.setTray(false, 'red')
				alert(error)
				//TODO: cambiar el alert por:
				//dialog.showErrorBox(title, content)
			})

			torrent.on('done', () => gui.setTray(true, 'green'))

		},

		remove: row => {
			// TODO: Preguntar si esta seguro, y si quiere borrar los archivos tambien
			torrentSelected.destroy( () => {
				row.remove().draw()
				$('#btns-hided').hide()
				//if(client.torrents.length === 0) 
			})

		},

		pause: row => {
			$('#btn-pause i').toggleClass('fa-pause').toggleClass('fa-play')

			// NOTE: Pausa pero no funciona
			console.log(torrentSelected.paused)
			if(torrentSelected.paused) torrentSelected.resume()
			else torrentSelected.pause()
			console.log(torrentSelected.paused)
		},

	},

	gui: {
		addModal: ()=> {
			$('#addModal').modal('toggle')
			$('#tb-add-folder').val(settings.dir_downloads)
		},

		cast: ()=> {
			alert("cast file")
		},

		share: ()=> {
			alert("share file")
		},

		getDialogFile: ()=> {
			let config = {	title: 'Please select a torrent',
							filters: [{ name: 'Torrents', extensions: ['torrent'] }],
							defaultPath: settings.dir_downloads,
							properties: ['openFile']
						 }

			dialog.showOpenDialog(config, name => $('#tb-add-file').val(name))	
		},

		getDialogFolder: ()=> {
			let config = {  title: 'Please select a folder',
							defaultPath: settings.dir_downloads,
							properties: ['openDirectory', 'createDirectory']
						 }		

			dialog.showOpenDialog(config, name => $('#tb-add-folder').val(name))	
		},


	},

}



