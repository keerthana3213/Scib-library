import { Component, Host, h, State, Element, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import { parseProp } from '../../../../utils/helpers/common';
import { MDCSlider } from '@material/slider';
import { get, isNil, omit } from 'lodash';
import { HelperLevel } from '../../../../shared/models';

/**
 * Component description
 */
@Component({
	tag: 'scib-atoms-slider',
	styleUrl: 'slider.scss',
	shadow: true
})
export class AtomsSlider {
	private _sliderRef: MDCSlider;
	private _sliderContainerRef: HTMLElement;
	private _internalChange = false;

	@Element() _hostRef: HTMLElement;

	/**
	 *	The value of the input.
	 */
	@Prop({ mutable: true, reflect: true }) value: string;
	@Watch('value') _valueHandler(newValue: string) {
		if (!this._internalChange && newValue) {
			const values = (newValue || '').split(',');
			this.$ranges.map((range, index) => {
				const { value } = range;
				range['value'] = values[index] || value;
			});
			this._setRanges();
		}
		this._internalChange = false;
	}

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: false }) ranges: any;
	@State() $ranges: any;
	@Watch('ranges') _rangesHandler(newValue: any) {
		let ranges = parseProp(newValue, []).slice(0, 2);
		if (ranges[0].step <= 0) {
			ranges[0].step = 1;
		}
		this.$ranges = ranges;
		this._setRanges();
	}

	/**
	 *
	 */
	@Prop({ reflect: true }) color: HelperLevel = 'primary';

	/**
	 *
	 */
	@Prop({ reflect: false }) marks: boolean = false;
	@State() $marks: boolean;
	@Watch('marks') _marksHandler(newValue: boolean) {
		this.$marks = newValue;
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) indicator: boolean;
	@State() $indicator: boolean;
	@Watch('indicator') _indicatorHandler(newValue: boolean) {
		this.$indicator = newValue;
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._rangesHandler(this.ranges);
		this._marksHandler(this.marks);
		this._indicatorHandler(this.indicator);
		this._valueHandler(this.value);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._sliderContainerRef = this._hostRef.shadowRoot.querySelector('.mdc-slider');
		this._setRanges();
		this._sliderRef = MDCSlider.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-slider'));
		this._sliderRef.initialize({ skipInitialUIUpdate: true });
		this._sliderRef.listen('MDCSlider:input', (event: CustomEvent) => {
			const { detail } = event;
			let elementId: string = '';
			if (detail.thumb === 1 || (detail.thumb === 2 && this.$ranges.length < 2)) {
				elementId = this.$ranges[0].id;
			} else {
				elementId = this.$ranges[1].id;
			}
			this._internalChange = true;
			this.value = this._getValue();
			this.valueChange.emit({ value: detail.value, id: elementId });
		});
	}

	/**
	 *
	 */
	disconnectedCallback() {
		if (this._sliderRef && this._sliderRef.unlisten) {
			this._sliderRef.unlisten('MDCSlider:input', () => {});
		}
	}

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<any>;

	/**
	 *
	 */
	private _getValue(): string {
		return (this.$ranges || [])
			.map((range) => {
				const input = this._sliderContainerRef.querySelector(`#${range.id}`);
				return input.getAttribute('value');
			})
			.join(',');
	}

	/**
	 *
	 * @param value
	 */
	private _setRanges() {
		if (this._sliderContainerRef) {
			(this.$ranges || []).map((range) => {
				const input = this._sliderContainerRef.querySelector(`#${range.id}`);
				!isNil(range.min) && input.setAttribute('min', get(range, 'min', 0).toString());
				!isNil(range.max) && input.setAttribute('max', get(range, 'max', 100).toString());
				!isNil(range.value) && input.setAttribute('value', get(range, 'value', 0).toString());
				input.setAttribute('step', get(this.$ranges[0], 'step', 1).toString());
				!isNil(range.value) && this.$marks && input.setAttribute('step', get(this.$ranges[0], 'step', 10).toString());
			});
		}
	}

	render() {
		return (
			<Host>
				<div
					class={`mdc-slider  ${this.$marks && 'mdc-slider--tick-marks'} ${this.$indicator && 'mdc-slider--discrete margin-top'}  ${
						this.$ranges.length > 1 && 'mdc-slider--range'
					}   `}
				>
					{(this.$ranges || []).map((range) => (
						<input type="range" class="mdc-slider__input" {...omit(range, ['min', 'max', 'step', 'value'])} />
					))}
					<div class="mdc-slider__track">
						<div class="mdc-slider__track--inactive"></div>
						<div class="mdc-slider__track--active">
							<div class="mdc-slider__track--active_fill"></div>
						</div>
					</div>
					{(this.$ranges || []).map((range) => (
						<div class="mdc-slider__thumb">
							{/* Indicator */}
							<div class="mdc-slider__value-indicator-container" aria-hidden="true">
								<div class="mdc-slider__value-indicator">
									<span class="mdc-slider__value-indicator-text">{range.value}</span>
								</div>
							</div>

							<div class="mdc-slider__thumb-knob"></div>
						</div>
					))}
				</div>
			</Host>
		);
	}
}
