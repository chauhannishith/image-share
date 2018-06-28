import React, { Component } from 'react'
import DragnDrop from '../components/DragnDrop'
import Group from '../components/Group'
import Image from '../components/Image'
import createSubGroup from '../helpers/createSubGroup'
import fetchUploadedFiles from '../helpers/fetchUploadedFiles'
import Loading from './Loading'
import shareProject from '../helpers/shareProject'
import { getFromStorage, removeFromStorage } from '../utils/storage'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			subgroups: [],
			displayDrop: false,
			displayShareForm: false,
			displayGroupForm: false,
			isLoading: true,
			shareError: '',
			shareSuccess: ''
		}
	}

	addMember(e) {
		if(this.refs.email.value !== '' || this.props.location.state.projectId !== ''){
			shareProject(this.refs.email.value, this.props.location.state.projectId)
			.then(response => {
				if(response.data.success){
					console.log(response.data.message)
					this.setState({shareSuccess: response.data.message})
					this.refs.email.value = ''
				}
				else{
					console.log(response.data.message)
					this.setState({shareError: response.data.message})
				}
			})
			.catch(error => console.log(error))	
		}
		else{
			
		}
		
		e.preventDefault()
	}

	componentDidMount() {
	let token = getFromStorage('imageshare');
		if(token !== null){
			setTimeout(() => this.fetchFiles(), 2000 )
		}else{
			this.props.history.push('/')
		}
		
	}

	createGroup(e) {
		console.log('create group', this.refs.groupname.value)
		if(this.props.location.state.projectId !== '' || this.refs.groupname.value !== ''){
			createSubGroup(this.props.location.state.projectId, this.refs.groupname.value)
			.then(response => {
				if(response.data.success){
					 console.log(response.data.message)
					 this.props.history.push('/home')
				}
				else{
					console.log(response.data.message)
				}
			})
			.catch(error => console.log(error))
		}
		else{
			this.props.history.push('/')
		}
		e.preventDefault()
	}

	fetchFiles() {
		if(this.props.location.state.projectId !== ''){
			fetchUploadedFiles(this.props.location.state.projectId)
			.then(response => {
				if(response.data.redirect){
						removeFromStorage('imageshare')
						this.props.history.push('/')
				}
				if(response.data.success){
					// console.log(response.data.files)
					this.setState({images: [...this.state.images,...response.data.files]}, () => {
						this.setState({subgroups: [...this.props.location.state.groups]},()=> {
								this.setState({isLoading: false})
							})
					})
				}
				else{
					console.log(response.data.message)
					this.setState({isLoading: false})
				}
			})
			.catch(error => console.log(error))	
		}
		else{
			this.props.history.push('/')
		}
	}

	goBack() {
		this.props.history.goBack()
	}

	logout(){
		removeFromStorage('imageshare')
		this.props.history.push('/')
	}

	toggleCreateGroup(e) {
		let temp = !this.state.displayGroupForm
		// if(temp === true)
		// 	e.target.value = 'Cancel'// document.getElementById('group').innerText = 'Cancel'
		// else
		// 	e.target.value = 'Create Subgroup'// document.getElementById('group').innerText = 'Create'
		this.setState({displayGroupForm: temp})
		
	}

	toggleShareForm(e) {
		let temp = !this.state.displayShareForm
		// if(temp === true)
		// 	e.target.textContent = 'Cancel'// document.getElementById('share').innerText = 'Cancel'
		// else
		// 	e.target.textContent = 'Share'// document.getElementById('share').innerText = 'Share'
		this.setState({displayShareForm: temp}, () => {
			this.setState({shareError: ''}, () => {
				this.setState({shareSuccess: ''})
			})
		})
		
	}

		// const eachImage = this.state.images.map((image, i) => {
		// 	if(image.metadata.subgroup !== null){
		// 		return (
		// 			<Image key={i} source={image} />
		// 			)
		// 	}
		// 	else{
		// 		return null
		// 	}
		// })

	render() {

		const eachImage = this.state.images.filter((image) => {
			if(image.metadata.subgroup !== "null")
				return false
			else
				return true
		}).map((image, i) => {
			return <Image key={i} source={image} />
		})

		const eachGroup = this.state.subgroups.map((group, i) => {
			return (
				<li key={i}>
					<h3>
						{group.groupTitle}
					</h3>
					<Group projectId={this.props.location.state.projectId} groupTitle={group.groupTitle}
						images={this.state.images} />
				</li>
			)
		})

		return (
			<div>
				<div className="navbar">
					<a onClick={this.goBack.bind(this)} >GoBack</a>
					<a onClick={this.logout.bind(this)}>LogOut</a>
				</div>
				<div className="project">
					<div className="project-header">
						<h1 className="project-title">{this.props.location.state.projectTitle}</h1>
						<div className="display-share-form">
							{this.state.shareError && 	
								<div className="share-error-msg">
									{this.state.shareError}
								</div>
							}
							{this.state.shareSuccess && 	
								<div className="share-success-msg">
									{this.state.shareSuccess}
								</div>
							}
							{this.state.displayShareForm && 
								<form onSubmit={this.addMember.bind(this)}>
									<input className="share-from-text" type="email" ref="email" placeholder="email" required />
									<input className="btn-gshare" type="submit" value="Add" />
									<input type="button"
									 className="btn-gshare" 
									 onClick={this.toggleShareForm.bind(this)} 
									 value="Cancel" 
									/>
								</form>
							}
							{!this.state.displayShareForm &&
								<a id="share" className="btn-share" onClick={this.toggleShareForm.bind(this)}>Share</a>}
							
						</div>
			
                    </div>
                   	<hr />
                    <div className="display-group-form">
						{this.state.displayGroupForm &&
						    <form onSubmit={this.createGroup.bind(this)}>
						    	<input className="share-from-text" type="text" ref="groupname" placeholder="Group title" required />
								<input className="btn-group" type="submit" value="Create" />
								<input type="button"
								    className="btn-group"
									onClick={this.toggleCreateGroup.bind(this)}
									value="Cancel"
								/>
							</form>
						}

						{!this.state.displayGroupForm &&
							<input type="button"
								className="btn-group"
								onClick={this.toggleCreateGroup.bind(this)}
								value="Create subgroup"
							/>
						}

					</div>
					<div className="project-container">
						<ul>
							{eachGroup}
						</ul>
						<hr />
						<div className="image-grid">
							{this.state.isLoading ?
								<Loading /> :
								(eachImage.length ? eachImage :<p>You have not added any images yet</p>)
							}
						</div>
						<DragnDrop projectid={this.props.location.state.projectId} />
					</div>
				</div>
			</div>
		)
	}

}

export default Project