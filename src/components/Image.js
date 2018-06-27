import React,{ Component } from 'react'
import addTag from '../helpers/addTag'
import deleteImage from '../helpers/deleteImage'
import { BACKEND } from '../utils/config'

class Image extends Component {

	constructor(props){
		super(props)
		this.state ={
			deleted: false
		}
	}

	addTag(){
		// console.log(this.refs.tagname.value)
		addTag(this.refs.tagname.value, this.props.source.filename)
		.then(response => {
			console.log(response.data)
		})
		.catch(error => console.log(error))
	}

	deleteThisImage() {
		deleteImage(this.props.source._id, this.props.source.filename)
		.then(response=> {
			console.log(response.data.message)
			this.setState({deleted: true})
		})
		.catch(error => console.log(error))
	}

	render (){
		var eachTag = null

		if(this.props.source.metadata.tags){
			eachTag = this.props.source.metadata.tags.map((tag, i) => {
				return <span key={i}> #{tag} </span>
			})
		}
		
		return (
			<div>
				{this.state.deleted ? <p>This image has been deleted</p>:
				<div className="image-card">
					<div>
						<a className="delete-btn" onClick={this.deleteThisImage.bind(this)}>x</a>
						<img src={`${BACKEND}` + '/api/users/images/' + `${this.props.source.filename}`} alt="noimage.jpg" className="thumb center"/>
					</div>
					<div>
						<p>
							{this.props.source.metadata.tags && eachTag}
						</p>
					</div>
					<div className="add-tag">
						<input type="text" ref="tagname" />
						<button className="btn-small" onClick={this.addTag.bind(this)}>Add tag</button>
					</div>
				</div>
			}
			</div>
		)
	}
}

export default Image