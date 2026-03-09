import { MDCDrawer } from '@material/drawer';
import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash';
import { BackgroundColorVariant } from '../../../../shared/models';
import { preventEvents, removePreventEvents } from '../../../../utils/helpers/common';
import { ScrollBarInstanceOptions } from '../../ui-v2-scroll-container/models/ui-v2-scroll-container.model';

/**
 * Component description
 *
 * @slot top - Fixed slot section at top of drawer
 * @slot content - Slot by default inside scroll panel
 * @slot bottom - Fixed slot section at bottom of drawer
 */
@Component({
	tag: 'scib-ui-v2-drawer',
	styleUrl: 'ui-v2-drawer.scss',
	shadow: true
})
export class UI_V2Drawer {
	private _drawerRef: MDCDrawer;
	private _moveEvents: string[] = ['wheel', 'touchmove'];

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: BackgroundColorVariant = 'white';

	/**
	 *
	 */
	@Prop() resetScroll: boolean = false; // TODO: use method
	@State() _resetScroll: boolean = false;
	@Watch('resetScroll') _resetScrollHandler(newValue: boolean) {
		this._resetScroll = !!newValue;
	}

	/**
	 *
	 */
	@Prop() setScrollTop: number;
	@State() _setScrollTop: number = 0;
	@Watch('setScrollTop') _setScrollTopHandler(newValue: number) {
		this._setScrollTop = newValue;
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) open: boolean;
	@Watch('open') _openHandler(newValue: boolean | undefined) {
		if (this._drawerRef) {
			this._drawerRef.open = !!newValue;
		}
	}

	/**
	 *
	 */
	@Prop() text: string;
	@State() $text: string;
	@Watch('text') _textHandler(newValue: string | undefined) {
		this.$text = newValue;
	}

	/**
	 *
	 */
	@Prop() leftIcon: string;
	@State() $leftIcon: string;
	@Watch('leftIcon') _leftIconHandler(newValue: string | undefined) {
		this.$leftIcon = newValue;
	}

	/**
	 *
	 */
	@Prop() rightSide: boolean;
	@State() $rightSide: boolean;
	@Watch('rightSide') _rightSideHandler(newValue: boolean | undefined) {
		this.$rightSide = newValue;
	}

	/**
	 *
	 */
	@Prop() fullScreenMobile: boolean = false;

	/**
	 * Options to overwrit the default config
	 */
	@Prop() options: ScrollBarInstanceOptions;
	@State() $options: ScrollBarInstanceOptions = {};
	@Watch('options') _optionsHandler(newValue: ScrollBarInstanceOptions) {
		this.$options = newValue;
	}

	/**
	 *
	 */
	@Prop({ attribute: 'scroll' }) scroll: any = true;

	/**
	 *	Event that emit the instance created of scrollbar
	 */
	@Event() scrollBarInstance: EventEmitter<HTMLElement>;

	/**
	 *	Event that emit when the scrollbar is on the top with gap configuration
	 */
	@Event() scrollTop: EventEmitter<void>;

	/**
	 *	Event that emit when the scrollbar is on the bottom with gap configuration
	 */
	@Event() scrollBottom: EventEmitter<void>;

	/**
	 *
	 */
	@Method() async openDrawer() {
		if (this._drawerRef) {
			this._drawerRef.open = true;
		}
	}

	/**
	 *
	 */
	@Method() async closeDrawer() {
		if (this._drawerRef) {
			this._drawerRef.open = false;
		}
	}

	@Prop() getScrollPosition: boolean;

	/**
	 *	Event that emit the position of scrollbar
	 */
	@Event() scrollBarPosition: EventEmitter<number>;

	/**
	 *
	 */
	@Event() closed: EventEmitter<void>;

	/**
	 *
	 */
	@Event() opened: EventEmitter<void>;

	/**
	 *
	 */
	@Event() leftIconHandler: EventEmitter<void>;

	/**
	 *
	 */
	componentWillLoad() {
		this._textHandler(this.text);
		this._optionsHandler(this.options);
		this._rightSideHandler(this.rightSide);
		this._leftIconHandler(this.leftIcon);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._drawerRef = MDCDrawer.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-drawer'));
		this._drawerRef.open = this.open;
		this._initListeners();
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._drawerRef) && this._drawerRef.destroy) {
			try {
				removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
				this._drawerRef?.unlisten('MDCDrawer:closed', () => {});
				this._drawerRef?.unlisten('MDCDrawer:opened', () => {});
				this._drawerRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 *
	 */
	private _initListeners() {
		this._drawerRef.listen('MDCDrawer:opened', () => {
			preventEvents(this._hostRef.shadowRoot, this._moveEvents);
			this.opened.emit();
		});
		this._drawerRef.listen('MDCDrawer:closed', () => {
			removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
			this._hostRef.removeAttribute('open');
			this.closed.emit();
		});
	}

	/**
	 *
	 */
	private _closeDrawer() {
		this._drawerRef.open = false;
	}

	/**
	 *
	 */
	private _clickLeftIcon() {
		this.leftIconHandler.emit();
	}

	render() {
		return (
			<Host>
				<aside
					class={{
						'mdc-drawer mdc-drawer--modal': true,
						'mdc-drawer--full-screen-mobile': this.fullScreenMobile,
						'mdc-drawer--right': this.$rightSide
					}}
				>
					<div class="mdc-drawer__content">
						<div class="mdc-drawer__header">
							{this.$leftIcon && (
								<button class="mdc-drawer__header__left-icon">
									<span
										style={{ '--icon-content': `var(--theme-scib-icon-${this.$leftIcon})` }}
										onClick={() => this._clickLeftIcon()}
									>
										<i class="icon" />
									</span>
								</button>
							)}
							<span class="mdc-drawer__header__title">{this.$text}</span>
							<button class="mdc-drawer__header__close">
								<span style={{ '--icon-content': `var(--theme-scib-icon-close)` }} onClick={() => this._closeDrawer()}>
									<i class="icon" />
								</span>
							</button>
						</div>
						<div class="mdc-drawer__wrapper">
							<div class="mdc-drawer__wrapper__top">
								<slot name="top" />
							</div>
							<div class="mdc-drawer__wrapper__content">
								{this.scroll ? (
									<scib-ui-v2-scroll-container
										id="scrollId"
										options={this.$options}
										resetScroll={this._resetScroll}
										getScrollPosition={this.getScrollPosition}
										onScrollBarPosition={(event) => this.scrollBarPosition.emit(event.detail)}
										setScrollTop={this._setScrollTop}
										onScrollTop={() => this.scrollTop.emit()}
										onScrollBottom={() => this.scrollBottom.emit()}
										onScrollBarInstance={(event) => this.scrollBarInstance.emit(event?.detail)}
									>
										<slot />
									</scib-ui-v2-scroll-container>
								) : (
									<div>
										<slot />
									</div>
								)}
							</div>
							<div class="mdc-drawer__wrapper__bottom">
								<slot name="bottom" />
							</div>
						</div>
					</div>
				</aside>
				<div class="mdc-drawer-scrim"></div>
			</Host>
		);
	}
}
