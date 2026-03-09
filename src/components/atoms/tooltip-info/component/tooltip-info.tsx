import { Component, Host, h, Prop, Watch, Element, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Arrow, DisableReposition, Visibility } from '../models/tooltip-info.model';
import { isEmpty } from 'lodash';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-tooltip-info',
	styleUrl: 'tooltip-info.scss',
	shadow: true
})
export class AtomsTooltipInfo {
	@Element() _hostRef: HTMLElement;

	public _tooltip: HTMLElement;
	public _timeOut: any;
	/**
	 * Oculta el contenido del slot (Uso en CSS)
	 */
	@Prop({ reflect: true }) visibility: Visibility = 'visible';

	/**
	 * Tooltip position
	 */
	@Prop({ mutable: true, reflect: true }) arrow: Arrow;
	@Watch('arrow') _arrowHandler(newValue: string) {
		if (this._tooltip && (newValue === 'left' || newValue === 'right')) {
			this._tooltip.style.removeProperty('--_atoms-tooltip-info-arrow-left');
			this._tooltip.style.removeProperty('--_atoms-tooltip-info-box-left');
		}
	}

	/**
	 * Time to appear (ms)
	 */
	@Prop() delay: number = 0;

	/**
	 *	Título del tooltip
	 */
	@Prop() headerText: string = '';

	/**
	 *	Texto que aparecerá el tooltip
	 */
	@Prop() literalsTooltip: string;

	/**
	 * Custom literals for accessibility
	 */
	@Prop() customLiterals: { [key: string]: string };

	/**
	 * Maximum width for the tooltip box
	 */
	@Prop() maxWidth: string;
	@Watch('maxWidth') _maxWidthHandler(newValue: string) {
		if (!!newValue) {
			this._hostRef.style.setProperty('--atoms-tooltip-info-box-max-width', newValue);
			this._hostRef.style.setProperty('--atoms-tooltip-info-white-space', `normal`);
		}
	}

	/**
	 *	Allow repositioning of the tooltip due to screen resizing.
	 *  Horizontal moves the tooltip position and vertical changes the arrow bottom - top
	 */
	@Prop() disableReposition: DisableReposition;

	/**
	 * Reposition margin in pixels to add in vertical translate
	 */
	@Prop() repositionMarginVertical: number = 25;

	/**
	 * Reposition margin in pixels to add in horizontal translate
	 */
	@Prop() repositionMarginHorizontal: number = 25;

	/**
	 * Custom vertical offset in pixels to adjust tooltip position
	 */
	@Prop() offsetY: number = 0;

	/**
	 * controls the resizing of the screen to adjust the position of the tooltip box
	 */
	@Listen('resize', { target: 'window' })
	handleResizeWindow() {
		this.handleReposition();
	}

	/**
	 *
	 */
	@Listen('horizontalScroll', { target: 'window' })
	handleHorizontalScroll() {
		this.handleReposition();
	}

	componentWillLoad() {
		this._maxWidthHandler(this.maxWidth);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._tooltip = this._hostRef.shadowRoot.querySelector('.tooltip-info__box');
		setTimeout(() => this.handleResizeWindow(), 1000);
	}

	/**
	 * Add a necesary class to show the toltip after 'delay' ms
	 */
	addClass() {
		if (this.headerText != '' || this.literalsTooltip != '') {
			this._timeOut = setTimeout(() => {
				if (this._tooltip && !this._tooltip?.classList.contains('tooltip-visible')) {
					this._tooltip?.classList.add('tooltip-visible');
				}
			}, this.delay);
		}
	}

	/**
	 * Remove the class to show the tooltip
	 */
	removeClass() {
		if (this.headerText != '' || this.literalsTooltip != '') {
			clearTimeout(this._timeOut);
			if (this._tooltip && this._tooltip?.classList.contains('tooltip-visible')) {
				this._tooltip?.classList.remove('tooltip-visible');
			}
		}
	}

