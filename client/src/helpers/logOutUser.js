import axios from 'axios'
import { getFromStorage } from '../utils/storage'
import { BACKEND } from '../utils/config'

const loginUser = () => {
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'get',
			url: BACKEND + '/api/users/logout',
			credentials: 'include',
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default loginUser