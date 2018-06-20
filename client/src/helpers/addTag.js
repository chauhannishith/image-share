import axios from 'axios'
import { BACKEND } from '../utils/config'
import { getFromStorage } from '../utils/storage'

const addTag = (tagname, filename) => {
	let token = getFromStorage('imageshare')
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/addtag',
			headers: {
				Authorization: 'Bearer ' + token
			},
			data: {
				tagname: tagname,
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

export default addTag