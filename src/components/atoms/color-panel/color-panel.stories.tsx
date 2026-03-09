import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-atoms-color-panel'),
	title: 'Design System/Atoms/Color Panel'
};
export default meta;

export const Playground: StoryObj = {
	args: {
		panels: [
			{
				status: 'info',
				title: 'Info',
				description: 'you are amazing!',
				action: 'Click here'
			},
			{
				status: 'success',
				title: 'Success!',
				description: 'Everything is awesome'
			},
			{
				status: 'success',
				title: 'Success!'
			},
			{
				status: 'success',
				description: 'Everything is awesome'
			},
			{
				status: 'warning',
				title: 'Warning!',
				description: 'You should check this thing'
			},
			{
				status: 'error',
				title: 'Error!',
				description: 'Sorry but maybe there is a problem'
			},
			{
				title: 'Custom Background, With Color and Icon',
				color: '#4775FF',
				icon: 'santander',
				showClose: true,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
			},
			{
				title: 'Issued',
				id: 'issued',
				color: '#1BB3BC',
				showClose: true,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
			},
			{
				title: 'Pend. paid',
				id: 'pending',
				color: '#F2AB4E',
				showClose: true,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			}
		]
	},
	render: (args) => <scib-atoms-color-panel {...args}></scib-atoms-color-panel>
};

export const PlaygroundSlots: StoryObj = {
	args: {
		panels: [
			{
				status: 'success'
			}
		],
		title: 'The credit note selected exceed the receipts to pay',
		description: `<br><p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<br><p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<br><p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<br><p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>`
	},
	render: (args) => (
		<scib-atoms-color-panel {...args}>
			<h2 slot="title" dangerouslySetInnerHTML={{ __html: (args as any).title }} />
			<p slot="description" dangerouslySetInnerHTML={{ __html: (args as any).description }}></p>
		</scib-atoms-color-panel>
	)
};
