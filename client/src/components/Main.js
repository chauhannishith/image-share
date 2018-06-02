import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'

class Main extends Component{
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/signup" component={SignUp} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Main