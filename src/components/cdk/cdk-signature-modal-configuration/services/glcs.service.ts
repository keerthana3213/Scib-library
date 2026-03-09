import { getApiUrl } from '../../../../utils/public_api';
import { config } from '../config/config';
import { Subsidiary } from '../models/cdk-signature-modal-configuration.model';
class GlcsServiceController {
	getGlcsList(env: string, name: string): Promise<Subsidiary[]> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(config.env[env] + config.endpoints['subsidiaries']) + '?name=' + name, {
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
					resolve(data as Subsidiary[]);
				})
				.catch((err) => reject(err));
		});
	}
}

export const GlcsService = new GlcsServiceController();
