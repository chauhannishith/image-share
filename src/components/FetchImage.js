import React, { Component } from 'react'
import Image from './Image'
import fetchFileTagBased from '../helpers/fetchFileTagBased'

class FetchImage extends Component {

	constructor(props){
		super(props)
		this.state ={
			file: [],
			fetched: false
		}
	}

	componentDidMount() {
		// console.log(this.props.filename)
		fetchFileTagBased(this.props.filename)
			.then(response => {
				// console.log(response.data)
				if(response.data.success){
					this.setState({file: response.data.file}, ()=> this.setState({fetched: true}))
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
				{this.state.fetched && <Image source={this.state.file} />}
			</div>
			)
	}

}

export default FetchImage