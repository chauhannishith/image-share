import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const createProject = (title) => {
	let session = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/create',
			data: {
				userID: session.passport.user,
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