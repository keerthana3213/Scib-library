import { getApiUrl } from '../../../../utils/public_api';
import { config } from '../config/config';

class ManagerServiceController {
	getManager(env: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.env[env] + config.endpoints.getManager), {
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

export const ManagerService = new ManagerServiceController();
