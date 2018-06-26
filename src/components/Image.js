import React,{ Component } from 'react'
import addTag from '../helpers/addTag'
import { BACKEND } from '../utils/config'

class Image extends Component {

	addTag(){
		// console.log(this.refs.tagname.value)
		addTag(this.refs.tagname.value, this.props.source.filename)
		.then(response => {
			console.log(response.data)
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
			<div className="image-card">
				<img src={`${BACKEND}` + '/api/users/images/' + `${this.props.source.filename}`} alt="noimage.jpg" className="thumb center"/>
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
		)
	}
}

export default Image