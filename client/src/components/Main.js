import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp'

class Main extends Component{
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/signup" component={SignUp} />
					<Route path="/home" component={Home} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Main