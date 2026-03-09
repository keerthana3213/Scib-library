import { randomBytes } from '@noble/hashes/utils';
import { get, isEmpty, isObject, kebabCase, merge, omit, omitBy } from 'lodash';
import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import { renderToString } from 'react-dom/server';
import { extractArgTypes, extractComponentDocs } from './controls';

export const getStoryConfig = (tagName) => {
	const args = extractArgTypes(tagName);
	const docs = extractComponentDocs(tagName);
	const { coreComponentStatus = 'beta', coreDefaultArgs = {} } = args;
	return merge(
		{},
		{
			component: tagName,
			parameters: {
				docs: {
					...docs,
					source: {
						language: 'html',
						transform: (_, storyContext) => {
							const { originalStoryFn, args } = storyContext;
							// TODO: eliminar slots por defecto
							const _args = omitBy(
								Object.entries(args || {}).reduce((acc, [key, value]) => {
									let _value = value;
									if (Array.isArray(_value) || isObject(_value)) {
										_value = JSON.stringify(_value);
									}
									acc[kebabCase(key)] = _value;
									return acc;
								}, {}),
								isEmpty
							);
							const reactElement = originalStoryFn(_args);
							const _htmlString = renderToString(reactElement);
							const _element = document.createElement('div');
							_element.innerHTML = _htmlString;
							return prettier.format(get(_element, 'innerHTML', ''), {
								parser: 'babel',
								plugins: [parserBabel],
								tabWidth: 2,
								useTabs: false,
								htmlWhitespaceSensitivity: 'strict',
								singleQuote: true,
								trailingComma: 'none',
								semi: true,
								proseWrap: 'always',
								bracketSpacing: true,
								arrowParens: 'always',
								printWidth: 80,
								endOfLine: 'auto'
							});
						}
					}
				},
				status: coreComponentStatus
			},
			argTypes: {
				...omit(args, ['coreComponentStatus', 'coreDefaultArgs'])
			},
			args: {
				...coreDefaultArgs
			}
		}
	);
};

/**
 * Generate random id
 */
export const generateRandomId = () => {
	const bytes = randomBytes(16); // Usamos 16 bytes para mayor precisión
	const maxValue = Math.pow(2, 8 * bytes.length) - 1; // Valor máximo posible para los bytes generados
	const randomValue = bytes.reduce((acc, byte, index) => acc + byte * Math.pow(256, index), 0);
	return randomValue / maxValue;
};