	/**
	 *
	 */
	private _horizontalReposition() {
		if (this._tooltip) {
			this._tooltip?.style.setProperty('--_atoms-tooltip-info-box-left', '50%');
			this._tooltip?.style.setProperty('--_atoms-tooltip-info-arrow-left', 'calc(50% - 10px)');
			this._tooltip?.style.setProperty('--_atoms-tooltip-info-box-max-width', 'var(--atoms-tooltip-info-box-max-width, fit-content)');
			this._tooltip?.classList.remove('tooltip-info__box--wrap');

			let limits = this._tooltip.getBoundingClientRect();

			if (limits.width > window.innerWidth - this.repositionMarginHorizontal) {
				this._tooltip.style.setProperty(
					'--_atoms-tooltip-info-box-max-width',
					`var(--atoms-tooltip-info-box-max-width, calc(${window.innerWidth}px - 64px))`
				);
				this._tooltip.classList.add('tooltip-info__box--wrap');
			}

			limits = this._tooltip.getBoundingClientRect();
			const overflowRight = limits.right + this.repositionMarginHorizontal + 20 > window.innerWidth;

			if (overflowRight) {
				const difference = limits.right + this.repositionMarginHorizontal + 20 - window.innerWidth;
				this._tooltip.style.setProperty(
					'--_atoms-tooltip-info-box-left',
					`calc(${window.getComputedStyle(this._tooltip).left} - ${difference}px)`
				);
				const arrowOverflow = difference > (limits.right - limits.left) / 2 - 10;
				const arrowDifference = arrowOverflow
					? difference - (difference - (limits.right - limits.left) / 2) - this.repositionMarginHorizontal / 2
					: difference;

				this._tooltip.style.setProperty('--_atoms-tooltip-info-arrow-left', `calc(50% - 10px + ${arrowDifference}px)`);
			}

			limits = this._tooltip.getBoundingClientRect();
			const overflowLeft = limits.left - this.repositionMarginHorizontal < 0;

			if (overflowLeft) {
				const difference = Math.abs(limits.left) + this.repositionMarginHorizontal;
				this._tooltip.style.setProperty(
					'--_atoms-tooltip-info-box-left',
					`calc(${window.getComputedStyle(this._tooltip).left} + ${difference}px)`
				);
				const arrowOverflow = difference > (limits.right - limits.left) / 2 - 10;
				const arrowDifference = arrowOverflow
					? difference - (difference - (limits.right - limits.left) / 2) - this.repositionMarginHorizontal / 2
					: difference;

				this._tooltip.style.setProperty('--_atoms-tooltip-info-arrow-left', `calc(50% - 4px - ${arrowDifference}px)`);
			}
		}
	}

	/**
	 * Apply vertical positioning with custom offsetY
	 */
	private _verticalReposition() {
		if (this._tooltip) {
			// Apply the offsetY to the tooltip position
			if (this.offsetY !== 0) {
				const currentTop = window.getComputedStyle(this._tooltip).getPropertyValue('--_atoms-tooltip-info-box-top');
				const offsetValue = currentTop ? `calc(${currentTop} + ${this.offsetY}px)` : `${this.offsetY}px`;

				this._tooltip.style.setProperty('--_atoms-tooltip-info-box-top', offsetValue);
			}

			if (this.arrow === 'bottom') {
				let limits = this._tooltip.getBoundingClientRect();
				const overflowBottom = limits.bottom + this.repositionMarginVertical > window.innerWidth;
				this.arrow = overflowBottom ? 'top' : this.arrow;
			}

			if (this.arrow === 'top') {
				let limits = this._tooltip.getBoundingClientRect();
				const overflowTop = limits.top - this.repositionMarginVertical < 0;
				this.arrow = overflowTop ? 'bottom' : this.arrow;
			}
		}
	}

	handleReposition() {
		if (this.arrow === 'top' || this.arrow === 'bottom') {
			if (!this.disableReposition?.horizontal) {
				this._horizontalReposition();
			}
			if (!this.disableReposition?.vertical) {
				this._verticalReposition();
			}
		}
	}

	render() {
		// Process custom literals if available
		const processedLiterals = this.literalsTooltip
			? this.customLiterals
				? Object.keys(this.customLiterals).reduce((text, key) => {
						return text.replace(new RegExp(`\\{${key}\\}`, 'g'), this.customLiterals[key]);
				  }, this.literalsTooltip)
				: this.literalsTooltip
			: '';

		// Process header text with custom literals if available
		const processedHeader = this.headerText
			? this.customLiterals
				? Object.keys(this.customLiterals).reduce((text, key) => {
						return text.replace(new RegExp(`\\{${key}\\}`, 'g'), this.customLiterals[key]);
				  }, this.headerText)
				: this.headerText
			: '';

		return (
			<Host>
				{(!isEmpty(processedLiterals) || !isEmpty(processedHeader)) && (
					<div
						class="tooltip-info"
						onMouseEnter={() => this.addClass()}
						onMouseLeave={() => this.removeClass()}
						role="tooltip"
						aria-live="polite"
					>
						<span class={{ 'tooltip-info__box': true }}>
							<span class={{ 'tooltip-info__literal-containers': true }}>
								{processedHeader !== '' && <span class={{ 'tooltip-info__title': true }} innerHTML={processedHeader}></span>}
								<span class={{ 'tooltip-info__literals': true }} innerHTML={processedLiterals}></span>
							</span>
							<span class="triangle"></span>
						</span>
						<slot />
					</div>
				)}
				{isEmpty(processedLiterals) && isEmpty(processedHeader) && (
					<div class="tooltip-info">
						<slot />
					</div>
				)}
			</Host>
		);
	}
}
