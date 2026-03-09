import { Component, Host, h, Element, Prop, State, Watch } from '@stencil/core';
import { MDCChipSet } from '@material/chips';
import { isEmpty } from 'lodash';
@Component({
	tag: 'scib-atoms-chip-selector',
	styleUrl: 'chip-selector.scss',
	shadow: true
})
export class ChipSelector {
	private _chipSet: MDCChipSet;

	/**
	 * It's the component itself
	 */
	@Element() _hostRef: HTMLElement;
	/**
	 * Prop for text inside the chip
	 */
	@Prop() chipText: string;

	/**
	 *	Mark as disabled chip.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean | undefined) {
		this.$disabled = !!newValue;
	}

	/**
	 *  Set the state of the chip.
	 */
	@Prop({ mutable: true }) selected: boolean;
	@State() $selected: boolean;
	@Watch('selected') _selectedHandler(newValue: boolean | undefined) {
		this.$selected = !!newValue;
		if (this._chipSet) {
			this._chipSet.setChipSelected(0, 1, this.$selected);
		}
	}

	/**
	 *	Add a counter to the text.
	 */
	@Prop({ mutable: true }) counter: number = 0;
	@State() $counter: number;
	@Watch('counter') _counterHandler(newValue: number | undefined) {
		this.$counter = newValue;
	}

	/**
	 *	Add an icon to chip.
	 */
	@Prop({ mutable: true }) icon: string = '';
	@State() $icon: string;
	@Watch('icon') _iconHandler(newValue: string | undefined) {
		this.$icon = newValue;
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._disabledHandler(this.disabled);
		this._counterHandler(this.counter);
		this._iconHandler(this.icon);
		this._selectedHandler(this.selected);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._chipSet = MDCChipSet.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-evolution-chip-set'));
		this._chipSet.setChipSelected(0, 1, this.$selected);
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._chipSet) && this._chipSet.destroy) {
			this._chipSet.destroy();
		}
	}

	render() {
		return (
			<Host>
				<span class="mdc-evolution-chip-set" role="grid">
					<span class="mdc-evolution-chip-set__chips" role="presentation">
						<span class={{ 'mdc-evolution-chip': true, 'mdc-evolution-chip--disabled': this.$disabled }} role="presentation">
							<span
								class={{ 'mdc-evolution-chip__action': true, 'mdc-evolution-chip__action--primary': true }}
								role="option"
								tabindex="0"
								aria-selected="false"
							>
								<span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
								{this.$icon && (
									<span
										class="mdc-evolution-chip__icon-container"
										style={{ '--icon-content': `var(--theme-scib-icon-${this.$icon})` }}
									>
										<i class="icon mdc-evolution-chip__icon--fixed" />
									</span>
								)}
								<span class="mdc-evolution-chip__text-label">{this.chipText}</span>
								{this.$counter > 0 && <span class="mdc-evolution-chip__text-counter">+{this.$counter}</span>}
							</span>
						</span>
					</span>
				</span>
			</Host>
		);
	}
}
