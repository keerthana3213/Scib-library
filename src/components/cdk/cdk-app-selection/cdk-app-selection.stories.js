import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/App Selection',
	...getStoryConfig('scib-cdk-app-selection'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-app-selection
    name='${args.name}'
		apps='${parseObject(args.apps)}'
	></scib-cdk-app-selection>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	name: 'appselection',
	apps: [
		{ 'id': 388, 'name': 'Contract Reviewer', 'select': false }, { 'id': 381, 'name': 'Settlement Instructions', 'select': true },
		{ 'id': 2, 'name': 'Santander Cash Nexus', 'select': false }, { 'id': 389, 'name': 'Pre Post Trade', 'select': false },
		{ 'id': 379, 'name': 'Analytics Reports', 'select': false }, { 'id': 385, 'name': 'Virtual Data Room', 'select': true },
		{ 'id': 387, 'name': 'IBOR Transition', 'select': true }, { 'id': 378, 'name': 'User access management', 'select': false },
		{ 'id': 3, 'name': 'Research', 'select': false }, { 'id': 371, 'name': 'Time Report SBGM', 'select': false },
		{ 'id': 367, 'name': 'E-Derivatives (Demo mode)', 'select': false },
		{ 'id': 7, 'name': 'Equity Futures and Options Organized Markets', 'select': false },
		{ 'id': 373, 'name': 'Permit for PRO', 'select': false }, { 'id': 372, 'name': 'Gestor de Candidatos', 'select': false },
		{ 'id': 5, 'name': 'Confirming Global', 'select': false }, { 'id': 4, 'name': 'FX', 'select': false },
		{ 'id': 9, 'name': 'Receivables Client Web', 'select': false }, { 'id': 10, 'name': 'OTC Clearing', 'select': false },
		{ 'id': 266, 'name': 'Supply Chain', 'select': false }, { 'id': 6, 'name': 'E-Derivatives', 'select': false },
		{ 'id': 8, 'name': 'Primary bonds Syndicate', 'select': false }, { 'id': 358, 'name': 'Dart', 'select': false },
		{ 'id': 35, 'name': 'Incident Report', 'select': false }, { 'id': 368, 'name': 'Research (Demo mode)', 'select': false },
		{ 'id': 366, 'name': 'Global Confirming (Demo mode)', 'select': false }, { 'id': 311, 'name': 'Mark To Market', 'select': false },
		{ 'id': 22, 'name': 'Trade Portal', 'select': false }, { 'id': 36, 'name': 'Informes MISCO', 'select': false },
		{ 'id': 96, 'name': 'Blotter', 'select': false }, { 'id': 37, 'name': 'Evaluación ACPM', 'select': false },
		{ 'id': 158, 'name': 'Appian', 'select': false }, { 'id': 314, 'name': 'Instrucciones de Liquidaciones Cash', 'select': false },
		{ 'id': 270, 'name': 'Cash Management Qlik Reports', 'select': false }, { 'id': 272, 'name': 'qlik-basic', 'select': false },
		{ 'id': 361, 'name': 'FX (Demo mode)', 'select': false }, { 'id': 307, 'name': 'LoanIQ', 'select': false },
		{ 'id': 360, 'name': 'Santander Cash Nexus (Demo mode)', 'select': false },
	],
	// Add default values here
};
