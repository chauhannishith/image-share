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
					<input type="text" ref="email" />
					<br />
					<label>Password</label>
					<input type="password" ref="password" />
					<br />
					<input type="submit" value="Signin" />
					New user? <a href="/signup">Signup</a> instead
				</form>
			</div>
		);
	}
}

export default Home