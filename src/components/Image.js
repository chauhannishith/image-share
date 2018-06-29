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
		if(this.refs.tagname.value !== '' && this.props.source.filename !== ''){
			addTag(this.refs.tagname.value, this.props.source.filename)
			.then(response => {
				if(response.data.success){
					console.log(response.data.message)
					window.location.reload()
				}
				else{
					console.log(response.data.message)
				}
			})
			.catch(error => console.log(error))
		}
		else{
			// alert('Tag name can not be blank')
			this.refs.tagname.focus();
			this.refs.tagname.placeholder = 'can not be blank'
		}
	}

	deleteThisImage() {
		if(this.props.source._id !== '' && this.props.source.filename !== ''){
			deleteImage(this.props.source._id, this.props.source.filename)
			.then(response=> {
				console.log(response.data.message)
				this.setState({deleted: true})
				// window.location.reload()
			})
			.catch(error => console.log(error))
		}
		else{
			this.props.history.push('/')
		}
		
	}

	handleKey(e) {
		if((e.charCode > 96 && e.charCode <123) || (e.charCode > 64 && e.charCode < 91)){
			// console.log('yes')
		}
		else{
			// console.log('no')
			e.preventDefault()
		}
	}

	render (){
		var eachTag = null

		if(this.props.source.metadata.tags){
			eachTag = this.props.source.metadata.tags.map((tag, i) => {
				return <span key={i}> #{tag} </span>
			})
		}
		
		return (
			<div className="image-container">
				{this.state.deleted ? <p>This image has been deleted</p>:
				<div className="image-card">
					<div>
						<a className="delete-btn" onClick={this.deleteThisImage.bind(this)}>x</a>
						<img src={`${BACKEND}` + '/api/users/images/' + `${this.props.source.filename}`} alt="noimage.jpg" className="thumb center"/>
					</div>
					<div>
						{this.props.source.metadata.tags && 
							<p className="tags">
								{eachTag}
							</p>
						}
						
					</div>
					<div className="add-tag">
						<form>
						<input className="tag-text-box" type="text" ref="tagname" onKeyPress={this.handleKey.bind(this)}
							placeholder="Add tag"
							required/>
						<button className="add-tag-btn" onClick={this.addTag.bind(this)}>Add tag</button>
						</form>
					</div>
				</div>
			}
			</div>
		)
	}
}

export default Image