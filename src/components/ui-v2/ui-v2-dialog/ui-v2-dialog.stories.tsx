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
	...getStoryConfig('scib-ui-v2-dialog'),
	title: 'Design System/Atoms/Dialog',
	render: (args) => (
		<scib-ui-v2-dialog {...args}>
			<div slot="header" dangerouslySetInnerHTML={{ __html: args.header }} />
			<div slot="content" dangerouslySetInnerHTML={{ __html: args.content }} />
			<div slot="actions" dangerouslySetInnerHTML={{ __html: args.actions }} />
		</scib-ui-v2-dialog>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		dialogTitle: 'Modal title',
		dialogSubtitle: 'This is a subtitle',
		open: true,
		content: `<p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>
		<p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>
			`,
		actions: 'Actions slot',
		header: `test`
	}
};

export const WithoutAutoClose: StoryObj = {
	args: {
		dialogTitle: 'Modal title',
		open: true,
		preventClose: true,
		content: `<p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>
		<p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>
			`,
		actions: 'Actions slot',
		header: `test`
	}
};

export const WithSteps: StoryObj = {
	render: (args) => (
		<scib-ui-v2-dialog {...args}>
			<div slot="info">
				<scib-atoms-steps steps={args.steps} />
			</div>
			<div slot="header" dangerouslySetInnerHTML={{ __html: args.header }} />
			<div slot="content" dangerouslySetInnerHTML={{ __html: args.content }} />
			<div slot="actions" dangerouslySetInnerHTML={{ __html: args.actions }} />
		</scib-ui-v2-dialog>
	),
	args: {
		dialogTitle: 'Modal title',
		open: true,
		content: `<p>Minions ipsum aaaaaah chasy potatoooo belloo! Me want bananaaa! Bananaaaa hana dul sae baboiii belloo! Bee do bee do bee do belloo! Me want bananaaa! Para tú jeje la bodaaa pepete aaaaaah po kass daa uuuhhh. Me want bananaaa! hahaha la bodaaa chasy poopayee bappleees. Tulaliloo poopayee jiji la bodaaa uuuhhh.</p>
		<p>Baboiii potatoooo poopayee ti aamoo! Jeje bee do bee do bee do poopayee gelatooo. Tulaliloo pepete wiiiii belloo! Tank yuuu! Jiji hahaha chasy tulaliloo belloo! Wiiiii para tú gelatooo ti aamoo! Tulaliloo daa wiiiii butt baboiii gelatooo. Jiji hahaha uuuhhh baboiii bee do bee do bee do para tú poulet tikka masala belloo! Uuuhhh me want bananaaa! Bee do bee do bee do. Aaaaaah poopayee ti aamoo! Me want bananaaa! Chasy gelatooo. Aaaaaah aaaaaah chasy wiiiii.</p>
		<p>Bappleees aaaaaah ti aamoo! Poulet tikka masala wiiiii. Daa wiiiii hahaha gelatooo. Underweaaar butt pepete pepete tatata bala tu hana dul sae. Baboiii me want bananaaa! Potatoooo po kass. Po kass jeje tatata bala tu gelatooo aaaaaah aaaaaah. Butt tank yuuu! La bodaaa ti aamoo! Poopayee jeje aaaaaah bananaaaa jiji ti aamoo! Wiiiii. Baboiii baboiii poulet tikka masala daa underweaaar potatoooo uuuhhh jeje. La bodaaa wiiiii daa belloo! Bappleees belloo! Po kass pepete tatata bala tu chasy.</p>
		<p>Tatata bala tu la bodaaa tulaliloo ti aamoo! Baboiii. Pepete chasy la bodaaa bee do bee do bee do baboiii poopayee po kass. Bananaaaa chasy ti aamoo! Po kass poopayee ti aamoo! Me want bananaaa! poopayee tulaliloo jiji poulet tikka masala tulaliloo hahaha bee do bee do bee do belloo! Chasy pepete. Belloo! po kass belloo! Jeje gelatooo daa wiiiii baboiii tulaliloo hahaha hahaha. Jeje po kass hana dul sae baboiii bappleees ti aamoo! Potatoooo poulet tikka masala po kass po kass po kass. Underweaaar bananaaaa hahaha tatata bala tu underweaaar gelatooo ti aamoo!</p>
		`,
		actions: 'Actions slot',
		header: `Header`,
		info: 'Extra content',
		steps: [
			{
				id: 1,
				value: 'Selection',
				active: false
			},
			{
				id: 2,
				value: 'Configuration',
				active: true
			},
			{
				id: 3,
				value: 'Confirmation',
				active: false
			}
		]
	}
};
