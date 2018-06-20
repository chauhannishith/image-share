import React, { Component } from 'react'
import DragnDrop from '../components/DragnDrop'
import Group from '../components/Group'
import Image from '../components/Image'
import createSubGroup from '../helpers/createSubGroup'
import fetchUploadedFiles from '../helpers/fetchUploadedFiles'
import Loading from './Loading'
import shareProject from '../helpers/shareProject'
// import { BACKEND } from '../utils/config'

class Project extends Component{
	constructor(props) {
		super(props)
		this.state ={
			images: [],
			subgroups: [],
			displayDrop: false,
			displayShareForm: false,
			displayGroupForm: false,
			isLoading: true
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

	createGroup(e) {
		console.log('create group', this.refs.groupname.value)
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
		e.preventDefault()
	}

	fetchFiles() {
		fetchUploadedFiles(this.props.location.state.projectId)
		.then(response => {
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

	goBack() {
		this.props.history.goBack()
	}

	toggleCreateGroup() {
		let temp = !this.state.displayGroupForm
		if(temp === true)
			document.getElementById('group').innerText = 'Cancel'
		else
			document.getElementById('group').innerText = 'Create'
		this.setState({displayGroupForm: temp})
		
	}

	toggleShareForm() {
		let temp = !this.state.displayShareForm
		if(temp === true)
			document.getElementById('share').innerText = 'Cancel'
		else
			document.getElementById('share').innerText = 'Share'
		this.setState({displayShareForm: temp})
		
	}

	render() {
		const eachImage = this.state.images.map((image, i) => {
			if(!image.metadata.subgroup){
				return (
					<Image key={i} source={image} />
					)
			}
			else{
				return null
			}
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
			<button onClick={this.goBack.bind(this)} >GoBack</button>
				<h1>{this.props.location.state.projectTitle}</h1>
				{this.state.displayShareForm && 
					<form onSubmit={this.addMember.bind(this)}>
						<input type="email" ref="email" placeholder="email" required />
						<input type="submit" value="Add" />
					</form>
				}
				<button id="share" onClick={this.toggleShareForm.bind(this)}>Share</button>
				<hr />
				<br />
				{this.state.displayGroupForm && 
					<form onSubmit={this.createGroup.bind(this)}>
						<input type="text" ref="groupname" placeholder="Group title" required />
						<input type="submit" value="Create" />
					</form>
				}
				<button id="group" onClick={this.toggleCreateGroup.bind(this)}>Create subgroup</button>
				<br />
				<ul>
					{eachGroup}
				</ul>
				<hr />
				{this.state.isLoading ? <Loading /> : 
					(eachImage.length ? eachImage : <p>You have not added any images yet</p>)
				}
				<br />
				<DragnDrop projectid={this.props.location.state.projectId} />
			</div>
			)
	}

}

export default Project