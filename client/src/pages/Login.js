import React, { Component } from 'react'

class Home extends Component{

	onSubmit(e) {
		const user = {
			email: this.refs.email.value,
			password: this.refs.password.value
		}
		this.submitUser(user)
		e.preventDefault();
	}

	submitUser(user) {
		//make call to backend
	}

	render() {
		return(
			<div>
				<h1>Please login to continue</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<label>Email</label>
					<input type="text" ref="email" required/>
					<br />
					<label>Password</label>
					<input type="password" ref="password" required/>
					<br />
					<input type="submit" value="Signin" />
					<br />
					<label>New user? <a href="/signup">Signup</a> instead</label>
				</form>
			</div>
		);
	}
}

export default Home