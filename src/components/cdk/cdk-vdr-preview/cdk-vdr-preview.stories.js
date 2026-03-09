import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Preview',
	...getStoryConfig('scib-cdk-vdr-preview')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-preview
		is-loading=${parseBoolean(args.loading)}
		error-on-loading=${parseBoolean(args.error)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-cdk-vdr-preview>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	loading: false,
	error: false,
	literals: {
		"activeVDR": "My Active VDR",
		"activeTopic": "My Active Topics",
		"recentActivity": "Recent Activity",
		"errorTitle": "Were having trouble loading this right now",
		"errorDesc": "Please come again later or try to refresh the page"
	},
	data: {
		"activeVDR": 2,
		"activeTopic": 5,
		"recentVDR": [
			{
				"title": "Innovation budget Q4 2020",
				"url": "https://employee.pre.corp/vdr/62/"
			},
			{
				"title": "Taskforce for SSIs project rollout",
				"url": "https://employee.pre.corp/vdr/64/"
			},
			{
				"title": "Taskforce for SSIs for project rollout",
				"url": "https://employee.pre.corp/vdr/34/"
			}
		],
		"loadingImgSrc": "images/i-descarga.svg"
	}
};
