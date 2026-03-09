import { Component, Host, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { TooltipPosition } from '../models/ui-v2-chips.model';
import { parseProp } from '../../../../utils/helpers/common';
import { VariantTypes } from '../../../../shared/models';
import { differenceWith, isEmpty, isEqual } from 'lodash';
import { MDCChipSet } from '@material/chips';

@Component({
	tag: 'scib-ui-v2-chips',
	styleUrl: 'ui-v2-chips.scss',
	shadow: true
})
export class UI_V2Chips {
	private _chipsetRef: MDCChipSet;
	private resizeObserver: ResizeObserver;
	private chipsContainer: any;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *
	 */
	@Prop({ mutable: true }) value: any;
	@State() $chips: any[];
	@Watch('value') _chipsHandler(newValue: any | string) {
		const chips = parseProp(newValue, []);
		this.$chips = chips.map((chip) => {
			return { ...chip, showValue: chip.showValue ?? chip.value };
		});
	}

	/**
	 *  Propiedad para indicar el texto del botón. En caso de no venir, no se añadirá
	 */
	@Prop({ mutable: true }) buttonText: string;

	/**
	 * Tooltip position
	 */
	@Prop() tooltipPosition: TooltipPosition = 'top';

	/**
	 * Tooltip delay (ms)
	 */
	@Prop() tooltipDelay: number = 1000;

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<any>;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._chipsHandler(this.value);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this.chipsContainer = this._hostRef.shadowRoot.querySelectorAll('scib-atoms-tooltip-info');
		this._chipsetRef = MDCChipSet.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-evolution-chip-set'));

		this._resizeObserve();
	}

	/**
	 * Observe the chips resize to change the tooltip visibility
	 */
	private _resizeObserve() {
		this.resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((chip) => {
				chip.target.visibility = chip.contentRect.width > 359 ? 'visible' : 'hidden';
			});
		});
		this.chipsContainer.forEach((chip) => {
			this.resizeObserver.observe(chip);
		});
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._chipsetRef) && this._chipsetRef.destroy) {
			this._chipsetRef.destroy();
		}
		if (this.resizeObserver && this.resizeObserver.unobserve) {
			this.chipsContainer.forEach((chip) => {
				this.resizeObserver.unobserve(chip);
			});
		}
	}

	/**
	 * Clear all chips
	 */
	_removeAllChips() {
		this.value = [];
		this.valueChange.emit({
			activeChips: null,
			oldChips: this.$chips
		});
	}

	/**
	 *
	 * @param chip
	 */
	_removeChip(chip: any) {
		if (chip) {
			const activeChips = this.$chips.filter((_chip) => _chip.id !== chip.id);
			this.valueChange.emit({
				activeChips: activeChips,
				oldChips: differenceWith(this.$chips, activeChips, isEqual)
			});
			this.value = activeChips;
		}
	}

	_separateCamelCase(camelCaseWord: string) {
		const _camelCaseWord = camelCaseWord || '';
		return _camelCaseWord
			.charAt(0)
			.toUpperCase()
			.concat(_camelCaseWord.slice(1).replace(/([a-z])([A-Z])/, '$1 $2'));
	}

	render() {
		return (
			<Host>
				<span class="mdc-evolution-chip-set" role="grid">
					<span class="mdc-evolution-chip-set__chips" role="presentation">
						{(this.$chips || []).map((chip, index) => {
							return (
								<scib-atoms-tooltip-info
									arrow={this.tooltipPosition}
									literalsTooltip={`${this._separateCamelCase(chip.label)}  ${chip.showValue}`}
									visibility={chip.tooltipVisible}
									delay={this.tooltipDelay}
									key={index}
								>
									<div
										class={{
											'mdc-evolution-chip': true,
											'mdc-evolution-chip--disabled': chip.disabled
										}}
										role="row"
										id={'chip-' + chip.id}
									>
										<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
											<button
												class="mdc-evolution-chip__action mdc-evolution-chip__action--primary"
												data-mdc-deletable="true"
												type="button"
												tabindex="0"
												disabled={chip.disabled}
											>
												<span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
												{chip.label && (
													<div>
														<span class="mdc-evolution-chip__text-label">{this._separateCamelCase(chip.label)}</span>
													</div>
												)}

												<span class="mdc-evolution-chip__text-value" innerHTML={chip.showValue}></span>
												<i class="icon u-icon state__icon" onClick={() => this._removeChip(chip)} />
											</button>
										</span>
									</div>
								</scib-atoms-tooltip-info>
							);
						})}
						{this.$chips.length > 1 && this.buttonText && (
							<scib-atoms-button
								class="mdc-evolution-chip-set__clear-all-button"
								level="tertiary"
								text={this.buttonText}
								size="s"
								onClick={() => this._removeAllChips()}
							/>
						)}
					</span>
				</span>
			</Host>
		);
	}
}
