import { Title, Stories, DocsContext, Description } from '@storybook/blocks';
import docJson from '../docs/custom-props.json';
import React, { useContext } from 'react';
import { get } from 'lodash';

export const ReactDocsDecorator = () => {
	const context = useContext(DocsContext);
	const componentId = context.storyById().component as any;
	const props = get(docJson, [componentId, 'customProps'], []);
	const description = get(context.storyById(), 'docs.docs.description', 'Component description');

	return (
		<>
			<Title />
			<h2> Description</h2>
			<div>{description}</div>
			<br />
			<h2>Examples</h2>
			<Stories />
			<div>
				<h2>Design tokens</h2>
				<table>
					<thead>
						<tr>
							<th>Custom prop name</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{props.map((_value, _key) => {
							const { key, value } = _value;
							return (
								<tr key={_key}>
									<td>{key}</td>
									<td>{value}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<br />
				<h2>Extra docs</h2>
			</div>
		</>
	);
};
