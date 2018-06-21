import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const fetchUserTags = () => {
	let token = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'get',
			url: BACKEND + '/api/users/fetchtags',
			headers: {
				Authorization: 'Bearer ' + token
			}
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default fetchUserTags