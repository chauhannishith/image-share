import React, { Component } from 'react'
import DragnDrop from '../components/DragnDrop'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			displayDrop: false
		}
	}

	toggleState() {
		let temp = !this.state.displayDrop
		if(temp === true)
			document.getElementById('display').innerText = 'Hide'
		else
			document.getElementById('display').innerText = 'View'
		this.setState({displayDrop: temp})
		console.log(this.props.location.state.projectid)
	}

	render() {

		const eachImage = this.state.images.map((image, i) => {
			return <img src="" alt="noimage.jpg" />
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