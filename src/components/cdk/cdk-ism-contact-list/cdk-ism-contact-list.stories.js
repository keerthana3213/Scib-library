import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Contact List',
	...getStoryConfig('scib-cdk-ism-contact-list')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-contact-list
		hide='${parseBoolean(args.hide)}'
		literals='${parseObject(args.literals)}'
		card-data='${parseObject(args.cardData)}'
		has-permission='${parseBoolean(args.hasPermission)}'
	>
	</scib-cdk-ism-contact-list>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'CDKism-contact-list',
		noContact: {
			text: 'There are no relevant contacts at this moment',
			img: 'assets/images/generic-character.svg',
			alt: 'There are not contact list'
		}
	},
	cardData: [{
		cardInfo: {
		  fullName: 'Sofía Sanz Poveda',
		  role: 'CEO - Santander Bank',
		  email: 'sofía.sanz.poveda@santander.com',
		  phone: '612 345 678',
		  tagText: "RM",
		  showTag: true
		},
		img:
		{
			src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
			alt: 'Sofía Sanz Poveda'
		},
		extraInfo:{
			position: "CEO",
			department: "Santander Bank"
		}

	  },
	  {
		cardInfo: {
		  fullName: 'Fernando Suarez Gil',
		  role: 'Client Manager',
		  email: 'fernando.suarez@grupoexterno.santander.com',
		  phone: '678 901 234',
		  showTag: false
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

	  }],
	hasPermission: true
	// Add default values here
};
