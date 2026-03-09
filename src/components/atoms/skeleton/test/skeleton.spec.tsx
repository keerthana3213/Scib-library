import { AtomsSkeleton } from '../component/skeleton';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('atoms-skeleton', () => {
	describe('render', () => {
		it('should set src property on the image element', async () => {
			const page = await newSpecPage({
				components: [AtomsSkeleton],
				template: () => <scib-atoms-skeleton></scib-atoms-skeleton>,
				supportsShadowDom: true
			});
			const img: HTMLImageElement = page.root.shadowRoot.querySelector('.skeleton__image');
			expect(img.src).toBeTruthy();
		});
	});
	describe('_getSkeletonImage', () => {
		it('should return the sm image when windowWidth is 200 (sm)', () => {
			const component = new AtomsSkeleton();
			const image = (component as any)._getSkeletonImage(200, 'table');
			expect(image).toBe('images/skeleton/table-desktop.svg');
		});
		it('should return the md image when windowWidth is 900 (md)', () => {
			const component = new AtomsSkeleton();
			const image = (component as any)._getSkeletonImage(900, 'table');
			expect(image).toBe('images/skeleton/table-desktop.svg');
		});
		it('should return the default image when windowWidth is 1300 (lg)', () => {
			const component = new AtomsSkeleton();
			const image = (component as any)._getSkeletonImage(1300, 'table');
			expect(image).toBe('images/skeleton/table-desktop.svg');
		});
		it('should return the md image when windowWidth is 900 (md) and default type', () => {
			const component = new AtomsSkeleton();
			const image = (component as any)._getSkeletonImage(900, 'default');
			expect(image).toBe('images/skeleton/skeleton-default.svg');
		});
		it('should return the default image when the imageType is not in the Skeleton object', () => {
			const component = new AtomsSkeleton();
			const image = (component as any)._getSkeletonImage(900, 'wrong');
			expect(image).toBe('images/skeleton/skeleton-default.svg');
		});
	});
});
