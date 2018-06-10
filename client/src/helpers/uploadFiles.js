import axios from 'axios'
import { BACKEND } from '../utils/config'

const uploadFiles = (fd) => {
	return new Promise((resolve, reject) => {
		axios.request({
			method: 'post',
			url: BACKEND + '/api/users/upload',
			data: fd, 
			onUploadProgress: progressEvent => {
				console.log('Upload Progress' + Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%')
			}
		})
		.then(response => resolve(response))
		.catch(error => reject(error))
		})
}


export default uploadFiles