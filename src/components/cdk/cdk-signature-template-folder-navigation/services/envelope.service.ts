import { getApiUrl } from '../../../../utils/public_api';
import { config } from '../config/config';
import { Folder } from '../models/cdk-signature-template-folder-navigation.model';

class EnvelopeServiceController {
	getFolderList(): Promise<Folder[]> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.getFolders), {
				method: 'GET',
				credentials: 'include',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error(res.statusText);
					} else {
						return res.json();
					}
				})
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getFolderById(id: string): Promise<Folder[]> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.getFolders + '/' + id), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error(res.statusText);
					} else {
						return res.json();
					}
				})
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}

export const EnvelopeService = new EnvelopeServiceController();
