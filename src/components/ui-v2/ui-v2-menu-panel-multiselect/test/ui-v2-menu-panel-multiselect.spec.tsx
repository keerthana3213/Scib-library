import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { UI_V2MenuPanelMultiselect } from '../component/ui-v2-menu-panel-multiselect';

describe('ui-v2-menu-panel-multiselect', () => {
	const menuMock = [
		{
			label: 'Opción 1',
			checked: true,
			id: '1'
		},
		{
			label: 'Opción 2',
			checked: false,
			id: '2',
			submenuIcon: 'chevron-right-small-thin',
			submenuItems: [
				{
					label: 'Opción 2-1',
					checked: false,
					id: '1'
				},
				{
					label: 'Opción 2-2',
					checked: false,
					id: '1'
				}
			]
		},
		{
			label: 'Opción 3',
			checked: false,
			id: '55',
			submenuIcon: 'chevron-right-small-thin',
			submenuItems: [
				{
					label: 'Opción 3-1',
					checked: false,
					id: 'www',
					submenuItems: [
						{
							label: 'Opción 3-1-1',
							checked: false,
							id: 'www'
						}
					]
				}
			]
		}
	];

	describe('With click behavior', () => {
		const openSubmenuOnClickMock = 'click';
		describe('render', () => {
			it('should create 3 list element between desktop and responsive version when itemList has 3 main elements and two of them has 2 submenu elements', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => <scib-ui-v2-menu-panel-multiselect itemList={menuMock}></scib-ui-v2-menu-panel-multiselect>,
					supportsShadowDom: true
				});
				const listItem = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
				expect(listItem.length).toBe(3);
			});
			it('should create 1 span with item-container__multiselect class when only 2 element has submenu icon', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => <scib-ui-v2-menu-panel-multiselect checkIcon="check" itemList={menuMock}></scib-ui-v2-menu-panel-multiselect>,
					supportsShadowDom: true
				});
				const containerClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__item-container__multiselect');
				expect(containerClass.length).toBe(2);
			});
			it('should set style value of the item-container class with the icon check value', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => (
						<scib-ui-v2-menu-panel-multiselect
							checkIcon="check"
							itemList={menuMock}
							openSubmenuOn={openSubmenuOnClickMock}
						></scib-ui-v2-menu-panel-multiselect>
					),
					supportsShadowDom: true
				});
				const containerClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__item-container');
				const firstElement = containerClass[0];
				expect(containerClass.length).toBe(3);
				expect(firstElement.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-check)');
			});
			it('should set style value of the item-container__multiselect class with the icon value', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => <scib-ui-v2-menu-panel-multiselect itemList={menuMock}></scib-ui-v2-menu-panel-multiselect>,
					supportsShadowDom: true
				});
				const containerClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__item-container__multiselect');
				const firstElement = containerClass[0];
				expect(firstElement.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-chevron-right-small-thin)');
			});
			it('should set the content of the item__Text class with the label value', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => <scib-ui-v2-menu-panel-multiselect itemList={menuMock}></scib-ui-v2-menu-panel-multiselect>,
					supportsShadowDom: true
				});

				const liElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');

				const secondLiElement = liElements[1];
				secondLiElement.click();
				await page.waitForChanges();
				const textClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__text');
				const firstElement = textClass[0];
				const secondElement = textClass[1];
				const thirdElement = textClass[2];
				const fourthElement = textClass[3];
				expect(firstElement.textContent).toBe('Opción 1');
				expect(secondElement.textContent).toBe('Opción 2');
				expect(thirdElement.textContent).toBe('Opción 3');
				expect(fourthElement.textContent).toBe('Opción 2-1');
			});
		});
		describe('handleClickedOption', () => {
			it('should emit sendSelectedOptions when item is clicked', async () => {
				const selectedItems = [{ label: 'Opción 1', checked: true, id: '1' }];
				const obj = {
					lastSelectedItem: {
						checked: true,
						id: '1',
						label: 'Opción 2-1'
					},
					updatedItemList: selectedItems
				};
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => <scib-ui-v2-menu-panel-multiselect itemList={menuMock} open={true}></scib-ui-v2-menu-panel-multiselect>,
					supportsShadowDom: true
				});
				const component: UI_V2MenuPanelMultiselect = page.rootInstance;
				const emitsendSelectOptions = jest.spyOn(component.sendSelectedOptions, 'emit');
				const liElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
				const secondLiElement = liElements[1];
				secondLiElement.click();
				await page.waitForChanges().then(async () => {
					const newliElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
					const thirdLiElement = newliElements[3];
					thirdLiElement.click();
					await page.waitForChanges();
				});
				expect(emitsendSelectOptions).toHaveBeenCalledWith(obj);
			});
			it('should be unchecked when checked item is clicked', async () => {
				const page = await newSpecPage({
					components: [UI_V2MenuPanelMultiselect],
					template: () => (
						<scib-ui-v2-menu-panel-multiselect checkIcon="check" itemList={menuMock} open={true}></scib-ui-v2-menu-panel-multiselect>
					),
					supportsShadowDom: true
				});
				const component: UI_V2MenuPanelMultiselect = page.rootInstance;
				const liElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
				/* First item is checked at the first time */
				const firtLiElement = liElements[0];
				firtLiElement.click();
				await page.waitForChanges();
				expect(component.$cardItemsList[0][0].checked).toBe(false);
				firtLiElement.click();
				await page.waitForChanges();
				expect(component.$cardItemsList[0][0].checked).toBe(true);
			});
		});
	});
	describe('With hover behavior', () => {
		const openSubmenuOnHoverMock = 'hover';

		it('should change cards on change selections', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanelMultiselect],
				template: () => (
					<scib-ui-v2-menu-panel-multiselect
						checkIcon="check"
						itemList={menuMock}
						openSubmenuOn={openSubmenuOnHoverMock}
					></scib-ui-v2-menu-panel-multiselect>
				),
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanelMultiselect = page.rootInstance;
			const liElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
			liElements[2].click();
			await page.waitForChanges().then(async () => {
				const textClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__text');
				expect(textClass.length).toBe(4);
				expect(component.$cardItemsList.length).toBe(2);

				const newliElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
				newliElements[3].click();
				await page.waitForChanges().then(async () => {
					expect(textClass.length).toBe(4);
					expect(component.$cardItemsList.length).toBe(3);
					newliElements[1].click();
					await page.waitForChanges().then(() => {
						expect(component.$cardItemsList.length).toBe(2);
					});
				});
			});
		});

		it('should reset cards on click out of component', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanelMultiselect],
				template: () => (
					<scib-ui-v2-menu-panel-multiselect
						checkIcon="check"
						itemList={menuMock}
						openSubmenuOn={openSubmenuOnHoverMock}
						open={true}
					></scib-ui-v2-menu-panel-multiselect>
				),
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanelMultiselect = page.rootInstance;
			const liElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
			liElements[2].click();
			await page.waitForChanges().then(async () => {
				const textClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__text');
				expect(textClass.length).toBe(4);
				expect(component.$cardItemsList.length).toBe(2);

				const newliElements: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
				newliElements[3].click();
				await page.waitForChanges().then(async () => {
					expect(textClass.length).toBe(4);
					expect(component.$cardItemsList.length).toBe(3);

					const simulateClick: any = new MouseEvent('click', {
						view: window,
						bubbles: true,
						cancelable: true,
						clientX: 1000,
						clientY: 1000
					});
					const sendClickOutOfMenu = jest.spyOn(component.sendClickOnElement, 'emit');
					window.dispatchEvent(simulateClick);
					expect(sendClickOutOfMenu).toBeCalledTimes(1);
				});
			});
		});
	});
});
