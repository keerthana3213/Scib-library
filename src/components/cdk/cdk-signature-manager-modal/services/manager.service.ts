import { getApiUrl } from '../../../../utils/public_api';
import { config } from '../config/config';

class ManagerServiceController {
	getManager(env: string) {
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

	getManagers(env: string) {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.env[env] + config.endpoints.getManagers), {
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

	setManager(body: object, env: string): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.env[env] + config.endpoints.setManager), {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((data) => {
					resolve(data);
				})
				.catch((err: Response) => {
					try {
						err.text().then((errorMessage: string) => {
							reject(errorMessage);
						});
					} catch (e) {
						reject(err);
					}
				});
		});
	}
}

export const ManagerService = new ManagerServiceController();
