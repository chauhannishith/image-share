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
//http://localhost:3001
	render() {

		if(this.state.isLoading)
			return <Loading />

		return(
			<div className="login-wrapper">
			
				<div className="form">
					<h1>Please login to continue</h1>
					{
					this.state.signinerror && 
						<div className="error-msg">
							<p>{this.state.signinerror}</p>
						</div>
					}
					<form onSubmit={this.onSubmit.bind(this)}>
						<div className="row">
					        <input id="email" placeholder="Email" type="email" className="validate"  ref="email" required/>
					    </div>
					    <div className="row">
					        <input id="password" placeholder="Password" type="password" className="validate" ref="password" required/>
				        </div>
				        <div className="row">
				        	<button type="submit" className="btn" name="action">Submit</button>
				        </div>
				        <a href="https://groupphotos.herokuapp.com/api/users/auth/google"><img alt="Google" className="google-btn" src="/google.png"/></a>
						<p>New user? <a href="/signup">Signup</a> instead</p>
					</form>
				</div>
				
			</div>
		);
	}
}

export default Login