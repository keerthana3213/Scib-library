import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Mifid Landing',
	...getStoryConfig('scib-cdk-mifid-landing'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-mifid-landing
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		explore-links='${parseObject(args.exploreLinks)}'
		communication-data='${parseObject(args.communicationData)}'
        src-video='${parseObject(args.srcVideo)}'
        contact-data='${parseObject(args.contactData)}'
	></scib-cdk-mifid-landing>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'mainTitle1': 'MifiD II files',
		'mainTitle2': 'Discover Client Hub',
		'mainTitle3': 'Explore now',
		'reportTitle': 'Access to MifiD II',
		'reportSubtitle': 'Cost and Charges Reports',
		'lastReportLabel': 'Lastest report:',
		'totalReportLabel': 'Total reports:',
		'reportNotice1': 'Exclusive annual notice from',
		'reportNoticeBold': 'Santander Corporate and Investment Banking',
		'reportNotice2': 'to Cost and Charges Report.',
		'discoverText1': 'Take a look at the video an learn more about',
		'discoverTextBold': 'Client Hub',
		'discoverText2': 'Enjoy your new digital experience.'
	},
	data: {
		'lastReportDate': '02/03/2021',
		'totalReportData': '4',
	},
	exploreLinks: [
		{
            'name': 'My profile',
            'description': 'Access to your information',
            'eventId': 'openMyProfile'
		},
		{
            'name': 'Files',
            'description': 'Discover all your files',
            'eventId': 'openMyFiles'
		}
    ],
    communicationData : {
        'title': 'Communication Framework',
        'description': 'Stay informed and communicate worldwide',
        'btnText': 'Open framework',
        'btnEvent': 'openCommunicationFramework'
    },
    contactData : {
        'title': 'Contact',
        'description': 'For any questions about MIFID II report contact through the email:',
        'email': 'annualcostcharges@gruposantander.com'
    },
	srcVideo: [
		{ 'src': 'https://youtu.be/Fg1dbDa79Ps', 'type': 'mp4' },
		{ 'src': 'https://youtu.be/Fg1dbDa79Ps', 'type': 'ogg' },
	],
	// Add default values here
};
