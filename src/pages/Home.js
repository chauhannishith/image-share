import React, { Component } from'react'
import {Link} from 'react-router-dom'
import Loading from './Loading'
import createProject from '../helpers/createProject'
import fetchUserProjects from '../helpers/fetchUserProjects'
import fetchUserTags from '../helpers/fetchUserTags'
import fetchSharedProjects from '../helpers/fetchSharedProjects'
import { getFromStorage, removeFromStorage } from '../utils/storage'

class Home extends Component{

	constructor(props) {
		super(props)
		this.state ={
			projects: [],
			tags: [],
			sharedProjects: [],
			createForm: false,
			isLoading: true
		}
	}
	createComponent(e) {
		e.preventDefault()
		if(this.refs.projectTitle.value !== ''){
			createProject(this.refs.projectTitle.value)
			.then(response => {
				// console.log(response)
				if(response.data.success){
					this.setState({createForm: false}, () => {
						this.componentDidMount()
					})
				}else{
					console.log(response.data.message)
				}
			}).catch(error => console.log(error))	
		}
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
			 		// console.log(response.data)
			 		if(response.data.success){
			 			this.setState({sharedProjects: response.data.sharedProjects})
			 		}
			 		else{
			 			console.log(response.data.message)
			 		}
			 	})
			 	.catch(err => console.log(err))
			 	fetchUserTags()
			 	.then(response => {
			 		if(response.data.success){
			 			this.setState({tags: response.data.tags.tag})
			 		}
			 		else{
			 			console.log(response.data.message)
			 		}
			 		// console.log("Tags" + JSON.stringify(response.data))
			 	})
			 	.catch(error => console.log(error))
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
			<div className="display-share-form">
				<form onSubmit={this.createComponent.bind(this)}>
					<input
						className="share-from-text"
						type="text"
						ref="projectTitle" 
						placeholder="Title" />
					<div>
						<input
							className="btn-gshare"
							type="submit"
							value="Add"
						/>
						<input 
							type="button" 
							className="btn-gshare" 
							onClick={this.displayForm.bind(this)} 
							value="Cancel" 
						/>
					</div>
				</form>
			</div>
			
			)
	}

	render() {
		const eachProject = this.state.projects.map((project, i) => {
			return(
				<li key={i} className="collection-item" >
					<Link
					 to={{ pathname: '/projects',
					  state: {projectId: project._id, projectTitle: project.title, groups: project.subgroups} 
					}}>
						{project.title}
					</Link>
				</li>
				)
		})

		const eachSharedProject = this.state.sharedProjects.map((sproject, i) => {
			return(
				<li key={i} className="collection-item" >
					<Link to={{ pathname: '/projects',
					 state: {projectId: sproject._id, projectTitle: sproject.title, groups: sproject.subgroups}
					}}>
						{sproject.title}
					</Link>
				</li>
				)
		})

		const allTags  = this.state.tags.map((tag, i) => { 
			// console.log(tag)
			return (
				<li key={i} className="collection-item" >
					<Link to={{ pathname: '/tag', state: {tagdata: tag} }}>
						{tag.tagname}
					</Link>
				</li>
				)
		})

		if(this.state.isLoading)
			return <Loading />

		return (
			<div>
				<div className="navbar">
					<div>
					</div>
					<a onClick={this.logout.bind(this)}>LogOut</a>
				</div>
				<div className="wrapper">
					<div className="home-grid">
						<div className="list-box">
							<h1>Your tags</h1>
							<ul>
								{allTags.length ? allTags : <p>You have no tags</p>}
							</ul>
						</div>
						<div className="list-box">
							<h1>Your Projects</h1>
							<ul className="collection">
								{eachProject.length ? eachProject : <p>You haven't created any project yet</p>}
							</ul>
							{!this.state.createForm && 
								<input type="button" className="btn-small" 
									onClick={this.displayForm.bind(this)} 
									value="Create New Project"
								/>
							}
							{this.state.createForm && this.renderForm()}
						</div>
						<div className="list-box">
							<h1>Projects shared with you</h1>
							<ul className="collection">
								{eachSharedProject.length ? eachSharedProject : <p>You don't have any shared project yet</p>}
							</ul>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default Home