import React, { Component } from 'react'
import DragnDrop from './DragnDrop'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			displayDrop: true
		}
	}

	toggleState() {
		let temp = !this.state.displayDrop
		this.setState({displayDrop: temp})
	}

	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
				<button onClick={this.toggleState.bind(this)}>Add files</button>	
				{this.state.displayDrop && <DragnDrop />}
			</div>
			)
	}

}

export default Project