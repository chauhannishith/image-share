import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const createSubGroup = (projectId, title) => {
	let token = getFromStorage('imageshare')
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/createsubgroup',
			headers: {
				Authorization: 'Bearer ' + token
			},
			data: {
				title: title,
				projectId: projectId
			},
			credentials: 'include'
			}).then(response => {
	        	resolve(response)
			})
			.catch((error) => {
				reject(error)
			})
		})
}

export default createSubGroup