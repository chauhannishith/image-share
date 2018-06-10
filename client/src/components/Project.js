import React, { Component } from 'react'
import DragnDrop from './DragnDrop'

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
	}

	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
				<button id="display" onClick={this.toggleState.bind(this)}>View</button>	
				{this.state.displayDrop && <DragnDrop />}
			</div>
			)
	}

}

export default Project