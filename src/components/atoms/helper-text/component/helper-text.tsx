import { Component, Host, h, Prop, State, Watch, Element, Method, Event, EventEmitter } from '@stencil/core';
import { TextStatus } from '../models/helper-text.model';
import { assetUrl, parseProp } from '../../../../utils/helpers/common';
import { AtomsTooltipInfo } from '../../tooltip-info/component/tooltip-info';
import { merge, debounce } from 'lodash';

/**
 * Component that displays helper text with support for different states (error, warning, success, loading)
 * and tooltip for long texts
 */
@Component({
	tag: 'scib-atoms-helper-text',
	styleUrl: 'helper-text.scss',
	shadow: true
})
export class AtomsHelperText {
	@Element() _hostRef: HTMLElement;
	private _textRef: HTMLDivElement;
	private _resizeObserver: ResizeObserver;

	// Create a debounced version of checkTextOverflow with a 500ms wait time
	private _debouncedCheckTextOverflow = debounce(() => {
		if (this.$enableAutoTooltip) {
			this._checkTextOverflow();
		}
	}, 200);

	/**
	 * Helper text to display
	 */
	@Prop() text: string = '';
	@State() $text: string;
	@Watch('text') _textHandler(newValue: string) {
		this.$text = newValue || '';
		this._checkTextOverflow();
	}

	/**
	 * Helper text status that determines the icon and color
	 */
	@Prop() status: TextStatus = 'default';
	@State() $status: TextStatus;
	@Watch('status') _statusHandler(newValue: TextStatus) {
		this.$status = newValue || 'default';
		// Actualizar los atributos ARIA cuando cambia el status
		this._updateAccessibilityAttrs();
	}

	/**
	 * Enables or disables tooltip for long text
	 * This is useful when the text is not expected to overflow, such as in a loading state.
	 * If set to false, the component will check for overflow and enable the tooltip if necessary.
	 * This is useful when the text is dynamic and may overflow.
	 */
	@Prop() enableTooltip: boolean;
	@State() $enableTooltip: boolean;
	@Watch('enableTooltip') _enableTooltipHandler(newValue: boolean) {
		this.$enableTooltip = !!newValue;
		if (this.$enableTooltip) {
			// If explicitly disabled, we check if there's overflow to enable it automatically
			this._checkTextOverflow();
		}
	}

	/**
	 * Controls the automatic tooltip behavior based on text overflow. When enabled (default is false),
	 * the tooltip will only be displayed when the text actually overflows its container.
	 * This is useful when you have dynamic text that may or may not need a tooltip
	 * depending on its length and the container size.
	 * @default false
	 */
	@Prop() enableAutoTooltip: string | boolean;
	@State() $enableAutoTooltip: boolean;
	@Watch('enableAutoTooltip') _enableAutoTooltipHandler(newValue: string | boolean) {
		this.$enableAutoTooltip = !!newValue;
		if (this.$enableAutoTooltip) {
			// If explicitly disabled, we check if there's overflow to enable it automatically
			this._checkTextOverflow();
		}
	}

	/**
	 * Tooltip configuration when tooltip is enabled
	 */
	@Prop() tooltipConfig: string | Partial<AtomsTooltipInfo>;
	@State() $tooltipConfig: Partial<AtomsTooltipInfo> = {
		arrow: 'bottom'
	};
	@Watch('tooltipConfig') _tooltipConfigHandler(newValue: string | Partial<AtomsTooltipInfo>) {
		this.$tooltipConfig = {
			arrow: 'bottom',
			...parseProp(newValue) // Parse the string or merge with default values
		};
	}

	/**
	 * ID for accessibility - allows connecting the element with others through aria-labelledby or aria-describedby
	 */
	@Prop() textId?: string;

	/**
	 * Flag to control if overflow has been detected in the text
	 */
	@State() hasOverflow: boolean = false;

	/**
	 * ARIA role based on current status
	 */
	@State() ariaRole: string | undefined;

	/**
	 * ARIA attributes based on current status
	 */
	@State() ariaAttributes: { [key: string]: string } = {};

