import React, { Component} from 'react'
import axios from 'axios'
import FileDrop from 'react-file-drop'
import { BACKEND } from '../utils/config'

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
		this.setState({attachments: files}, () => this.setState({bool: false}))
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
		axios.post(BACKEND + '/api/users/upload', fd, {
			onUploadProgress: progressEvent => {
				console.log('Upload Progress' + Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%')
			}
		})
		.then(response => console.log(response))
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
				</div>
				<button onClick={this.uploadHandler.bind(this)} id="upload" disabled={(this.state.bool ? "true" : undefined)}>Upload</button>
			</div>
			);
	}
}

export default DragnDrop