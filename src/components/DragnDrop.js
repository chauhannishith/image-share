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
			uploadError: '',
			uploadStatus: ''
		}
	}

	deleteFile(index){
		// console.log(index)
		let newArr = this.state.attachments
		newArr.splice(index, 1)
		this.setState({attachments: newArr})
	}

	handleDrop(files, event) {
		this.setState({upladStatus: ''}, () => this.setState({uploadError: ''}))
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

	toggleState(e) {
		this.setState({upladStatus: ''}, () => this.setState({uploadError: ''}))
		let temp = !this.state.displayDrop
		if(temp === true)
			e.target.textContent="Hide"//document.getElementById('display').innerText = 'Hide'
		else
			e.target.textContent="Upload"// document.getElementById('display').innerText = 'Upload'
		this.setState({displayDrop: temp})
	}

	uploadHandler() {
		this.setState({uploading: true}, () => this.setState({bool: true}))
		const fd = new FormData()
		fd.append('projectId', this.props.projectid)
		var subgroup = this.props.subgroup || null
		fd.append('subgroup', subgroup)
		// fd.append('userId', userId)
		// console.log(this.props.projectid)
		for(let i = 0; i < this.state.attachments.length; i++ )
			fd.append('image', this.state.attachments[i], this.state.attachments[i].name)
		// console.log(fd.get('image'))
		uploadFiles(fd)
		.then(response => {
			console.log(response.data.message)
			if(response.data.success){
				// console.log(response.data.message)
				this.setState({uploadStatus: response.data.message}, () => this.setState({uploading: false}))
			}
			else{
				console.log(response.data.message)
				this.setState({uploadError: response.data.message}, () => this.setState({uploading: false}))	
			}
			this.setState({attachments: null})
			window.location.reload()
		})
		.catch(error => console.log(error))
	}
// style={{ border: '1px solid black', width: 600, margin: 'auto', color: 'black', padding: 20 }}
	render() {

		return (
			<div className="dragndrop">
				<button className="btn-small" id="display" onClick={this.toggleState.bind(this)}>Upload</button>
				{this.state.displayDrop &&
					<div>
						{this.state.uploading ? 
							<div className="loader">
						    	
							</div>:<p></p>
						}
						<div className="upload">
							{this.state.uploadStatus && 
								<div className="share-success-msg">
									{this.state.uploadStatus}
								</div>
							}

							{this.state.uploadError && 
								<div className="share-error-msg">
									{this.state.uploadError}
								</div>
							}
						</div>
						
						<div id="file-drop" className="file-drop-area">
							<FileDrop onDrop={this.handleDrop.bind(this)}>
								Drop some files here!
							</FileDrop>
							<h1> OR </h1>
							<div className="pick-files">
								<input
								 className="btn-small" 
								 type="file" 
								 onChange={this.fileHandler.bind(this)} 
								 multiple 
								 name="files"
								/>
								<button
								 className="btn-small" 
								 onClick={this.uploadHandler.bind(this)} 
								 id="upload" 
								 disabled={(this.state.bool ? "true" : undefined)}
								>Upload</button>
							</div>
						</div>
					</div>
				}
			</div>
			);
	}
}

export default DragnDrop