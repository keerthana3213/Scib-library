import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { first, get } from 'lodash';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { InternalOption, Option, SegmentedControlSizeTypes } from '../models/segmented-control.model';

/**
 * Component description
 *
 * @status stable
 */
@Component({
	tag: 'scib-atoms-segmented-control',
	styleUrl: 'segmented-control.scss',
	shadow: true
})
export class AtomsSegmentedControl {
	containerRef: HTMLDivElement;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@State() firstLoadComplete: boolean = false;

	/**
	 *
	 */
	@State() currentOption: string;

	/**
	 * Control size, can be 'M' (default, medium) or 'S' (small)
	 */
	@Prop() size: SegmentedControlSizeTypes = 'm';

	/**
	 *
	 */
	@Prop({ mutable: true }) value: string;
	@State() _value: string;
	@Watch('value') _valueHandler(newValue: string) {
		this.currentOption = newValue;
		requestAnimationFrame(() => {
			const index = this._getIdByValue(newValue);
			this._moveBackground(index);
		});
	}

	/**
	 *
	 */
	@Prop() options: Option[] | string;
	@State() _options: InternalOption[];
	@Watch('options') _parseOptions(newOptions: any) {
		this._options = _parseProp(newOptions, []).map((option, index) => ({ ...option, id: index }));
		requestAnimationFrame(() => {
			const index = this._getIdByValue(this.currentOption);
			this._moveBackground(index);
		});
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._parseOptions(this.options);
		this._valueHandler(this.value);
	}

	/**
	 *
	 */
	componentDidLoad() {
		requestAnimationFrame(() => {
			if (!this.currentOption) {
				this.currentOption = get(first(this._options), 'value');
			}
			setTimeout(() => {
				const options = this.containerRef?.querySelectorAll('.segmented-controls-options-item');
				options.forEach((option: HTMLElement) => {
					const width = option?.offsetWidth;
					option.style.width = `${width + 5}px`;
				});
				this.firstLoadComplete = true;
				const index = this._getIdByValue(this.currentOption);
				this._moveBackground(index);
			}, 500);
		});
	}

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<string>;

	/**
	 *
	 * @param currentOption
	 */
	changeCurrentOption(event: Event, currentOption: string, id: number) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.currentOption = currentOption;
		this.valueChange.emit(this.currentOption);
		this._moveBackground(id, true);
	}

	/**
	 *
	 * @param value
	 * @returns
	 */
	private _getIdByValue(value: string): number {
		const index = (this._options || [])?.findIndex((option) => option.value === value);
		return index < 0 ? 0 : index;
	}

	/**
	 *
	 * @param id
	 */
	private _moveBackground(id: number, addTransition = false) {
		const option = this.containerRef?.querySelector(`#option_${id}`) as HTMLElement;
		if (option && this.firstLoadComplete) {
			const background = this.containerRef?.querySelector('#options-background') as HTMLElement;
			if (addTransition && !background?.classList.contains('transition')) {
				background.classList.add('transition');
			}
			requestAnimationFrame(() => {
				const gap = this.containerRef.getBoundingClientRect().left + 4;
				const coverWidth = option.offsetWidth;
				const distance = option.getBoundingClientRect().left - gap;
				background.style.transform = `translateX(${distance}px)`;
				background.style.width = `${coverWidth}px`;
			});
		}
	}

	render() {
		return (
			<Host style={{ textAlign: 'center' }} size={this.size}>
				<div class="segmented-controls" style={{ visibility: this.firstLoadComplete ? 'visible' : 'hidden' }}>
					<div class={`segmented-controls-options`} ref={(element) => (this.containerRef = element)}>
						<span id="options-background" class="segmented-controls-options-background"></span>
						{(this._options || []).map(({ id, label, value, icon }) => {
							return (
								<div
									key={id}
									id={`option_${id}`}
									onClick={(event) => this.changeCurrentOption(event, value, id)}
									class={{ 'segmented-controls-options-item': true, active: this.currentOption === value }}
								>
									{icon && <i class="icon" style={{ '--icon-content': `var(--theme-scib-icon-${icon})` }} />}
									{label && <span>{label}</span>}
								</div>
							);
						})}
					</div>
				</div>
			</Host>
		);
	}
}
