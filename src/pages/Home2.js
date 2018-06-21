import React, { Component } from'react'
import Project from '../components/Project'
import Loading from './Loading'
import createProject from '../helpers/createProject'
import fetchUserProjects from '../helpers/fetchUserProjects'
import { getFromStorage, removeFromStorage } from '../utils/storage'

class Home extends Component{

	constructor(props) {
		super(props)
		this.state ={
			projects: [],
			createForm: false,
			isLoading: true
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

	componentDidMount() {
		let token = getFromStorage('imageshare');
		if(token !== null){
			fetchUserProjects()
			.then(response => {
				if(response.data.redirect)
					this.props.history.push('/')
				else
			 		this.setState({projects: response.data.projects}, () => this.setState({isLoading: false}))
			}).catch(error => console.log(error))
		}else{
			this.props.history.push('/')
		}
	}

	logout(){
		removeFromStorage('imageshare')
		this.props.history.push('/')
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

	render() {
		const eachProject = this.state.projects.map((project, i) => {
			return(
				<li key={i}>
			      <div className="collapsible-header">{project.title}</div>
			      <div className="collapsible-body">
			      	<Project projectId={project._id} projectTitle={project.title}/>
			      </div>
				</li>
				)
		})

		if(this.state.isLoading)
			return <Loading />

		return (
			<div>
				<h1>HOME</h1>
				<a onClick={this.logout.bind(this)}>LogOut</a>
				
				<ul className="collapsible">
					{eachProject.length ? eachProject : <p>You haven't created any project yet</p>}
				</ul>
				<br />
				
				{this.state.createForm && this.renderForm()}
				{!this.state.createForm && <button onClick={this.displayForm.bind(this)} >Create New Project</button>}
			</div>
			);
	}
}

export default Home