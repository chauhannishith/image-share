import React,{ Component } from 'react'
import addTag from '../helpers/addTag'
import { BACKEND } from '../utils/config'

class Image extends Component {

	addTag(){
		console.log(this.refs.tagname.value)
		addTag(this.refs.tagname.value, this.props.source.filename)
		.then(response => {
			console.log(response.data)
		})
		.catch(error => console.log(error))
	}

	render (){
		return (
			<div>
				<img src={`${BACKEND}` + '/api/users/images/' + `${this.props.source.filename}`} alt="noimage.jpg" className="thumb"/>
				<p>{this.props.source.metadata.tags}</p>
				<input type="text" ref="tagname" />
				<button onClick={this.addTag.bind(this)}>Add tag</button>
			</div>
		)
	}
}

export default Image