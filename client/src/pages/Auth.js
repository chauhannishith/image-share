import React, { Component } from 'react'
import { setInStorage } from '../utils/storage'
import Loading from './Loading'

class Auth extends Component{

	constructor() {
		super()
		this.state ={
			isLoading: true,
		}
	}

	componentDidMount() {
		let token = this.props.match.params.id
		console.log(token)
		setInStorage('imageshare', token)
		this.props.history.push('/home')
	}

	render() {

		if(this.state.isLoading)
			return <Loading />

	}
}

export default Auth