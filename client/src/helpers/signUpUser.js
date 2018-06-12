import axios from 'axios'
import { BACKEND } from '../utils/config'

const signUpUser = (user) => {
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/signup',
			data: user,
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default signUpUser