import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Pitch Section Container',
	...getStoryConfig('scib-cdk-pitch-section-container'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-pitch-section-container
		literals='${parseObject(args.literals)}'
		props='${parseObject(args.props)}'
	></scib-cdk-pitch-section-container>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		sectionTitle: 'Personal Pitches',
		mainTitle: 'Create your own pitches',
		titleDescription: 'Add Power Point files, tombstones and more to create your own pitch. You can also share and download it.',
		add: 'New Pitch',
		imgUrl: 'images/background-pitch.png',
		btnOpen: 'Open',
	},
	props: {
		title: 'Area name',
		personalPitch: true,
		pitches: [
			{
				id: '1',
				title: 'Pitch',
				url: '/test',
				btnUrl: '/testBoton',
				actions: [
					{
						text: 'Download',
						icon: 'icon-download',
						eventId: 'downloadPitch',
					},
					{
						text: 'Share',
						icon: 'icon-share-24',
						eventId: 'sharePitch',
					},
					{
						text: 'Options',
						icon: 'icon-menu',
						eventId: 'optionsPitch',
						options: [
							{
								text: 'Edit Pitch',
								icon: 'icon-edit-pencil',
								eventId: 'editPitch'
							},
							{
								text: 'Duplicate Pitch',
								icon: 'icon-duplicate-clipboard',
								eventId: 'duplicatePitch'
							},
							{
								text: 'Delete Pitch',
								icon: 'icon-delete',
								eventId: 'deletePitch'
							}
						],
					}]
			},
			{
				id: '2',
				title: 'Pitch',
				url: '/test',
				btnUrl: '/testBoton',
				actions: [],
			},
			{
				id: '3',
				title: 'Pitch',
				url: '/test',
				btnUrl: '/testBoton',
				actions: [],
			},
		],
	},
	// Add default values here
};
