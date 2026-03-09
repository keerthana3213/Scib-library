import { Component, Host, h, Prop, EventEmitter, Event, Method, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @status stable
 *
 * @slot header - Header section slot | Accordion header
 * @slot content - Default slot section | Accordion content
 */
@Component({
	tag: 'scib-atoms-accordion',
	styleUrl: 'accordion.scss',
	shadow: true
})
export class AtomsAccordion {
	/**
	 * Opens the accordion showing its content
	 */
	@Prop({ mutable: true }) open: boolean;

	/**
	 * Property to disable click in all line of accordion, when active we can expand only in arrow button
	 */
	@Prop() disableFullHandler: boolean;

	/**
	 * Show the upper border
	 */
	@Prop({ reflect: false }) forceUpperBorder: boolean = true;

	/**
	 *
	 */
	@Method() async expand() {
		this.open = true;
		this._emitEvents();
	}

	/**
	 *
	 */
	@Method() async collapse() {
		this.open = false;
		this._emitEvents();
	}

	/**
	 * DEPRECATED -> use eventAccordionClosed or eventAccordionOppened
	 */
	@Event() eventAccordionChange: EventEmitter<boolean>;

	/**
	 *
	 */
	@Event() eventAccordionExpanded: EventEmitter<void>;

	/**
	 *
	 */
	@Event() eventAccordionCollapsed: EventEmitter<void>;
	/**
	 *
	 */
	@Prop({ reflect: true }) direction: 'top' | 'bottom' = 'top';

	/**
	 *
	 */
	@State() focused: boolean = false;
	/**
	 *
	 */
	private _toggleModal() {
		this.open = !this.open;
		this._emitEvents();
	}

	/**
	 *
	 */
	private _emitEvents() {
		this.eventAccordionChange.emit(!this.open);
		if (this.open) {
			this.eventAccordionExpanded.emit();
		} else {
			this.eventAccordionCollapsed.emit();
		}
	}

	render() {
		return (
			<Host>
				{this.forceUpperBorder && <hr class="accordion__divider" />}
				<section class={{ accordion: true, accordion__cursor: !this.disableFullHandler, accordion__focused: this.focused }}>
					<div class="accordion__header" onClick={this.disableFullHandler ? () => {} : () => this._toggleModal()}>
						<div class="accordion__text">
							<slot name="header" />
						</div>
						<button
							onFocus={() => {
								this.focused = true;
							}}
							onBlur={() => {
								this.focused = false;
							}}
							onClick={this.disableFullHandler ? () => this._toggleModal() : () => {}}
							class={{
								accordion__btn: true,
								'accordion__btn--open': this.open
							}}
							type="button"
							tabindex="0"
						>
							<i class="icon u-icon" />
						</button>
					</div>
					<div class={{ accordion__content: true, 'accordion__content--hidden': !this.open }}>
						<slot name="content" />
					</div>
				</section>
				<hr class="accordion__divider" />
			</Host>
		);
	}
}
