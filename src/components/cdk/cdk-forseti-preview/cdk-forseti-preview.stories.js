import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Forseti Preview',
	...getStoryConfig('scib-cdk-forseti-preview')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
<div style="width:412px">
	<scib-cdk-forseti-preview
	is-loading=${parseBoolean(args.loading)}
	error-on-loading=${parseBoolean(args.error)}
	literals='${parseObject(args.literals)}'
	data='${parseObject(args.data)}'
	</scib-cdk-forseti-preview>
</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	loading: false,
	error: false,
	literals: {
		"contractsLeyend": "Total Contracts",
		"titleStatus": "Pending Contracts",
		"subMessage": "Take a look!",
		"errorTitle": "Were having trouble loading this right now",
		"errorDesc": "Please come again later or try to refresh the page"
	},
	data: {
		"totalContracts": 25,
		"totalPending": 0,
		"ilustration": "../../../../assets/images/pencil.svg",
		"loadingImgSrc": "images/i-descarga.svg"
	}
};
