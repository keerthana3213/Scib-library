import { newSpecPage } from '@stencil/core/testing';
import { UIButton } from '../component/ui-button';
import { h } from '@stencil/core';

describe('ui-button', () => {
	describe('render', () => {
		it('should render the text inside the button element', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button loading={false} customData={'String'}>
						Content
					</scib-ui-button>
				)
			});
			const button: HTMLElement = page.body.querySelector('button');
			expect(button.textContent).toBe('Content');
		});
		it('should emit eventClickWithData when click the button, loading false and has customData', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button loading={false} customData={'String'}>
						Content
					</scib-ui-button>
				)
			});
			const component: UIButton = page.rootInstance;
			const eventClickWithData = spyOn(component.eventClickWithData, 'emit');
			const button: HTMLElement = page.body.querySelector('button');
			button.click();
			expect(eventClickWithData).toHaveBeenCalled();
		});
		it('should set title with the tooltip value', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button loading={false} customData={'String'} tooltip={'TooltipString'}>
						Content
					</scib-ui-button>
				)
			});
			const button: HTMLElement = page.body.querySelector('button');
			expect(button.getAttribute('title')).toBe('TooltipString');
		});
		it('should emit eventClick when click the button, loading false and has not customData', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => <scib-ui-button loading={false}>Content</scib-ui-button>
			});
			const component: UIButton = page.rootInstance;
			const eventClick = spyOn(component.eventClick, 'emit');
			const button: HTMLElement = page.body.querySelector('button');
			button.click();
			expect(eventClick).toHaveBeenCalled();
		});
		it('should not call any emit when loading is true', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => <scib-ui-button loading={true}> </scib-ui-button>
			});
			const component: UIButton = page.rootInstance;
			const eventEmitWithData = spyOn(component.eventClickWithData, 'emit');
			const eventClick = spyOn(component.eventClick, 'emit');
			const button: HTMLElement = page.body.querySelector('button');
			button.click();
			expect(eventClick).not.toHaveBeenCalled();
			expect(eventEmitWithData).not.toHaveBeenCalled();
		});
		it('should define --left class when iconLeft is true and icon is not empty', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button iconLeft={true} icon={'string'}>
						Content
					</scib-ui-button>
				)
			});
			const leftClass: HTMLElement = page.body.querySelector('.--left');
			expect(leftClass).toBeTruthy();
		});
		it('should define the specific class when disabledTooltip is not empty and disabled is true', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button disabled={true} classTooltip={'class'} disabledTooltip={'string'}>
						Content
					</scib-ui-button>
				)
			});
			const className = page.body.querySelector('.class');
			expect(className).toBeTruthy();
		});
		it('should define img when image and imageLeft are true and icon does not exist', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => <scib-ui-button disabled={true} image={true} imageLeft={true}></scib-ui-button>
			});
			const img = page.body.querySelector('img');
			expect(img).toBeTruthy();
		});
		it('should define img with alt and src definition when imageDescriptionText and imageSrc is defined', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => (
					<scib-ui-button imageDescriptionText={'text to describe'} imageSrc={'srcImage'} disabled={true} image={true} imageLeft={true}>
						Content
					</scib-ui-button>
				)
			});
			const component: UIButton = page.rootInstance;
			const img = page.body.querySelector('img');
			component.imageDescriptionText = 'text to describe';
			expect(img.src).toBe('http://testing.stenciljs.com/srcImage');
			expect(img.getAttribute('alt')).toBe('text to describe');
		});
		it('should define img with alt and src null when imageDescriptionText and imageSrc is undefined', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => <scib-ui-button disabled={true} image={true} imageLeft={true}></scib-ui-button>
			});
			const component: UIButton = page.rootInstance;
			component.imageSrc = '';
			const img = page.body.querySelector('img');
			expect(img.alt).toBe(undefined);
			expect(img.src).toBe('http://testing.stenciljs.com/');
		});
		it('should define right block when icon exist and iconLeft is false', async () => {
			const page = await newSpecPage({
				components: [UIButton],
				template: () => <scib-ui-button icon={'string'} iconLeft={false}></scib-ui-button>
			});
			const rightSite = page.body.querySelector('.--right');
			expect(rightSite).toBeTruthy();
		});
	});
});
