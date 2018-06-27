import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const deleteImage = (imageID, filename) => {
	let token = getFromStorage('imageshare')
	// console.log(session)
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/files',
			headers: {
				Authorization: 'Bearer ' + token
			},
			data: {
				imageId: imageID,
				filename: filename
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