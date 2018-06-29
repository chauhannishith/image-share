import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const fetchProject = (projectId) => {
	let token = getFromStorage('imageshare')
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/project',
			headers: {
				Authorization: 'Bearer ' + token
			},
			data: {
				projectId: projectId
			}
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default fetchProject