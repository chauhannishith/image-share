import React, { Component } from'react'
import {Link} from 'react-router-dom'
import createProject from '../helpers/createProject'
import fetchUserProjects from '../helpers/fetchUserProjects'
import logOutUser from '../helpers/logOutUser'

class Home extends Component{

	constructor(props) {
		super(props)
		this.state ={
			projects: [],
			createForm: false
		}
	}
	createComponent(e) {
		e.preventDefault()
		createProject(this.refs.projectTitle.value)
		.then(response => {
			// console.log(response)
			if(response.data.success)
				this.componentDidMount()
		}).catch(error => console.log(error))

	}

	displayForm() {
		let value = !this.state.createForm
		this.setState({createForm: value})
	}

	renderForm() {
		return (
			<div>
				<form onSubmit={this.createComponent.bind(this)}>
					<input type="text" ref="projectTitle" placeholder="Title" />
					<input type="submit" value="Create" />
				</form>
				<button onClick={this.displayForm.bind(this)}>Cancel</button>
			</div>
			)
	}

	componentDidMount() {
		fetchUserProjects()
		.then(response => {
			// console.log(response.data.projects)
		 	this.setState({projects: response.data.projects})
		}).catch(error => console.log(error))

	}

	logout(){
		logOutUser()
		.then(response => {
			console.log(response)
		}).catch(err => console.log(err))
	}

	render() {
		const eachProject = this.state.projects.map((project, i) => {
			return(
				<li key={i} className="collection-item" >
					<Link to={{ pathname: '/projects', state: {projectId: project._id, projectTitle: project.title} }}>
						{project.title}
					</Link>
				</li>
				)
		})
		return (
			<div>
				<h1>HOME</h1>
				<a onClick={this.logout.bind(this)}>LogOut</a>
				
				<ul className="collection">
					{eachProject}
				</ul>
				<br />
				
				{this.state.createForm && this.renderForm()}
				{!this.state.createForm && <button onClick={this.displayForm.bind(this)} >Create New Project</button>}
			</div>
			);
	}
}

export default Home