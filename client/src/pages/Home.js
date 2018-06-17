import React, { Component } from'react'
import {Link} from 'react-router-dom'
import Loading from './Loading'
import createProject from '../helpers/createProject'
import fetchUserProjects from '../helpers/fetchUserProjects'
import fetchSharedProjects from '../helpers/fetchSharedProjects'
import { getFromStorage, removeFromStorage } from '../utils/storage'

class Home extends Component{

	constructor(props) {
		super(props)
		this.state ={
			projects: [],
			sharedProjects: [],
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
				if(response.data.redirect){
					removeFromStorage('imageshare')
					this.props.history.push('/')
				}
				else{
			 		this.setState({projects: response.data.projects}, () => this.setState({isLoading: false}))
				}
			 	fetchSharedProjects()
			 	.then(response => {
			 		this.setState({sharedProjects: response.data.sharedProjects})
			 	})
			 	.catch(err => console.log(err))
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
				<li key={i} className="collection-item" >
					<Link to={{ pathname: '/projects', state: {projectId: project._id, projectTitle: project.title} }}>
						{project.title}
					</Link>
				</li>
				)
		})

		const eachSharedProject = this.state.sharedProjects.map((sproject, i) => {
			return(
				<li key={i} className="collection-item" >
					<Link to={{ pathname: '/projects', state: {projectId: sproject._id, projectTitle: sproject.title} }}>
						{sproject.title}
					</Link>
				</li>
				)
		})

		if(this.state.isLoading)
			return <Loading />

		return (
			<div>
				<h1>HOME</h1>
				<a onClick={this.logout.bind(this)}>LogOut</a>
				<h1>Your Projects</h1>
				<ul className="collection">
					{eachProject.length ? eachProject : <p>You haven't created any project yet</p>}
				</ul>
				{this.state.createForm && this.renderForm()}
				<br />
				<h1>Projects shared with you</h1>
				<ul className="collection">
					{eachSharedProject.length ? eachSharedProject : <p>You haven't created any project yet</p>}
				</ul>
				
				{!this.state.createForm && <button onClick={this.displayForm.bind(this)} >Create New Project</button>}
			</div>
			);
	}
}

export default Home