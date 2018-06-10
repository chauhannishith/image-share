import React, { Component} from 'react'
import FileDrop from 'react-file-drop'
import uploadFiles from '../helpers/uploadFiles'

class DragnDrop extends Component {

	constructor() {
		super()
		this.state = {
			attachments: null,//[],
			bool: true
		}
	}

	deleteFile(index){
		// console.log(index)
		let newArr = this.state.attachments
		newArr.splice(index, 1)
		this.setState({attachments: newArr})
	}

	handleDrop(files, event) {
		this.setState({attachments: files},() =>
			this.uploadHandler()
		)
	}

	fileHandler(e) {
		console.log("ok", e.target.files)
		this.setState({attachments: e.target.files}, () => this.setState({bool: false}))
	}

	uploadHandler() {
		const fd = new FormData()
		for(let i = 0; i < this.state.attachments.length; i++ )
			fd.append('image', this.state.attachments[i], this.state.attachments[i].name)
		console.log(fd.get('image'))
		uploadFiles(fd)
		.then(response => {console.log(response.data)
			if(response.data.success){
				console.log(response.data.message)
			}
			else{
				console.log(response.data.message)	
			}
			this.setState({bool: true}, () => this.setState.attachments: null)})
		.catch(error => console.log(error))
	}

	render() {

		return (
			<div>
				<div
				 id="file-drop"
				 style={{ border: '1px solid black', width: 600, margin: 'auto', color: 'black', padding: 20 }}>
					<FileDrop onDrop={this.handleDrop.bind(this)}>
						Drop some files here!
					</FileDrop>
					<h1> OR </h1>
					<input type="file" onChange={this.fileHandler.bind(this)} multiple name="files"/>
					<br />
					<button onClick={this.uploadHandler.bind(this)} id="upload" disabled={(this.state.bool ? "true" : undefined)}>Upload</button>
				</div>
				
			</div>
			);
	}
}

export default DragnDrop