import { getApiUrl } from '../../../../utils/public_api';
import { config } from '../config/config';
import { BodyBase, DocuSignRecipient, DraftStep, FSECases, SignatureTypesBack } from '../models/cdk-signature-modal.model';

class EnvelopeServiceController {
	private _portafirmasUrl = '/wrapper-portafirmas';
	private postCaller(body: object, env: string, endpoint: string): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(this._portafirmasUrl + endpoint), {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
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
	getUseCasesFSE(env: string): Promise<FSECases[]> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(this._portafirmasUrl + config.endpoints.getUseCasesFSE), {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					if (!res.ok) {
						res.json().then((err) => reject(err));
					} else return res.json().then((data) => resolve(data));
				})
				.catch((err) => reject(err));
		});
	}

	getSignatureTypes(clientId, env: string): Promise<SignatureTypesBack[]> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(this._portafirmasUrl + config.endpoints.getSignatureTypes + clientId), {
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

	getIfBlockedCreationOfEnvelopeForCurrentUser(env: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(this._portafirmasUrl + config.endpoints.getIfBlockedCreationOfEnvelopeForUnassignedUsers), {
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

	public createDraftStep(body: BodyBase, env: string): Promise<DraftStep> {
		return this.postCaller(body, env, config.endpoints.createEnvelope);
	}

	getTemplateById(id, env): Promise<DocuSignRecipient> {
		return new Promise((resolve, reject) => {
			fetch(getApiUrl(this._portafirmasUrl + config.endpoints.getTemplates + '/' + id + '/recipients'), {
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
