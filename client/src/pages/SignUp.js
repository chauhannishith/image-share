import React, { Component } from 'react'
import signUpUser from '../helpers/signUpUser'

class SignUp extends Component {
	onSubmit(e) {
		e.preventDefault();
		if(this.refs.password.value === this.refs.cpassword.value){
			const user ={
				email: this.refs.email.value,
				firstname: this.refs.fname.value,
				lastname: this.refs.lname.value,
				password: this.refs.password.value
			}
			this.createUser(user)
		}
		else{
			alert("Passwords do not match")
			window.document.getElementById('cpassword').focus();
		}
	}

	createUser(user){
		//make remote call
		signUpUser(user)
		.then(response => console.log(response))
		.catch(error => console.log(error))
	}

	render() {
		return (
			<div>
				<h1>SignUp to join others</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<input type="email" ref="email" placeholder="Email" required/>
					<br />
					<input type="text" ref="fname" placeholder="First Name" required/>
					<br />
					<input type="text" ref="lname" placeholder="Last Name" required/>
					<br />
					<input type="password" ref="password" placeholder="Password" required/>
					<br />
					<input type="password" ref="cpassword" placeholder="Confirm Password" required/>
					<br />
					<input type="submit" value="SignUp" />
				</form>
			</div>
		);
	}
}

export default SignUp