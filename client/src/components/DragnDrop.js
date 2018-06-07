import React, { Component} from 'react'
import FileDrop from 'react-file-drop'

class DragnDrop extends Component {

	constructor() {
		super()
		this.state = {
			attachments: [],
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
		// console.log(files);
		this.setState({ attachments: [...this.state.attachments, ...files]},() => {
			console.log(this.state.attachments)
			this.setState({bool: false})
		})
		
	}

	render() {
		const eachFile = this.state.attachments.map((file, i) => {
			return (
				<li key={i} index={i}>
					{file.name}
					<button onClick={this.deleteFile.bind(this, i)}>Delete</button>
				</li>
				)
		})

		return (
			<div>
				<div
				 id="file-drop"
				 style={{ border: '1px solid black', width: 600, margin: 'auto', color: 'black', padding: 20 }}>
					<FileDrop onDrop={this.handleDrop.bind(this)}>
						Drop some files here!
					</FileDrop>
				</div>
				<ul>
					{eachFile}
				</ul>
				<button id="upload" disabled={(this.state.bool ? "true" : undefined)}>Upload</button>
			</div>
			);
	}
}

export default DragnDrop