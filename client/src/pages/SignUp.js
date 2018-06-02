import React, { Component } from 'react'

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
		alert("hello " + user.email)
	}

	render() {
		return (
			<div>
				<h1>SignUp to join others</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<label>Email</label>
					<input type="email" ref="email" required/>
					<br />
					<label>First name</label>
					<input type="text" ref="fname" required/>
					<br />
					<label>Last name</label>
					<input type="text" ref="lname" required/>
					<br />
					<label>Password</label>
					<input type="password" ref="password" required/>
					<br />
					<label>Confirm Password</label>
					<input type="password" ref="cpassword" required/>
					<br />
					<input type="submit" value="SignUp" />
				</form>
			</div>
		);
	}
}

export default SignUp