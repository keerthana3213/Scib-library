import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import * as tabulatorModule from 'tabulator-tables';
import { OrganismsDataTable } from '../component/data-table';

class TabulatorStub {
	static extendModule(_name, _property, _values) {}
	constructor(public element: HTMLElement, public options) {}
	redraw = jest.fn();
	setColumns = jest.fn();
	replaceData = jest.fn();
	setPageSize = jest.fn();
	setPage = jest.fn();
	on = jest.fn();
}

(tabulatorModule as any).default.TabulatorFull = TabulatorStub;

describe('organisms-data-table', () => {
	it('builds', () => {
		expect(new OrganismsDataTable()).toBeTruthy();
	});
	const columMock = [
		{
			title: 'Status',
			field: 'status',
			width: 150,
			formatter: 'status',
			formatterParams: {
				Issued: 'green',
				'Pending paid': 'blue'
			}
		},
		{
			title: 'Date',
			field: 'date',
			hozAlign: 'left',
			formatter: 'datetime',
			formatterParams: {
				inputFormat: 'yyyy-LL-dd',
				outputFormat: 'dd/LL/yyyy',
				invalidPlaceholder: '(invalid date)'
			}
		}
	];
	const configMock = {
		paginationSizeSelector: [10, 20, 30],
		paginationButtonCount: 3,
		paginationInitialPage: 1,
		paginationSize: 10,
		totalItems: 15
	};
	const rowDataMock = [
		{
			status: 'Issued',
			date: '2021-10-27',
			suplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '23/11/2021',
			invoiceAmount: '9.544,48',
			currency: 'EUR',
			invoiceBankCode: '2020000231'
		},
		{
			status: 'Pending paid',
			date: '2021-10-28',
			suplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '23/11/2021',
			invoiceAmount: '9.544,48',
			currency: 'ELENA',
			invoiceBankCode: '2020000231'
		}
	];
	describe('render', () => {
		it('it should hide the skeleton and show the table when the table is loaded', async () => {
			const page = await newSpecPage({
				components: [OrganismsDataTable],
				template: () => <scib-organisms-data-table loading={false} controlManager={'delegate'}></scib-organisms-data-table>,
				supportsShadowDom: true
			});
			const table: HTMLElement = page.root.shadowRoot.querySelector('.data-table');
			const skeleton: HTMLElement = page.root.shadowRoot.querySelector('.skeleton');
			expect(skeleton.style.display).toBe('none');
			expect(table.style.display).toBe('block');
		});
		it('it should show the skeleton and hide the table when the table is loading', async () => {
			const page = await newSpecPage({
				components: [OrganismsDataTable],
				template: () => <scib-organisms-data-table loading={true} controlManager={'delegate'}></scib-organisms-data-table>,
				supportsShadowDom: true
			});
			const table: HTMLElement = page.root.shadowRoot.querySelector('.data-table');
			const skeleton: HTMLElement = page.root.shadowRoot.querySelector('.skeleton');
			expect(skeleton.style.display).toBe('block');
			expect(table.style.display).toBe('none');
		});
	});
});
