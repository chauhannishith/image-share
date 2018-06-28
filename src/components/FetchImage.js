import React, { Component } from 'react'
import Image from './Image'
import fetchFileTagBased from '../helpers/fetchFileTagBased'

class FetchImage extends Component {

	constructor(props){
		super(props)
		this.state ={
			file: [],
			fetched: false,
			exists: ''
		}
	}

	componentDidMount() {
		// console.log(this.props.filename)
		if(this.props.filename !== ''){
			fetchFileTagBased(this.props.filename)
			.then(response => {
				// console.log(response.data)
				if(response.data.success){
					this.setState({file: response.data.file}, ()=> this.setState({fetched: true}))
				}
				else{
					this.setState({exists: response.data.message} )
					// console.log(response.data.message)
				}
			})
			.catch(error => console.log(error))
		}
		else{
			this.props.history.push('/')
		}
	}
				
	render() {
		return (
			<div>
				{this.state.exists && 
					<div className="upload share-error-msg">
						{this.state.exists}
					</div>
				}
				{this.state.fetched && <Image source={this.state.file} />}
			
			</div>
			)
	}

}

export default FetchImage