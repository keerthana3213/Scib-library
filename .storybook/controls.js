import { kebabCase, trimEnd, trimStart, get, isUndefined, camelCase, first, last } from 'lodash';
import { logger } from '@storybook/client-logger';

const isValidComponent = (tagName) => {
	if (!tagName) {
		return false;
	}
	if (typeof tagName === 'string') {
		return true;
	}
	throw new Error('Provided component needs to be a string. e.g. component: "my-element"');
};

const isValidMetaData = (stencilDocJson) => {
	if (!stencilDocJson) {
		return false;
	}
	if (stencilDocJson.components && Array.isArray(stencilDocJson.components)) {
		return true;
	}
	throw new Error(`You need to setup valid meta data in your preview.js via setStencilDocJson().
    The meta data can be generated with the stencil output target 'docs-json'.`);
};

const getMetaData = (tagName, stencilDocJson) => {
	if (!isValidComponent(tagName) || !isValidMetaData(stencilDocJson)) {
		return null;
	}

	const metaData = stencilDocJson.components.find((component) => component.tag.toUpperCase() === tagName.toUpperCase());
	if (!metaData) {
		logger.warn(`Component not found in stencil doc json: ${tagName}`);
	}
	return metaData;
};

const mapPropTypeToControl = (item) => {
	let controlType;
	let values = [];

	switch (item.type) {
		case 'string':
			controlType = { type: 'text' };
			break;
		case 'number':
			controlType = { type: 'number' };
			break;
		case 'boolean':
			controlType = { type: 'boolean' };
			break;
		case 'function':
		case 'void':
			controlType = null;
			break;
		default:
			values = item.values.filter((value) => ['string', 'number'].includes(value.type)).map((value) => value.value);

			if (values.length === 0 || (values.length === 1 && item.values.length > 1)) {
				controlType = { type: 'object' };
			} else {
				controlType = { type: 'select', options: values };
			}
	}

	return controlType;
};

const clearString = (value) => {
	let str = trimStart(value, "'");
	str = trimStart(str, '"');
	str = trimEnd(str, "'");
	str = trimEnd(str, '"');
	str = str.replaceAll('\n', '');
	str = str.replaceAll('\t', '');
	return str;
};

const getDefaultValue = (item) => {
	switch (item.type) {
		case 'string':
			return item.default === undefined ? '' : String(clearString(item.default));
		case 'number':
			return item.default === undefined ? 0 : Number(item.default);
		case 'boolean':
			return item.default === undefined ? false : item.default.toLowerCase() === 'true';
		default:
			return clearString(item.default);
	}
};

const mapPropsData = (data) => {
	return (
		data &&
		data.reduce((acc, item) => {
			const defaultValue = getDefaultValue(item);
			const control = mapPropTypeToControl(item);
			const { type, options } = control;
			acc[item.name] = {
				...(!!options ? { options } : {}),
				name: kebabCase(item.name),
				description: item.docs,
				type: { name: type, required: item.required },
				control: type,
				defaultValue,
				table: {
					category: 'PROPS',
					type: { summary: item.type },
					defaultValue: { summary: defaultValue }
				}
			};
			return acc;
		}, {})
	);
};

const mapEventsData = (data) => {
	return (
		data &&
		data.reduce((acc, item) => {
			const _detail = item.detail;
			const _isObject = typeof _detail === 'object';
			acc[item.event] = {
				name: kebabCase(item.event),
				description: item.docs || 'Try it out in the actions tab.',
				action: item.event,
				table: {
					category: 'EVENTS',
					type: { summary: `() => { detail: ${_isObject ? JSON.stringify(_detail) : _detail} }` }
				}
			};
			return acc;
		}, {})
	);
};

const mapMethodsData = (data) => {
	return (
		data &&
		data.reduce((acc, item) => {
			acc[item.name] = {
				name: item.name,
				description: item.docs,
				type: { name: 'void' },
				control: null,
				table: {
					category: 'METHODS',
					type: { summary: item.signature }
				}
			};
			return acc;
		}, {})
	);
};

const mapGenericData = (data, category) => {
	return (
		data &&
		data.reduce((acc, item) => {
			const type = { name: 'void' };
			let defaultValue = getDefaultValue(item);
			let _description = item.docs;
			if (category === 'slots') {
				const _fragments = _description.split('|');
				_description = (first(_fragments) || '').trim();
				defaultValue = (last(_fragments) || '').trim();
			}
			acc[camelCase(item.name)] = {
				name: item.name,
				required: false,
				description: _description,
				defaultValue,
				type,
				control: { type: 'text' },
				table: {
					category: category.toUpperCase(),
					type
				}
			};
			return acc;
		}, {})
	);
};

export const setStencilDocJson = (stencilDocJson) => {
	window.__STORYBOOK_STENCIL_DOC_JSON__ = stencilDocJson;
};

export const getStencilDocJson = () => window.__STORYBOOK_STENCIL_DOC_JSON__;

export const extractArgTypesFromElements = (tagName, stencilDocJson) => {
	const metaData = getMetaData(tagName, stencilDocJson);
	const props = mapPropsData(metaData.props);
	const slots = mapGenericData(metaData.slots, 'slots');

	const defaultValues = Object.values({ ...slots, ...props }).reduce((acc, arg) => {
		const { name, defaultValue } = arg;
		if (!isUndefined(name) && !isUndefined(defaultValue)) {
			acc[camelCase(`${name}`)] = defaultValue;
		}
		return acc;
	}, {});

	return (
		metaData && {
			coreComponentStatus: getStatus(metaData),
			coreDefaultArgs: defaultValues,
			...props,
			...slots,
			...mapGenericData(metaData.slots, 'slots'),
			...mapGenericData(metaData.styles, 'css custom properties'),
			...mapGenericData(metaData.parts, 'css shadow parts'),
			...mapEventsData(metaData.events),
			...mapMethodsData(metaData.methods)
		}
	);
};

export const getStatus = (metadata) => {
	return get(
		get(metadata, 'docsTags', [{ name: 'status', text: 'beta' }]).find((docTag) => docTag.name === 'status'),
		'text',
		'beta'
	);
};

export const extractArgTypes = (tagName) => {
	return extractArgTypesFromElements(tagName, getStencilDocJson());
};

export const extractComponentDocs = (tagName) => {
	const { docs } = getMetaData(tagName, getStencilDocJson());
	return {
		componentSubtitle: docs,
		docs: {
			description: extractComponentDescription(tagName)
		}
	};
};

export const extractComponentDescription = (tagName) => {
	const metaData = getMetaData(tagName, getStencilDocJson());
	return metaData && metaData.docs;
};
