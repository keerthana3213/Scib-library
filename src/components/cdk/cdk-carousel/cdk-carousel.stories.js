import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Carousel',
	...getStoryConfig('scib-cdk-carousel')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-carousel
		transparent-bg='${parseBoolean(args.transparentBg)}'
		showDots='${parseBoolean(args.hide)}'
		content='${parseObject(args.cardData)}'
	>
	<scib-cdk-ism-contact-list
	literals='${parseObject(args.literals)}'
	card-data='${parseObject(args.cardData)}'
	>
	</scib-cdk-ism-contact-list>
	</scib-cdk-carousel>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	showDots: true,
	literals: {
			title: 'CDKism-contact-list',
			noContact: {
				text: 'There are no relevant contacts at this moment',
				img: 'assets/images/generic-character.svg',
				alt: 'There are not contact list'
			}
	},
	cardData: [
		{
			cardInfo: {
			  fullName: 'Sofía Sanz Poveda',
			  role: 'CEO - Santander Bank',
			  email: 'sofía.sanz.poveda@santander.com',
			  phone: '612 345 678'
			},
			img:
			  {
				src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
				alt: 'Sofía Sanz Poveda'
			  }
	
		},
		{
		cardInfo: {
			fullName: 'Fernando Suarez Gil',
			role: 'Client Manager',
			email: 'email@santander.com',
			phone: '678 901 234'
		},
		img:
			{
			src:
				'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			alt: 'Fernando Suarez Gil'
			}

		},
		{
		cardInfo: {
			fullName: 'Sofía Sanz Poveda',
			role: 'CEO - Santander Bank',
			email: 'sofía.sanz.poveda@santander.com',
			phone: '612 345 678'
		},
		img:
			{
			src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
			alt: 'Sofía Sanz Poveda'
			}

		},
		{
			cardInfo: {
				fullName: 'Fernando Suarez Gil',
				role: 'Client Manager',
				email: 'email@santander.com',
				phone: '678 901 234'
			},
			img:
				{
				src:
					'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				alt: 'Fernando Suarez Gil'
			}
		},
		{
			cardInfo: {
				fullName: 'Fernando Suarez Gil',
				role: 'Client Manager',
				email: 'email@santander.com',
				phone: '678 901 234'
			},
			img:
			{
				src:
					'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				alt: 'Fernando Suarez Gil'
			}
		}
	]
	// Add default values here
};