	/**
	 * Status icon URL based on current status
	 */
	@State() statusIconUrl: string = '';

	/**
	 * Updates accessibility attributes when status changes
	 */
	@Watch('$status')
	_updateAccessibilityAttrs() {
		this._updateAriaRole();
		this._updateAriaAttributes();
		this._updateStatusIcon();
	}

	@Event() activeTextOverflow: EventEmitter<boolean>;

	/**
	 * Checks if helper text has overflow
	 */
	private _checkTextOverflow(): void {
		if (!this.$enableAutoTooltip && !this.$enableTooltip) {
			this.hasOverflow = false;
			this.$enableTooltip = false;
			this.activeTextOverflow.emit(false);
			return;
		}
		if (!this._hostRef || !this.$text) {
			this.hasOverflow = false;
			this.$enableTooltip = false;
			this.activeTextOverflow.emit(false);
			return;
		}

		// We use requestAnimationFrame to ensure the DOM is fully updated
		requestAnimationFrame(() => {
			const textElement = this._hostRef.shadowRoot.querySelector('.text__content');
			if (!textElement) {
				this.hasOverflow = false;
				return;
			}

			// More precise calculation of text overflow
			const isOverflowing = textElement.scrollWidth > textElement.clientWidth;

			// Only update if the overflow state has changed
			if (isOverflowing !== this.hasOverflow) {
				this.hasOverflow = isOverflowing;

				// If there's overflow but tooltip is not enabled, activate it automatically
				if (this.hasOverflow && !this.$enableTooltip) {
					this.$enableTooltip = true;
				} else if (!this.hasOverflow && this.$enableTooltip) {
					// If there's no overflow and tooltip was automatically activated (not explicitly by prop),
					// deactivate it
					this.$enableTooltip = false;
				}
			}
			this.activeTextOverflow.emit(this.hasOverflow);
		});
	}

	/**
	 * Updates ARIA role based on text status
	 */
	private _updateAriaRole(): void {
		// Assign appropriate roles based on status
		switch (this.$status) {
			case 'error':
				this.ariaRole = 'alert';
				break;
			case 'warning':
				this.ariaRole = 'alert';
				break;
			case 'info':
				this.ariaRole = 'status';
				break;
			case 'success':
				this.ariaRole = 'status';
				break;
			default:
				this.ariaRole = undefined; // Not all texts need a specific role
		}
	}

	/**
	 * Updates ARIA attributes based on status
	 */
	private _updateAriaAttributes(): void {
		const attrs: { [key: string]: string } = {};

		switch (this.$status) {
			case 'error':
				attrs['aria-live'] = 'assertive';
				break;
			case 'warning':
				attrs['aria-live'] = 'polite';
				break;
			case 'loading':
				attrs['aria-busy'] = 'true';
				break;
			case 'success':
			case 'info':
				attrs['aria-live'] = 'polite';
				break;
		}

		this.ariaAttributes = attrs;
	}

	/**
	 * Updates the status icon URL based on the current status
	 */
	private _updateStatusIcon(): void {
		const ICON_PATHS = {
			LOADING: 'assets/color_icons/loading.svg',
			SUCCESS: 'assets/color_icons/checkmark.svg',
			ERROR: 'assets/color_icons/error.svg',
			WARNING: 'assets/color_icons/warning.svg',
			INFO: 'assets/color_icons/information.svg',
			DEFAULT: ''
		};

		// Select icon based on status
		switch (this.$status) {
			case 'loading':
				this.statusIconUrl = assetUrl(ICON_PATHS.LOADING);
				break;
			case 'success':
				this.statusIconUrl = assetUrl(ICON_PATHS.SUCCESS);
				break;
			case 'error':
				this.statusIconUrl = assetUrl(ICON_PATHS.ERROR);
				break;
			case 'warning':
				this.statusIconUrl = assetUrl(ICON_PATHS.WARNING);
				break;
			case 'info':
				this.statusIconUrl = assetUrl(ICON_PATHS.INFO);
				break;
			default:
				this.statusIconUrl = '';
		}
	}

