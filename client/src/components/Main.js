import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Auth from '../pages/Auth'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp'
import Project from '../pages/Project'
import Tag from '../pages/Tag'
import Verify from '../pages/Verify'
import Verified from '../pages/Verified'

class Main extends Component{
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/auth/:id" component={Auth} />
					<Route path="/signup" component={SignUp} />
					<Route path="/home" component={Home} />
					<Route path="/projects" component={Project}/>
					<Route path="/tag" component={Tag}/>
					<Route path="/verify" component={Verify} />
					<Route path="/verified" component={Verified} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Main