import React, { Component } from 'react'
import DragnDrop from '../components/DragnDrop'
import fetchUploadedFiles from '../helpers/fetchUploadedFiles'
import shareProject from '../helpers/shareProject'
import { BACKEND } from '../utils/config'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			displayDrop: false,
			displayForm: false
		}
	}

	addMember(e) {
		shareProject(this.refs.email.value, this.props.location.state.projectId)
		.then(response => {
			if(response.data.success){
				console.log(response.data.message)
			}
			else{
				console.log(response.data.message)
			}
		})
		.catch(error => console.log(error))
		e.preventDefault()
	}

	componentDidMount() {
		setTimeout(() => this.fetchFiles(), 2000 )
		
	}

	fetchFiles() {
		fetchUploadedFiles(this.props.location.state.projectId)
		.then(response => {
			if(response.data.success){
				// console.log(response.data.files)
				this.setState({images: [...this.state.images,...response.data.files]})
			}
			else{
				console.log(response.data.message)
			}
		})
		.catch(error => console.log(error))
	}

	toggleShareForm() {
		let temp = !this.state.displayForm
		if(temp === true)
			document.getElementById('share').innerText = 'Cancel'
		else
			document.getElementById('share').innerText = 'Share'
		this.setState({displayForm: temp})
		
	}

	toggleState() {
		let temp = !this.state.displayDrop
		if(temp === true)
			document.getElementById('display').innerText = 'Hide'
		else
			document.getElementById('display').innerText = 'View'
		this.setState({displayDrop: temp})
	}

// {eachImage.length ? eachImage : <p>You have not added any images yet</p>}
// <div id="imgContainer">{this.state.images}</div>
	render() {
		const eachImage = this.state.images.map((image, i) => {
			return <img key={i} src={`${BACKEND}` + '/api/users/images/' + `${image.filename}`} alt="noimage.jpg" className="thumb" />
		})

		return (
			<div>
				<h1>{this.props.location.state.projectTitle}</h1>
				{this.state.displayForm && 
					<form onSubmit={this.addMember.bind(this)}>
						<input type="email" ref="email" placeholder="email" />
						<input type="submit" value="Add" />
					</form>
				}
				<button id="share" onClick={this.toggleShareForm.bind(this)}>Share</button>
				<br />
				{eachImage.length ? eachImage : <p>You have not added any images yet</p>}
				<br />
				<button id="display" onClick={this.toggleState.bind(this)}>View</button>	
				{this.state.displayDrop && <DragnDrop projectid={this.props.location.state.projectId} />}
			</div>
			)
	}

}

export default Project