	componentWillLoad() {
		this._textHandler(this.text);
		this._statusHandler(this.status);
		this._enableTooltipHandler(this.enableTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
		this._updateAriaRole();
		this._updateAriaAttributes();
		this._updateStatusIcon();
	}

	componentDidLoad() {
		this._checkTextOverflow();

		// Set up observer for changes in element size to detect overflow
		if ('ResizeObserver' in window) {
			const resizeObserver = new ResizeObserver(() => {
				// Use the debounced function that will wait 500ms after resize stops
				this._debouncedCheckTextOverflow();
			});

			// Observe the host element to detect direct size changes
			resizeObserver.observe(this._hostRef);

			// Also observe the text element to detect changes in its content or size
			if (this._textRef) {
				resizeObserver.observe(this._textRef);
			}

			// Store a reference to the observer for cleanup later
			this._resizeObserver = resizeObserver;
		}

		// Add a global resize listener as an additional safety layer
		window.addEventListener('resize', this._handleWindowResize);
	}

	/**
	 * Handler for window resize events with Lodash debounce
	 * Only executes after user has stopped resizing for half a second
	 */
	private _handleWindowResize = () => {
		// Using the debounced function that will wait 500ms after resize stops
		this._debouncedCheckTextOverflow();
	};

	disconnectedCallback() {
		// Clean up listeners when the component is destroyed
		window.removeEventListener('resize', this._handleWindowResize);

		// Cancel the debounced function
		if (this._debouncedCheckTextOverflow) {
			this._debouncedCheckTextOverflow.cancel();
		}

		// Disconnect the ResizeObserver if it exists
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
		}
	}

	render() {
		const statusIcon = this.statusIconUrl;
		const ariaRole = this.ariaRole;
		const ariaAttrs = this.ariaAttributes;
		// If tooltip is enabled (explicitly or due to overflow), wrap in tooltip
		// Create main content
		const content = [
			statusIcon && (
				<div class="text__icon-container">
					<img class="text__icon" src={statusIcon} alt="" aria-hidden="true" key="icon" />
				</div>
			),
			<div
				class={{
					text__content: true,
					empty: !this.$text || this.$text?.trim()?.length === 0,
					ellipsis: this.$enableTooltip || this.$enableAutoTooltip
				}}
				key="helper-text"
				ref={(el) => (this._textRef = el as HTMLDivElement)}
				id={this.textId}
			>
				{this.$text}
			</div>
		];

		// Add screen reader-only text for error or warning states
		const statusIndicator =
			this.$status === 'error' || this.$status === 'warning' ? (
				<span class="accessibility">{this.$status === 'error' ? 'Error:' : 'Warning:'}</span>
			) : null;

		return (
			<Host status={this.$status} role={ariaRole} {...ariaAttrs}>
				<div
					class={{
						text: true,
						'text--success': this.$status === 'success',
						'text--error': this.$status === 'error',
						'text--warning': this.$status === 'warning',
						'text--loading': this.$status === 'loading',
						'text--info': this.$status === 'info'
					}}
				>
					{this.$enableTooltip ? (
						<scib-atoms-tooltip-info
							arrow={this.$tooltipConfig.arrow}
							literalsTooltip={this.$tooltipConfig?.literalsTooltip || this.$text}
							headerText={this.$tooltipConfig.headerText}
							delay={this.$tooltipConfig.delay}
							visibility={this.$tooltipConfig.visibility}
							disableReposition={this.$tooltipConfig.disableReposition}
							repositionMarginVertical={this.$tooltipConfig.repositionMarginVertical}
							repositionMarginHorizontal={this.$tooltipConfig.repositionMarginHorizontal}
							maxWidth={this.$tooltipConfig.maxWidth}
							class="text__tooltip"
						>
							{statusIndicator}
							{content}
						</scib-atoms-tooltip-info>
					) : (
						<span class="text__container">
							{statusIndicator}
							{content}
						</span>
					)}
				</div>
			</Host>
		);
	}
}
