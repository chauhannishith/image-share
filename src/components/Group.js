import React, { Component} from 'react'
import DragnDrop from './DragnDrop'
import Image from './Image'

class Group extends Component {

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

	render() {
		const eachGroupImage = this.state.groupimages.map((image, i) => {
			return <Image key={i} source={image} />
		})

		return (
			<div>
				<div className="image-grid">
					{eachGroupImage.length ? eachGroupImage : <p>There are no images to display</p>}
				</div>
				<DragnDrop projectid={this.props.projectId} subgroup={this.props.groupTitle}/>
			</div>
			)
	}

}

export default Group