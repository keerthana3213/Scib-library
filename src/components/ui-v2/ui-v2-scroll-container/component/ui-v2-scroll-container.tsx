import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { get, kebabCase, merge, omit } from 'lodash';
import { parseProp } from '../../../../utils/helpers/common';
import '../lib';
import { ScrollBarInstanceOptions } from '../models/ui-v2-scroll-container.model';

/**
 * Content that you need to make scrollable
 *
 * @slot content
 */
@Component({
	tag: 'scib-ui-v2-scroll-container',
	styleUrl: 'ui-v2-scroll-container.scss',
	shadow: true
})
export class UI_V2ScrollContainer {
	private _containerRef: HTMLElement;
	private _nativeViewPort: HTMLElement;
	private readonly _defaultConfig: ScrollBarInstanceOptions = {
		scrollbarVisibility: 'always',
		verticalScrollbarPosition: 'right',
		horizontalScrollbarPosition: 'bottom'
	};
	private _gapOptions = {
		scrollEventBottomGap: 0,
		scrollEventTopGap: 0
	};

	@Element() _hostRef: HTMLElement;

	@Prop({ attribute: 'id' }) _id: string;

	@Prop() resetScroll: boolean = false;
	@State() _resetScroll: boolean = false;
	@Watch('resetScroll') _resetScrollHandler(newValue: boolean) {
		this._resetScroll = newValue;
		if (this._resetScroll) {
			this._nativeViewPort.scrollTop = 0;
		}
	}

	@Prop() setScrollTop: number;
	@Watch('setScrollTop') _setScrollTopHandler(newValue: number) {
		this._nativeViewPort.scrollTop = newValue;
	}

	/**
	 * Options to overwrit the default config
	 */
	@Prop() options: string | ScrollBarInstanceOptions;
	@State() $options: ScrollBarInstanceOptions = {};
	@Watch('options') _optionsHandler(newValue: string | ScrollBarInstanceOptions) {
		const _options = merge({}, this._defaultConfig, parseProp<ScrollBarInstanceOptions>(newValue, {}));
		this.$options = Object.keys(_options).reduce((acc, key) => {
			if (key === 'scrollEventBottomGap' || key === 'scrollEventTopGap') {
				this._gapOptions[key] = _options[key];
			} else {
				acc[kebabCase(key)] = _options[key];
			}
			return acc;
		}, {});
	}

	@State() $scrollTopPosition: number;

	@Prop() getScrollPosition: boolean;
	@Watch('getScrollPosition') _getScrollPositionHandler(_newValue: boolean) {
		this.scrollBarPosition.emit(this.$scrollTopPosition);
	}

	/**
	 *	Event that emit the position of scrollbar
	 */
	@Event() scrollBarPosition: EventEmitter<number>;

	/**
	 *	Event that emit the instance created of scrollbar
	 */
	@Event() scrollBarInstance: EventEmitter<HTMLElement>;

	/**
	 *	Event that emit when the scrollbar is on the top with gap configuration
	 */
	@Event() scrollTop: EventEmitter<void>;

	/**
	 *	Event that emit when the scrollbar is on the bottom with gap configuration and send the scroll top distance
	 */
	@Event() scrollBottom: EventEmitter<number>;

	/**
	 *	Event that emit if the scroll container has vertical scroll
	 */
	@Event() hasVerticalScroll: EventEmitter<boolean>;

	/**
	 *	Event that emit if the scroll container has horizontal scroll
	 */
	@Event() hasHorizontalScroll: EventEmitter<boolean>;

	/**
	 *
	 */
	@State() $showTopGradiant: boolean = false;

	/**
	 *
	 */
	@State() $showBottomGradiant: boolean = true;

	/**
	 *
	 */
	@State() $topEventEmitted: boolean = true;

	/**
	 *
	 */
	@State() $bottomEventEmitted: boolean = true;

