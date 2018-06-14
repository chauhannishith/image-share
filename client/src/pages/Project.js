import React, { Component } from 'react'
import DragnDrop from '../components/DragnDrop'
import fetchUploadedFiles from '../helpers/fetchUploadedFiles'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			displayDrop: false
		}
	}

	componentDidMount() {
		this.fetchFiles()
	}

	fetchFiles() {
		fetchUploadedFiles(this.props.location.state.projectId)
		.then(response => {
			console.log(response.data)
			if(response.data){
				var reader = new FileReader();
				reader.onLoadend = () =>{
					this.setState({images: reader.result})
				}
				reader.readAsDataURL(response.data)
			}
			// this.setState({images: response.data})
		})
		.catch(error => console.log(error))
	}

	toggleState() {
		let temp = !this.state.displayDrop
		if(temp === true)
			document.getElementById('display').innerText = 'Hide'
		else
			document.getElementById('display').innerText = 'View'
		this.setState({displayDrop: temp})
	}

	render() {

		const eachImage = this.state.images.map((image, i) => {
			return <img src="{image}" alt="noimage.jpg" />
		})

		return (
			<div>
				<h1>{this.props.location.state.projectTitle}</h1>
				<h4>{this.props.location.state.projectId}</h4>
				{eachImage.length ? eachImage : <p>You have not added any images yet</p>}
				<button id="display" onClick={this.toggleState.bind(this)}>View</button>	
				{this.state.displayDrop && <DragnDrop projectid={this.props.location.state.projectId} />}
			</div>
			)
	}

}

export default Project