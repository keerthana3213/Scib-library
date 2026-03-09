import { CDKSignatureTableCellStatus } from '../component/cdk-signature-table-cell-status';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('cdk-signature-table-cell-status', () => {
	it('builds', () => {
		expect(new CDKSignatureTableCellStatus()).toBeTruthy();
	});
	describe('render', () => {
		it('should render tooltip over status cell correctly', async () => {
			const tooltip = {
				show: true,
				text: 'text tooltip'
			};
			const page = await newSpecPage({
				components: [CDKSignatureTableCellStatus],
				template: () => (
					<scib-cdk-signature-table-cell-status
						id="signature-cell-status"
						status="pending"
						cell-id="1"
						completed="2"
						total="3"
						color="#CCCCCC"
						literal="Draft"
						is-error={true}
						error="with error"
						show-tooltip={JSON.stringify(tooltip)}
					></scib-cdk-signature-table-cell-status>
				),
				supportsShadowDom: true
			});

			const tooltipHTMLElement: HTMLElement = page.root.shadowRoot.querySelector('.cdk-signature-table__progress');
			expect(tooltipHTMLElement).toBeTruthy();
		});

		it('should not render tooltip over status cell correctly', async () => {
			const tooltip = {
				show: false,
				text: 'text tooltip'
			};
			const page = await newSpecPage({
				components: [CDKSignatureTableCellStatus],
				template: () => (
					<scib-cdk-signature-table-cell-status
						id="signature-cell-status"
						status="pending"
						cell-id="1"
						completed="2"
						total="3"
						color="#CCCCCC"
						literal="Draft"
						is-error={true}
						error="with error"
						show-tooltip={JSON.stringify(tooltip)}
					></scib-cdk-signature-table-cell-status>
				),
				supportsShadowDom: true
			});

			const tooltipHTMLElement: HTMLElement = page.root.shadowRoot.querySelector('.cdk-signature-table__progress-tooltip');
			expect(tooltipHTMLElement).toBeFalsy();
		});
	});
});
