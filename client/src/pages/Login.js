import React, { Component } from 'react'
import loginUser from '../helpers/loginUser'
import { getFromStorage, setInStorage } from '../utils/storage'
import Loading from './Loading'

class Home extends Component{

	constructor() {
		super()
		this.state ={
			isLoading: false
		}
	}

	onSubmit(e) {
		const user = {
			email: this.refs.email.value,
			password: this.refs.password.value
		}
		this.submitUser(user)
		document.getElementById('submit').setAttribute('disabled',true)
		e.preventDefault();
	}

	submitUser(user) {
		//this.setState({isLoading: true})
		//make call to backend
		loginUser(user)
		.then(response => {
			console.log(response)
			this.props.history.push('/home')
		})
		.catch(error => console.log(error))
		document.getElementById('submit').setAttribute('disabled',true)
	}

	render() {
		return(
			<div>
				<h1>Please login to continue</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<input type="text" ref="email" placeholder="Email" required />
					<br />
					<input type="password" ref="password" placeholder="Password" required />
					<br />
					<input type="submit" id="submit" value="Signin" />
					<br />
					<label>New user? <a href="/signup">Signup</a> instead</label>
				</form>
			</div>
		);
	}
}

export default Home