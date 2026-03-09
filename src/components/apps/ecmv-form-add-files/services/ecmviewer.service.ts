import { getApiUrl } from '../../../../utils/public_api';
import { config, APP_HEAD_FRONT_API, CommonHttpHeaders } from '../config/config';
import { IECMVDocumentClassData, IECMVFSEData, IECMVMetadataByDocType } from '../models/ecmv-service.model';

class EcmViewerServiceController {
	current_subsidiary_id: number;

	private setCommonHeaders(): CommonHttpHeaders {
		let commonHeaders = {
			'X-Application-Context': APP_HEAD_FRONT_API
		};
		if (this.current_subsidiary_id !== null && this.current_subsidiary_id !== undefined) {
			commonHeaders['current-glcs'] = `${this.current_subsidiary_id}`;
		}

		return commonHeaders;
	}

	/**
	 * @description Check if user has permission to access to ECMViewer
	 * @method get
	 */
	getFSEECMVPermissions() {
		return new Promise<IECMVFSEData[]>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.permissions), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	getGeoTranslate() {
		return new Promise<any[]>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.geotranslates), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	getConfidentialTranslate() {
		return new Promise<any[]>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.confidentialtranslates), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * @description Get list of document class
	 * @method get
	 */
	getAllDocumentClass(permissions) {
		return new Promise<IECMVDocumentClassData[]>((resolve, reject) => {
			fetch(`${getApiUrl(config.endpoints.getAllDocumentsClass)}?${permissions}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * @description Get metadatas by document class and document type
	 * @method get
	 */

	getMetadataByDocType(docType: string) {
		return new Promise<IECMVMetadataByDocType[]>((resolve, reject) => {
			return fetch(getApiUrl(`${config.endpoints.getMetadataByDocType}${docType}`), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	/**
	 * @description Get list of files filter by document type
	 * @method get
	 */
	getFilesByDocumentType(
		totalSize,
		page,
		docClass: string,
		docType: string,
		metadataFilterQuery: string,
		queryFilterValues: string,
		queryOrderString: string,
		checkDuplicates?: boolean
	) {
		let searchDuplicate = checkDuplicates ? 'true' : 'false';

		const url = `${getApiUrl(
			config.endpoints.documents
		)}?totalSize=${totalSize}&page=${page}&documentClass=${docClass}&documentType=${docType}&metadataFilterQuery=${metadataFilterQuery}&queryFilterValues=${queryFilterValues}&queryOrderFilter=${queryOrderString}&searchDuplicate=${searchDuplicate}`;
		return new Promise<any>((resolve, reject) => {
			fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * @description Add a new file
	 * @method get
	 */
	uploadFiles(body) {
		return new Promise<any>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.documents), {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((response: Response) => {
					if (!response.ok) {
						throw response;
					} else {
						return response.json();
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

	/**
	 * Check user preference to show or not module info
	 * @param userId
	 */
	getUserPreference() {
		return new Promise<boolean>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.usersPreferences), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return res.json().then((data) => resolve(data));
					}
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * Set user preference to show or not module info
	 * @param userId
	 */
	setUserPreference(preference: boolean) {
		return new Promise<any>((resolve, reject) => {
			fetch(getApiUrl(config.endpoints.usersPreferences), {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify({
					showPreferences: preference
				}),
				headers: {
					'Content-Type': 'application/json',
					...this.setCommonHeaders()
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else {
						return resolve(true);
					}
				})
				.catch((err) => reject(err));
		});
	}
}

export const EcmViewerService = new EcmViewerServiceController();
