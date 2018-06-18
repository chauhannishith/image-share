import React, { Component} from 'react'
import DragnDrop from './DragnDrop'

class Images extends Component {

	constructor(props) {
		super(props)

	}

	render() {
		return (
			<div>
				<h1>Display image</h1>
				<h4>{this.props.projectId} {this.props.groupTitle}</h4>
				<DragnDrop projectid={this.props.projectId} subgroup={this.props.groupTitle}/>
			</div>
			)
	}

}

export default Images