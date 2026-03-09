import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { MoleculesPaginator } from '../component/paginator';

describe('molecules-paginator', () => {
	describe('render', () => {
		it('should call reset and setTotalItems when _paginatorInstance exist and set new totalItems', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => (
					<scib-molecules-paginator paginationInitialPage={2} totalItems={50} paginationSizeSelector={[10]}></scib-molecules-paginator>
				),
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			const eventEmitSpy = jest.spyOn((component as any)._paginatorInstance, 'reset');
			const eventEmitSpy2 = jest.spyOn((component as any)._paginatorInstance, 'setTotalItems');
			component.totalItems = 3;
			await page.waitForChanges();
			expect(eventEmitSpy).toHaveBeenCalledWith(3);
			expect(eventEmitSpy2).toHaveBeenCalledWith(3);
		});
		it('should set paginationSizeSelector as [10,20,30] when it not defined', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator paginationInitialPage={2} totalItems={50}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			expect(component.$paginationSizeSelector).toEqual([10, 20, 30]);
		});
		it('should add paginationSize at paginationSizeSelector and defined like active when paginationSizeSelector does not contain it', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => (
					<scib-molecules-paginator
						paginationSize={15}
						paginationInitialPage={2}
						totalItems={50}
						paginationSizeSelector={[5, 10, 20]}
					></scib-molecules-paginator>
				),
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			expect(component.$paginationSizeSelector).toEqual([5, 10, 15, 20]);
			const buttons: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.items__item__button');
			expect(buttons[0].classList.contains('items__item__button--active')).toBe(false);
			expect(buttons[1].classList.contains('items__item__button--active')).toBe(false);
			expect(buttons[2].classList.contains('items__item__button--active')).toBe(true);
			expect(buttons[3].classList.contains('items__item__button--active')).toBe(false);
		});
		it('should not add paginationSize at paginationSizeSelector (only activate it) when paginationSizeSelector contain it', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => (
					<scib-molecules-paginator
						paginationSize={10}
						paginationInitialPage={2}
						totalItems={50}
						paginationSizeSelector={[5, 10, 20]}
					></scib-molecules-paginator>
				),
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			expect(component.$paginationSizeSelector).toEqual([5, 10, 20]);
			const buttons: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.items__item__button');
			expect(buttons[0].classList.contains('items__item__button--active')).toBe(false);
			expect(buttons[1].classList.contains('items__item__button--active')).toBe(true);
			expect(buttons[2].classList.contains('items__item__button--active')).toBe(false);
		});
		it('should show as many options as paginationButtonCount', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => (
					<scib-molecules-paginator
						paginationButtonCount={4}
						paginationInitialPage={2}
						totalItems={50}
						paginationSizeSelector={[5, 10, 20]}
					></scib-molecules-paginator>
				),
				supportsShadowDom: true
			});
			const buttons: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll(
				'.tui-page-btn:not(.tui-prev,.tui-first-child,.tui-first,.tui-next,.tui-last)'
			);
			expect(buttons.length).toBe(4);
		});
		it('should defined paginator__total class when totalItems is more than 0 and hideTotal is false', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator hideTotal={false} totalItems={3}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const classElement: HTMLElement = page.root.shadowRoot.querySelector('.paginator__total');
			expect(classElement).toBeTruthy();
		});
		it('should defined paginator__options class when paginationSizeSelector is not empty', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator paginationSizeSelector={[0, 1, 20]}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const classElement: HTMLElement = page.root.shadowRoot.querySelector('.paginator__options');
			expect(classElement).toBeTruthy();
		});
		it('should call reset of _paginatorInstance when button is clicked', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator paginationSizeSelector={[0, 1, 20]}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			const eventEmitSpy = jest.spyOn((component as any)._paginatorInstance, 'reset');
			const eventEmitSpy2 = jest.spyOn((component as any)._paginatorInstance, 'setItemsPerPage');
			const button: HTMLButtonElement = page.root.shadowRoot.querySelector('.items__item__button');
			button.click();
			expect(eventEmitSpy).toHaveBeenCalled();
			expect(eventEmitSpy2).toHaveBeenCalled();
		});
		it('should add items__item__button--active class when the option is clicked', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator paginationSizeSelector={[0, 1, 20]}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const buttons: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.items__item__button');
			buttons[1].click();
			await page.waitForChanges();
			expect(buttons[0].classList.contains('items__item__button--active')).toBe(false);
			expect(buttons[1].classList.contains('items__item__button--active')).toBe(true);
			expect(buttons[2].classList.contains('items__item__button--active')).toBe(false);
		});
		it('should defined paginator__ pages when totalItems is 0 or more', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => <scib-molecules-paginator paginationSizeSelector={[0, 1, 20]} totalItems={23}></scib-molecules-paginator>,
				supportsShadowDom: true
			});
			const pages = page.root.shadowRoot.querySelector('.paginator__pages');
			expect(pages).toBeTruthy();
		});
	});
	describe('componentDidLoad', () => {
		it('should call movePageTo when paginationInitialPage is more than 0 and _paginatorInstance exist', async () => {
			const page = await newSpecPage({
				components: [MoleculesPaginator],
				template: () => (
					<scib-molecules-paginator paginationInitialPage={3} totalItems={50} paginationSizeSelector={[10]}></scib-molecules-paginator>
				),
				supportsShadowDom: true
			});
			const component: MoleculesPaginator = page.rootInstance;
			const eventEmitSpy = jest.spyOn((component as any)._paginatorInstance, 'movePageTo');
			const eventEmitSpySecond = jest.spyOn(component.paginationChange, 'emit');
			component.paginationInitialPage = 14;
			await page.waitForChanges();
			expect(eventEmitSpy).toHaveBeenCalledWith(14);
			expect(eventEmitSpySecond).toHaveBeenCalledWith({ currentPage: 5, itemsPerPage: 10 });
		});
	});
});
