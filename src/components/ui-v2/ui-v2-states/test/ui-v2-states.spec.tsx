import { UI_V2States } from '../component/ui-v2-states';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-states', () => {
	const statesMock = [
		{
			state: 'complete',
			label: 'issued'
		},
		{
			state: 'complete',
			label: 'paid'
		},
		{
			state: 'draw',
			label: 'warning'
		},
		{
			state: 'cancel',
			label: 'cancel'
		},
		{
			state: 'incomplete',
			label: 'collected'
		},
		{
			state: 'nuevo',
			label: 'vacio'
		}
	];

	describe('render', () => {
		it('should render 0 elements when provided 0 states', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => <scib-ui-v2-states></scib-ui-v2-states>
			});
			const states = page.root.shadowRoot.querySelector('.state').children;
			expect(states.length).toBe(0);
		});
		it('should render 1 elements when provided 1 states', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => (
					<scib-ui-v2-states
						states={[
							{
								state: 'nuevo',
								label: 'vacio'
							}
						]}
					></scib-ui-v2-states>
				)
			});
			const states = page.root.shadowRoot.querySelector('.state').children;
			expect(states.length).toBe(1);
		});
		it('should render 6 elements when provided 6 states', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => <scib-ui-v2-states states={statesMock}></scib-ui-v2-states>
			});
			const states = page.root.shadowRoot.querySelector('.state').children;
			expect(states.length).toBe(6);
		});
		it('should set background as defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => (
					<scib-ui-v2-states
						states={[
							{
								state: 'complete',
								background: 'red',
								color: 'white',
								label: 'issued'
							}
						]}
					></scib-ui-v2-states>
				)
			});
			const figure: HTMLElement = page.root.shadowRoot.querySelector('.state__figure');
			expect(figure.style.background).toBe('red');
		});
		it('should set icon as defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => (
					<scib-ui-v2-states
						states={[
							{
								state: 'complete',
								background: 'red',
								color: 'white',
								label: 'issued',
								icon: 'warning'
							}
						]}
					></scib-ui-v2-states>
				)
			});
			const figure: HTMLElement = page.root.shadowRoot.querySelector('.state__figure');
			expect(figure.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-warning)');
		});
		it('should set color as defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => (
					<scib-ui-v2-states
						states={[
							{
								state: 'complete',
								background: 'red',
								color: 'white',
								label: 'issued'
							}
						]}
					></scib-ui-v2-states>
				)
			});
			const icon: HTMLElement = page.root.shadowRoot.querySelector('.state__icon');
			expect(icon.style.color).toBe('white');
		});
		it('should set label content as defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2States],
				template: () => (
					<scib-ui-v2-states
						states={[
							{
								state: 'complete',
								background: 'red',
								color: 'white',
								label: 'issued'
							}
						]}
					></scib-ui-v2-states>
				)
			});
			const state: HTMLElement = page.root.shadowRoot.querySelector('.state__group');
			expect(state.textContent).toBe('issued');
		});
	});
});