	/**
	 *
	 */
	componentWillLoad() {
		this._optionsHandler(this.options);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._containerRef = this._id
			? this._hostRef.shadowRoot.getElementById(this._id)
			: this._hostRef.shadowRoot.querySelector('scrollable-component');
		this._nativeViewPort = get(this._containerRef, 'viewport');
		this.scrollBarInstance.emit(this._nativeViewPort);
		this._gradiantManager();
		requestAnimationFrame(() => this.checkScrollBarVisibility(this._nativeViewPort));
	}

	/**
	 * Check if the scroll bar is visible
	 * @param viewport
	 */
	private checkScrollBarVisibility(viewport: HTMLElement) {
		const verticalScrollBar = viewport?.parentNode?.querySelector('.vertical-scrollbar');
		const horizontalScrollBar = viewport?.parentNode?.querySelector('.horizontal-scrollbar ');
		setTimeout(() => {
			if (verticalScrollBar) {
				const isHidden = verticalScrollBar?.classList.contains('hidden') || false;
				this.hasVerticalScroll.emit(!isHidden);
			}

			if (horizontalScrollBar) {
				const isHidden = horizontalScrollBar?.classList.contains('hidden') || false;
				this.hasHorizontalScroll.emit(!isHidden);
			}
		}, 200);
	}

	/**
	 * Gradiant manager
	 */
	private _gradiantManager() {
		if (this._containerRef && this._nativeViewPort) {
			this._nativeViewPort.addEventListener('scroll', () => {
				const contentContainer: any = this._hostRef.shadowRoot.querySelector('.content');
				const paddingTop = getComputedStyle(contentContainer).getPropertyValue('--_ui-v2-scroll-container-padding-top');
				const paddingBottom = getComputedStyle(contentContainer).getPropertyValue('--_ui-v2-scroll-container-padding-bottom');
				const scrollHeight = this._nativeViewPort.scrollHeight;
				const scrollTop = this._nativeViewPort.scrollTop;
				if (scrollTop) {
					this.$scrollTopPosition = scrollTop;
				}
				this.$showTopGradiant = scrollTop > 0 + Number(paddingTop.replace(/px$/, ''));
				this.$showBottomGradiant =
					scrollTop + this._nativeViewPort?.offsetHeight < scrollHeight - (Number(paddingBottom.replace(/px$/, '')) || 0);
				this._eventsManager(scrollTop, scrollHeight);
			});
		}
	}

	/**
	 *
	 * @param scrollTop
	 * @param scrollHeight
	 */
	private _eventsManager(scrollTop: number, scrollHeight: number) {
		const { scrollEventTopGap, scrollEventBottomGap } = this._gapOptions;
		const eventTop = scrollTop <= 0 + scrollEventTopGap;
		const eventBottom = scrollTop + this._nativeViewPort?.offsetHeight >= scrollHeight - scrollEventBottomGap;
		if (!this.$topEventEmitted && eventTop) {
			this.$topEventEmitted = true;
			this.scrollTop.emit();
		} else if (!eventTop && this.$topEventEmitted) {
			this.$topEventEmitted = false;
		}
		if (!this.$bottomEventEmitted && eventBottom) {
			this.$bottomEventEmitted = true;
			this.scrollBottom.emit(scrollTop);
		} else if (!eventBottom && this.$bottomEventEmitted) {
			this.$bottomEventEmitted = false;
		}
	}

	render() {
		return (
			<Host>
				<div class="scroll-container">
					<div
						class={{
							'scroll-container__gradiant scroll-container__gradiant--top': true,
							'scroll-container__gradiant--show': this.$showTopGradiant
						}}
					></div>
					<scrollable-component id={this._id ? this._id : ''} {...omit(this.$options, ['scrollEventTopGap', 'scrollEventBottomGap'])}>
						<div class="content">
							<slot />
						</div>
					</scrollable-component>
					<div
						class={{
							'scroll-container__gradiant scroll-container__gradiant--bottom': true,
							'scroll-container__gradiant--show': this.$showBottomGradiant
						}}
					></div>
				</div>
			</Host>
		);
	}
}
