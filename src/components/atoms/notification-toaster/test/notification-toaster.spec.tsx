import { h } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { AtomsNotificationToaster } from '../component/notification-toaster';
import { ToasterTypeEnum } from '../models/notification-toaster.model';
describe('atoms-notification-toaster', () => {
	const notificationList = [
		{
			id: 1,
			title: 'New VDR CERT 27/06 Migracion of which you are a participant, has been reopened.',
			content: 'Click here to obtain more information.',
			app: 'vdr',
			type: ToasterTypeEnum.NOTIFICATION
		},
		{
			id: 2,
			users: {
				from: {
					name: 'ASSURANCE 2, QUALITY'
				},
				avatar: {
					src: '',
					alt: 'ASSURANCE 2, QUALITY ASSURANCE 2, QUALITY',
					text: 'AA'
				}
			},
			title: 'asad',
			content: 'test',
			unread: 1,
			type: ToasterTypeEnum.MESSAGE,
			isImportant: false
		}
	];

	let page: SpecPage;
	let listItem: HTMLCollection;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [AtomsNotificationToaster],
			template: () => (
				<scib-atoms-notification-toaster
					open={true}
					itemList={notificationList}
					footerText={'HOME.ACTIVITY_AREA.notificationToaster'}
				></scib-atoms-notification-toaster>
			),
			supportsShadowDom: true
		});

		listItem = page.root.shadowRoot.querySelector('#toaster-content').children;
	});

	describe('render', () => {
		it('should create 2 list element when itemList has 2 elements', async () => {
			expect(listItem.length).toBe(2);
		});
	});
	describe('Notification card', () => {
		it('should emit notificationClicked when clicked the notification card', async () => {
			const component: AtomsNotificationToaster = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.notificationClicked, 'emit');
			const card: HTMLDivElement = listItem[0].querySelector('.card__container') as HTMLDivElement;
			card.click();
			expect(eventEmitSpy).toHaveBeenCalledWith(notificationList[0].id);
		});

		it('should emit notificationClosed when clicked the button with close-icon-container class', async () => {
			const component: AtomsNotificationToaster = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.notificationClosed, 'emit');

			const icon: HTMLDivElement = listItem[0].querySelector('.close-icon-container').children[0] as HTMLDivElement;
			icon.click();
			expect(eventEmitSpy).toHaveBeenCalledWith(notificationList[0].id);
		});
	});
	describe('Message card', () => {
		it('should emit notificationClicked when clicked the message card', async () => {
			const component: AtomsNotificationToaster = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.notificationClicked, 'emit');
			const card: HTMLDivElement = listItem[1].querySelector('.card__container') as HTMLDivElement;
			card.click();
			expect(eventEmitSpy).toHaveBeenCalledWith(notificationList[1].id);
		});
		it('should emit notificationClosed when clicked the button with close-icon-container class', async () => {
			const component: AtomsNotificationToaster = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.notificationClosed, 'emit');
			const icon: HTMLDivElement = listItem[1].querySelector('.close-icon-container').children[0] as HTMLDivElement;
			icon.click();
			expect(eventEmitSpy).toHaveBeenCalledWith(notificationList[1].id);
		});
	});
});
