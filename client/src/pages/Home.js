import React, { Component } from'react'
import logOutUser from '../helpers/logOutUser'
import DragnDrop from '../components/DragnDrop'

class Home extends Component{

	logout(){
		logOutUser()
		.then(response => {
			console.log(response)
		}).catch(err => console.log(err))
	}

	render() {

		return (
			<div>
				<h1>HOME</h1>
				<a onClick={this.logout.bind(this)}>LogOut</a>
				<button >Create New Project</button>
				<br />
				<DragnDrop />
			</div>
			);
	}
}

export default Home