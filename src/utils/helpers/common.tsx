/**
 * Parsea una entrada compleja (array u objeto) en caso de venir como string
 * @param newVal puede ser un objeto o un JSON string, pero en caso de este último el tipo debe coincidir cuando se parsea
 */
import { randomBytes } from '@noble/hashes/utils';
import { first, get, isEmpty, omit, trimEnd, trimStart } from 'lodash';

/**
 * Config keys to omit for tables
 */
export const configKeysToOmitForTables = [
	'totalItems',
	'language',
	'id',
	'variant',
	'hideFilters',
	'hideViews',
	'infiniteScroll',
	'hideTotal',
	'baseWidth',
	'baseMinWidth',
	'fixed',
	'titleDescription',
	'headerFilterType',
	'filterSingleValue',
	'filterSelectOptions',
	'delegatedFilter'
];

/**
 * Removes specific keys from each column object in the provided array.
 * @param columns An array of column objects to process.
 * @returns A new array of column objects with the specified keys omitted.
 */
export const removeColumnKeys = (columns: any[]) => {
	return columns.map((column) => {
		return omit(column, configKeysToOmitForTables);
	});
};

/**
 * Parses a JSON string of attributes into an object and transforms it into a format
 * suitable for use as props in a React component or a Storybook selector.
 *
 * This function is particularly useful for scenarios where attributes are passed
 * as a JSON string and need to be converted into a key-value object for further usage.
 *
 * @param attributes - A JSON string representing the attributes to be parsed.
 * @returns An object where each key-value pair corresponds to the parsed attributes.
 *
 * @example
 * ```tsx
 * // Example usage in a Storybook story
 * export const Story: StoryObj = {
 *   args: {
 *     explicitTooltipProps: '{"placeholder": "Enter text", "tooltip": "This is a tooltip"}',
 *   },
 *   render: (args: { [key: string]: any }) => {
 *     return <scib-ui-v2-text-field {...parseAttributes(args['explicit-tooltip-props'])}></scib-ui-v2-text-field>
 *   }
 * };
 * ```
 */
export function parseAttributes(attributes: string) {
	return Object.entries(JSON.parse(attributes)).reduce((acc: any, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function parseProp<T>(newVal: string | T, _defaultValue?: any): T | null {
	if (typeof newVal === 'string') {
		try {
			const value = JSON.parse(newVal || '{}');
			return !isEmpty(value) ? value : _defaultValue;
		} catch (e) {
			// console.warn('scib-ui-kit: JSON Input cannot be parsed');
			// console.warn(e);
			return _defaultValue || null;
		}
	} else {
		return newVal || _defaultValue;
	}
}

/**
 * @description return a formatted size for documents
 * @param size number
 */
export function formatFileSize(size: number): string | null {
	let result: string = '';
	const megaByte = 1024 * 1024;
	const gigaByte = megaByte * 1024;
	if (size < megaByte) {
		result = (size / 1024).toFixed(2) + ' kB';
	}
	if (size >= megaByte && size < gigaByte) {
		result = (size / 1024 / 1024).toFixed(2) + ' MB';
	}
	if (size >= gigaByte) {
		result = (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
	}
	return result;
}

/**
 * @description Function to copy any string to the Clipborad
 * @param valueToCopy The name describes the parameter itself
 * @param concatenation Letter, symbol or number to separate a text string
 */
export function copyToClipboard(valueToCopy: string, concatenation?: string): boolean {
	const txtArea = document.createElement('textarea');
	let result = false;
	txtArea.style.position = 'fixed';
	txtArea.style.top = '0';
	txtArea.style.left = '0';
	txtArea.style.opacity = '0';
	if (valueToCopy === '') {
		return false;
	}
	if (!concatenation) {
		txtArea.value = valueToCopy;
	} else {
		txtArea.value = valueToCopy.split(concatenation).join('\n');
	}
	document.body.appendChild(txtArea);
	txtArea.select();
	try {
		const success = document.execCommand('copy');
		if (success) result = true;
	} catch (err) {
		console.error('Unable to copy due to ==> ' + err);
		result = false;
	} finally {
		document.body.removeChild(txtArea);
	}
	return result;
}

/**
 * @description Adds a number of days to a given date
 * @param date The date to increment
 * @param days the ammount of days to increment
 * @returns It returns a date with the new value
 */
export function addDays(date: Date, days: number): Date {
	const result: Date = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 *
 * @param element
 * @param events
 */
export const preventEvents = (element: HTMLElement | ShadowRoot, events: string[]) => {
	events.forEach((event) => {
		element.addEventListener(event, (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
		});
	});
};

/**
 *
 * @param element
 * @param events
 */
export const removePreventEvents = (element: HTMLElement | ShadowRoot, events: string[]) => {
	events.forEach((event) => element.removeEventListener(event, () => {}));
};

/**
 *
 * @returns
 */
export const getPublicUrl = () => {
	const usingNewShell = get(window, 'shell.enabled') || get(window, '__WEBPACK__NEW__SHELL__ENABLE__', false);
	const globalCustomHost = get(window, 'shell.uiKitHost') || get(window, '__WEBPACK__SHELL__UIKIT__HOST__');
	if (usingNewShell && globalCustomHost) {
		return globalCustomHost;
	}
	const links = document.getElementsByTagName('link');
	const link = (Array.from(links) || []).find((link) => {
		const href = link && link?.getAttribute('href');
		return href && (href.includes('/scib-ui-kit.css') || href.includes('/cdn/components.css'));
	});
	let _href = link && link?.getAttribute('href');
	try {
		const url = new URL(_href || '');
		const { href } = url;
		_href = href || '';
	} catch (_) {
		_href = _href || '';
	}
	if (_href.includes('/stencil-server/')) {
		return '';
	}
	const _pattern = _href.includes('/scib-ui-kit.css') ? 'scib-ui-kit' : 'components';
	return first(_href.split(`/${_pattern}.css`)) || '';
};

/**
 *
 * @param assetUrl
 * @returns
 */
export const assetUrl = (assetUrl: string) => {
	try {
		new URL(assetUrl);
		return assetUrl;
	} catch (error) {
		let publicUrl = getPublicUrl();
		if (isEmpty(publicUrl) || publicUrl === '/') {
			publicUrl = `${window.location.protocol}//${window.location.host}`;
		}
		const finalUrl = `${publicUrl}/${trimStart(assetUrl, '/')}`;
		if (finalUrl.includes('//app.')) {
			return finalUrl.replace('//app.', '//');
		}
		return finalUrl;
	}
};

/**
 *
 * @param path
 * @returns
 */
export const getApiUrl = (path: string) => {
	try {
		new URL(path);
		return path;
	} catch (error) {
		const _apiHost = get(window, '__WEBPACK__SHELL__API__HOST__', '/');
		const usingNewShell = get(window, '__WEBPACK__NEW__SHELL__ENABLE__', false);
		return usingNewShell ? `${trimEnd(_apiHost, '/')}/${trimStart(path, '/')}` : path;
	}
};

/**
 * Generate random id
 */
export const generateRandomId = (): number => {
	const bytes = randomBytes(16); // Usamos 16 bytes para mayor precisión
	const maxValue = Math.pow(2, 8 * bytes.length) - 1; // Valor máximo posible para los bytes generados
	const randomValue = bytes.reduce((acc, byte, index) => acc + byte * Math.pow(256, index), 0);
	return randomValue / maxValue;
};
