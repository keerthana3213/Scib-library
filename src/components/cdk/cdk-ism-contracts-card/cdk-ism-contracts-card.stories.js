import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Contracts Card',
	...getStoryConfig('scib-cdk-ism-contracts-card')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-contracts-card
		literals='${parseObject(args.literals)}'
	>
	</scib-cdk-ism-contracts-card>
`);
const TemplateLeyend = (args) => render(args, `
	<scib-cdk-ism-contracts-card
		literals='${parseObject(args.literals)}'
	>
	</scib-cdk-ism-contracts-card>
`);
// Default Story
export const Develop = Template.bind();
export const DevelopLeyend = TemplateLeyend.bind();
Develop.args = {
	literals: {
		icon: 'icon-success',
		title: 'Validation',
		module: 'MOD.04 VALIDATION',
		content: {
			description: 'Validation of arranged transactions in BO systems, including display of interfaces, automatic/manual logging of transactions, controls/reconciliations to ensure process quality and incident management.',
		}
	}
};

DevelopLeyend.args = {
	literals: {
		title: 'OTC Derivatives',
		module: 'MOD.04 Validation',
		content: {
			title:'IND.VALIDAT01: Validation of transactions in BO systems',
			description: 'Number of transactions validated (*) within the agreed timeframe (**)/Number of transactions entered into the BO system on the day (***)*100.',
		},
		leyend: {
			icon: 'icon-time',
			frequency: 'DAILY',
			title: 'MEASUREMENT:',
			values: [
				{
					value:'>=98%',
					color:'#00BC63'
				},
				{
					value:'>=95% & <98%',
					color:'#F2AB4E'
				},
				{
					value:'<95%',
					color:'#EC0000'
				}
			]
		}
	}
};
