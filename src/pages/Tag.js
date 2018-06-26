import React, { Component } from 'react'
import FetchImage from '../components/FetchImage'
import { getFromStorage, removeFromStorage } from '../utils/storage'

class Tag extends Component {

	constructor(props){
		super(props)
		this.state = {
			images: [],
		}
	}

	componentDidMount() {
		let token = getFromStorage('imageshare');
		if(token !== null){
			this.setState({images: this.props.location.state.tagdata.images})
		}else{
			this.props.history.push('/')
		}
	}
	
	goBack() {
		this.props.history.goBack()
	}

	logout(){
		removeFromStorage('imageshare')
		this.props.history.push('/')
	}

	render (){
		const fetchImage = this.state.images.map((image, i) => {
			// console.log(image)
				return (
					<FetchImage key={i} filename={image} />
					)

		})
		return (
			<div>
				<div className="navbar">
					<a className="left" onClick={this.goBack.bind(this)} >GoBack</a>
					<a className="right" onClick={this.logout.bind(this)}>LogOut</a>
				</div>
				<div className="project">
					<div className="image-grid">
						{fetchImage}
					</div>
				</div>
			</div>
		)
	}
}

export default Tag