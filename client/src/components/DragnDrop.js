import React, { Component} from 'react'
import FileDrop from 'react-file-drop'
import uploadFiles from '../helpers/uploadFiles'

class DragnDrop extends Component {

	constructor() {
		super()
		this.state = {
			attachments: null,
			bool: true,// to disable the upload button
			uploading: false,// to display status of files uploaded
			displayDrop: false,
		}
	}

	deleteFile(index){
		// console.log(index)
		let newArr = this.state.attachments
		newArr.splice(index, 1)
		this.setState({attachments: newArr})
	}

	handleDrop(files, event) {
		this.setState({attachments: files},() =>{
			this.setState({uploading: true}, () => {
				this.uploadHandler()
			})
		})
	}

	fileHandler(e) {
		// console.log("ok", e.target.files)
		// console.log(this.props.projectid)
		this.setState({attachments: e.target.files}, () => this.setState({bool: false}))
	}

	toggleState() {
		let temp = !this.state.displayDrop
		if(temp === true)
			document.getElementById('display').innerText = 'Hide'
		else
			document.getElementById('display').innerText = 'View'
		this.setState({displayDrop: temp})
	}

	uploadHandler() {
		const fd = new FormData()
		fd.append('projectId', this.props.projectid)
		var subgroup = this.props.subgroup || null
		fd.append('subgroup', subgroup)
		// fd.append('userId', userId)
		// console.log(this.props.projectid)
		for(let i = 0; i < this.state.attachments.length; i++ )
			fd.append('image', this.state.attachments[i], this.state.attachments[i].name)
		console.log(fd.get('image'))
		uploadFiles(fd)
		.then(response => {
			console.log(response.data)
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
				<button id="display" onClick={this.toggleState.bind(this)}>View</button>
				{this.state.displayDrop &&
				<div>
					{this.state.uploading? <div className="progress">
					    <div className="indeterminate"></div>
					</div>:<p>hi</p>}

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
				}
			</div>
			);
	}
}

export default DragnDrop