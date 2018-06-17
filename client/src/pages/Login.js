import React, { Component } from 'react'
import loginUser from '../helpers/loginUser'
import { getFromStorage, setInStorage } from '../utils/storage'
import Loading from './Loading'

class Login extends Component{

	constructor() {
		super()
		this.state ={
			isLoading: false,
			signinerror: ''
		}
	}

	componentDidMount() {
		let token = getFromStorage('imageshare')
		if(token)
			this.props.history.push('/home')
		else{
			this.setState({isLoading:false})
		}
	}

	onSubmit(e) {
		const user = {
			email: this.refs.email.value,
			password: this.refs.password.value
		}
		this.submitUser(user)
		e.preventDefault();
	}

	submitUser(user) {
		this.setState({isLoading: true})
		//make call to backend
		loginUser(user)
		.then(response => {
			// console.log(response.data)
			if(response.data.success){
				setInStorage('imageshare', response.data.token)
				this.props.history.push('/home')
			}
			else{
				console.log(response.data.message)
				this.setState({signinerror: response.data.message})
			}
		})
		.catch(error => {
			console.log(error)
		})
		this.setState({isLoading: false})
	}

	render() {

		if(this.state.isLoading)
			return <Loading />

		return(
			<div>
				<h1>Please login to continue</h1>
				{this.state.signinerror}
				<form onSubmit={this.onSubmit.bind(this)} className="col s12">
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
			        	<button className="btn waves-effect waves-light" type="submit" name="action">Submit</button>
			        </div>
			        <a href="http://localhost:3001/api/users/auth/google">Signin with google</a>
					<label>New user? <a href="/signup">Signup</a> instead</label>
				</form>
			</div>
		);
	}
}

export default Login