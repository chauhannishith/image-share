import axios from 'axios'
import { BACKEND } from '../utils/config'

const loginUser = (user) => {
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/login',
			data: user,
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default loginUser