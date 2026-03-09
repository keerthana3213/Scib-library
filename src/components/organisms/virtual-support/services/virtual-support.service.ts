import { get, trimStart } from 'lodash';
import { getApiUrl } from '../../../../utils/public_api';
import { VirtualSupport, VirtualSupportES } from '../mock/mock';

/**
 *
 * @param lang
 * @returns
 */
export const getCmsData = (lang: string, apiUrl: string = null): Promise<any> => {
	const section = `ms-cms/translations/public/dp-virtual-support?sectionIds=virtual-support&defaultLanguageId=en-GB&languageId=${lang || 'en-GB'}`;
	const url = `${getApiUrl(apiUrl)}/${trimStart(section, '/')}`;
	return fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => {
			if (!response.ok) {
				console.error('Response status:', response.status);
				console.error('Response text:', response.statusText);
				throw new Error('Network response was not ok');
			}
			return response?.json();
		})
		.then((data) => get(data, ['translations', 'virtual-support', 'translations']))
		.catch((error) => {
			console.error('There has been a problem with your fetch operation:', error);
			if (lang === 'es-ES') {
				return VirtualSupportES;
			}
			return VirtualSupport;
		});
};
