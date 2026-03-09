import ResizeObserver from 'resize-observer-polyfill';
import { getElement } from '@stencil/core';

interface IElementSizeListenerConfig {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
}

export enum IElementSizeListenerBreakpoint {
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
}

/**
 * Resize element observer
 * @param - breakpoints, default:
 * sm:  640
 * md: 1321
 */
export function ElementSizeListener(config?: IElementSizeListenerConfig) {
	/** Default config */
	const br = {
		xs: config?.xs || 360,
		sm: config?.sm || 640,
		md: config?.md || 1321,
	};

	return (proto: any, _prop: string) => {
		const { componentDidLoad } = proto;
		proto.componentDidLoad = function () {
			const elementRef: any = getElement(this);
			const hasSize = _prop === 'size';
			if (componentDidLoad && hasSize) {
				this.__resizeObserver = new ResizeObserver(() => {
					let newBreak: string;
					if (elementRef.clientWidth <= br.xs) newBreak = 'xs';
					else if (elementRef.clientWidth <= br.sm) newBreak = 'sm';
					else if (elementRef.clientWidth <= br.md) newBreak = 'md';
					else newBreak = 'lg';
					if (this.size !== newBreak) {
						this.size = newBreak;
						if (proto.componentDidResize) {
							proto.componentDidResize.apply(this);
						}
					}
				}).observe(elementRef);
				return componentDidLoad.apply(this);
			} else {
				if (!componentDidLoad) console.error('ElementSizeListener error: Stencil "componentDidLoad" hook must be called in component', this);
				if (!hasSize) console.error('ElementSizeListener error: @Prop() size must be declared in component', this);
			}
		};

		// proto.componentDidUnload = function () {
		// 	if (componentDidUnload && this.__resizeObserver) {
		// 		this.__resizeObserver.disconnect();
		// 		return componentDidUnload.apply(this);
		// 	}
		// 	else {
		// 		console.error('ElementSizeListener error: Stencil "componentDidUnload" hook must be called in component', this)
		// 	}
		// }
	};
}
