import React, { Component } from 'react'
import signUpUser from '../helpers/signUpUser'
import { getFromStorage } from '../utils/storage'

class SignUp extends Component {

	constructor(props){
		super(props)
		this.state ={
			signUpErrors: ''
		}
	}

	componentDidMount() {
		let token = getFromStorage('imageshare');
		if(token !== null){
			console.log("home")
			this.props.history.push('/home')
		}
	}

	onSubmit(e) {
		e.preventDefault();
		if(this.refs.email.value === '' || this.refs.fname.value === '' || 
			this.refs.lname.value === '' || this.refs.password.value === ''|| this.refs.cpassword.value === ''){
			alert('All values required')
		}
		else{
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
				// alert("Passwords do not match")
				this.setState({signUpErrors: 'Passwords do not match'})
				window.document.getElementById('cpassword').focus();
			}
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
			<div className="login-wrapper">
				<div className="form">
					{
					this.state.signUpErrors && 
						<div className="error-msg">
							<p>{this.state.signUpErrors}</p>
						</div>
					}
					<h1>SignUp to join others</h1>
					<form onSubmit={this.onSubmit.bind(this)} className="col s12">
						<div className="row">
					        <input 
						        id="first_name" 
						        type="text" 
						        ref="fname" 
						        placeholder="First Name" 
						        className="validate"  
						        required
					        />
					    </div>
					    <div className="row">
					          <input 
						          id="last_name" 
						          type="text" 
						          ref="lname" 
						          placeholder="Last Name" 
						          className="validate"  
						          required
					          />
					    </div>
						<div className="row">
					          <input 
						          id="email" 
						          type="email" 
						          className="validate" 
						          placeholder="Email" 
						          ref="email" 
						          required
					          />
					    </div>
					    <div className="row">
					          <input 
						          id="password" 
						          type="password" 
						          className="validate" 
						          placeholder="Password" 
						          ref="password" 
						          required
					          />
				        </div>
				        <div className="row">
					          <input 
						          id="cpassword" 
						          type="password" 
						          ref="cpassword" 
						          placeholder="Confirm Password" 
						          className="validate" 
						          required
					          />
				        </div>
				        <div className="row">
				        	<button className="btn" type="submit" name="action">Submit</button>
				        </div>
					</form>
				</div>
			</div>
		);
	}
}

export default SignUp