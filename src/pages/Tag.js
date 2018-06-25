import React, { Component } from 'react'
import FetchImage from '../components/FetchImage'
import { getFromStorage } from '../utils/storage'

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

	render (){
		const fetchImage = this.state.images.map((image, i) => {
			// console.log(image)
				return (
					<FetchImage key={i} filename={image} />
					)

		})
		return (
			<div>
				<button onClick={this.goBack.bind(this)} >GoBack</button>
				<div className="image-grid">
					{fetchImage}
				</div>
			</div>
		)
	}
}

export default Tag