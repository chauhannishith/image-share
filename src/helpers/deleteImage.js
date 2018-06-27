import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const deleteImage = (imageID) => {
	let token = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'delete',
			url: BACKEND + '/api/users/files/' + imageID,
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

export default deleteImage