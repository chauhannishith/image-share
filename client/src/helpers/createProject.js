import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const createProject = (title) => {
	let token = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/create',
			headers: {
				Authorization: 'Bearer ' + token
			},
			data: {
				title: title
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

export default createProject