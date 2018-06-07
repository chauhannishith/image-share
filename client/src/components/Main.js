import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp'
import Verify from '../pages/Verify'
import Verified from '../pages/Verified'

class Main extends Component{
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/signup" component={SignUp} />
					<Route path="/home" component={Home} />
					<Route path="/verify" component={Verify} />
					<Route path="/verified" component={Verified} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Main