import React, { Component} from 'react'
import DragnDrop from './DragnDrop'
import { BACKEND } from '../utils/config'

class Images extends Component {

	constructor(props) {
		super(props)
		this.state ={
			groupimages: []
		}
	}

	componentDidMount(){
		let localImages = []
		let x
		for(let i = 0; i < this.props.images.length ; i++) {
			x = this.props.images[i].metadata.subgroup
			if(x === this.props.groupTitle){
				localImages.push(this.props.images[i])
				// console.log(this.props.images.length)	
			}
		}
		setTimeout(() => this.setState({groupimages: [...localImages]}), 2000)
		
	}
//				<h4>{this.props.projectId} {this.props.groupTitle}</h4>
	render() {
		const eachGroupImage = this.state.groupimages.map((image, i) => {
			return <img key={i} src={`${BACKEND}` + '/api/users/images/' + `${image.filename}`} alt="noimage.jpg" className="thumb" />
		})

		return (
			<div>
				<h6>Display image</h6>
				{eachGroupImage}
				<DragnDrop projectid={this.props.projectId} subgroup={this.props.groupTitle}/>
			</div>
			)
	}

}

export default Images