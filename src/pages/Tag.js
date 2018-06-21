import React, { Component } from 'react'
import FetchImage from '../components/FetchImage'

class Tag extends Component {

	constructor(props){
		super(props)
		this.state = {
			images: [],
		}
	}

	componentDidMount() {
		this.setState({images: this.props.location.state.tagdata.images})
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
				{fetchImage}
			</div>
		)
	}
}

export default Tag