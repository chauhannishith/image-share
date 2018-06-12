import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const fetchUserProjects = (title) => {
	let token = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/projects',
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

export default fetchUserProjects