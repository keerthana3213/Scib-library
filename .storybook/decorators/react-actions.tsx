import { useListener } from 'react-custom-events-hooks';
import { action } from '@storybook/addon-actions';
import { get, kebabCase, isObject } from 'lodash';
import React from 'react';

/**
 * React component for catching actions from webcomponents
 * @param args
 * @returns
 */
export const ReactActionsDecorator = (...args) => {
	const [Story, data] = args;

	Object.values(get(data, 'argTypes', {}))
		.filter((type) => get(type, 'table.category') === 'EVENTS' && !get(type, 'name', '').startsWith('internal'))
		.forEach((customEvent: any) => {
			const _actionName = customEvent.action;
			useListener(_actionName, (event) => action(kebabCase(_actionName), { clearOnStoryChange: true })({ detail: event.detail }));
		});
	data.args = Object.entries(data.args).reduce((acc, [key, value]) => {
		let _value = value;
		const isDate = _value instanceof Date;
		if (!isDate && (Array.isArray(_value) || isObject(_value))) {
			_value = JSON.stringify(_value);
		}
		acc[kebabCase(key)] = _value;
		return acc;
	}, {});

	return (
		<div>
			<Story />
		</div>
	);
};
