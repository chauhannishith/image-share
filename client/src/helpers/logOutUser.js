import axios from 'axios'
import { BACKEND } from '../utils/config'

const loginUser = () => {
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'get',
			url: BACKEND + '/api/users/logout',
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default loginUser