import React, { Component } from 'react'
import signUpUser from '../helpers/signUpUser'
import { getFromStorage } from '../utils/storage'

class SignUp extends Component {

	componentDidMount() {
		let token = getFromStorage('imageshare');
		if(token !== null){
			console.log("home")
			this.props.history.push('/home')
		}
	}

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
		.then(response => {
			console.log(response.data)
			if(response.data.success){
				this.props.history.push('/verified')
			}
			else{
				console.log(response.data.message)
			}
		})
		.catch(error => console.log(error))
	}

	render() {
		return (
			<div>
				<h1>SignUp to join others</h1>
				<form onSubmit={this.onSubmit.bind(this)} className="col s12">
					<div className="row">
				        <div className="input-field col s3">
				          <input id="first_name" type="text" ref="fname"  className="validate"  required/>
				          <label htmlFor="first_name">First Name</label>
				        </div>
				        <div className="input-field col s3">
				          <input id="last_name" type="text" ref="lname"  className="validate"  required/>
				          <label htmlFor="last_name">Last Name</label>
				        </div>
				    </div>
					<div className="row">
				        <div className="input-field col s6">
				          <input id="email" type="email" className="validate"  ref="email" required/>
				          <label htmlFor="email">Email</label>
				        </div>
				    </div>
				    <div className="row">
				        <div className="input-field col s6">
				          <input id="password" type="password" className="validate" ref="password" required/>
				          <label htmlFor="password">Password</label>
			        	</div>
			        </div>
			        <div className="row">
				        <div className="input-field col s6">
				          <input id="cpassword" type="password" ref="cpassword"  className="validate" required/>
				          <label htmlFor="password">Confirm Password</label>
			        	</div>
			        </div>
			        <div className="row">
			        	<button className="btn waves-effect waves-light" type="submit" name="action">Submit</button>
			        </div>
				</form>
			</div>
		);
	}
}

export default SignUp