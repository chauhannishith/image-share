import React, { Component } from'react'
import logOutUser from '../helpers/logOutUser'
import Project from '../components/Project'

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
		this.setState({projects: [...this.state.projects, {title: this.refs.projectTitle.value}]},
		 () => this.displayForm())
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

	// componentDidMount() {
	//	fetchUserProjects(userId)
	// 	.then(response => {
	// //	 	this.setState({projects: response.data})			
	// 	}).catch(error => console.log(error))

	// }

	// fetchUserProjects(userId) {

	// }

	logout(){
		logOutUser()
		.then(response => {
			console.log(response)
		}).catch(err => console.log(err))
	}

	render() {
		const eachProject = this.state.projects.map((project, i) => {
			return <Project key={i} title={project.title} />
		})
		return (
			<div>
				<h1>HOME</h1>
				<a onClick={this.logout.bind(this)}>LogOut</a>
				<br />
				{eachProject}
				<br />
				{this.state.createForm && this.renderForm()}
				{!this.state.createForm && <button onClick={this.displayForm.bind(this)} >Create New Project</button>}
			</div>
			);
	}
}

export default Home