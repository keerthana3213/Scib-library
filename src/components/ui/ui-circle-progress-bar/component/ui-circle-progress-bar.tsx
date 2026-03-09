import { IUICircleProgressBar } from '../models/ui-circle-progress-bar.model';
import { Component, Host, h, Prop, Watch, State, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import ProgressBar from 'progressbar.js';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-circle-progress-bar',
	styleUrl: 'ui-circle-progress-bar.scss',
	shadow: false,
	scoped: true,
})
export class UICircleProgressBar {
	@Element() _hostRef: HTMLElement;

	/** Unique id for the component */
	@Prop({ reflect: true }) circleProgressBarId: string;

	/** Does not show decimals */
	@Prop({ reflect: true }) noDecimals: boolean;

	/** Customizing the styles of the progress bar*/
	@Prop({ mutable: true, reflect: true }) styling?: string | IUICircleProgressBar['styling'];
	@Watch('styling') parseStyling(newStyling: string | IUICircleProgressBar['styling']) {
		this._circleProgressBar.styling = _parseProp(newStyling);
	}

	/** Label corresponding to the part*/
	@Prop({ reflect: true }) partLabel?: string;
	@Watch('partLabel') parsePartLabel(newPartLabel: string) {
		this._circleProgressBar.part.label = newPartLabel;
	}

	/**Value corresponding to the part */
	@Prop({ reflect: true }) partValue: number;
	@Watch('partValue') parsePartValue(newPartValue: number) {
		this._circleProgressBar.part.value = newPartValue;
		this._percentage = this.decimalConverter((this.partValue / this.totalValue) * 100);
	}

	/** Label corresponding to the total */
	@Prop({ reflect: true }) totalLabel?: string;
	@Watch('totalLabel') parseTotalLabel(newTotalLabel: string) {
		this._circleProgressBar.total.label = newTotalLabel;
	}

	/** Label corresponding to the total without letter 'K' */
	@Prop({ reflect: false }) noLetterK: boolean;

	/** Value corresponding to the total */
	@Prop({ reflect: true }) totalValue: number;
	@Watch('totalValue') parseTotalValue(newTotalValue: number) {
		this._circleProgressBar.total.value = newTotalValue;
	}

	/** Shows actual values ​​of the ratio under the percentage*/
	@Prop({ reflect: true }) showRatio: boolean = true;

	/** Show the check icon when it is at 100% */
	@Prop({ reflect: true }) showCheckWhenComplete: boolean = false;

	@State() _circleProgressBar: IUICircleProgressBar = {
		part: { label: '', value: 0 },
		total: { label: '', value: 0 },
	};

	@State() _percentage: number;

	decimalConverter = number => Math.floor(number * (this.noDecimals ? 1 : 10)) / (this.noDecimals ? 1 : 10);

	thousandCompressor = number => {
		if (number >= 1000) {
			if (this.noLetterK) {
				return `${this.decimalConverter(number / 1000).toString()}`;
			} else {
				return `${this.decimalConverter(number / 1000).toString()}k`;
			}
		} else {
			return number;
		}
	};

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parsePartLabel(this.partLabel);
		this.parsePartValue(this.partValue);
		this.parseTotalLabel(this.totalLabel);
		this.parseTotalValue(this.totalValue);
		this.parseStyling(this.styling);
		this._percentage = this.decimalConverter((this.partValue / this.totalValue) * 100);
		if (this._percentage.toString().toLowerCase() === 'nan' || this._percentage.toString().toLowerCase() === 'infinity') {
			this._percentage = 0;
		}
	}
	componentDidRender() {
		if (this._hostRef) {
			let cirlcleNode = this._hostRef.querySelector<HTMLElement>(`#${this.circleProgressBarId}`);
			if (cirlcleNode) {
				while (cirlcleNode.firstChild) {
					cirlcleNode.removeChild(cirlcleNode.lastChild);
				}
				const circlebar = new ProgressBar.Circle(cirlcleNode, {
					color: (this._circleProgressBar.styling && this._circleProgressBar.styling.color) || '#EC0000',
					strokeWidth: (this._circleProgressBar.styling && this._circleProgressBar.styling.strokeWidth) || 5,
					trailColor: (this._circleProgressBar.styling && this._circleProgressBar.styling.trailColor) || '#DCDCDC',
					trailWidth: (this._circleProgressBar.styling && this._circleProgressBar.styling.trailWidth) || 0.7,
					svgStyle: {
						strokeLinecap: 'round',
					},
				});
				circlebar.set(this._percentage / 100);
			}
		}
	}

	render() {
		return (
			<Host>
				<div class="ui-circle">
					<div id={this.circleProgressBarId} class="ui-circle__progress"></div>
					<div class="ui-circle__content">
						{this.showCheckWhenComplete && this._percentage >= 100 ? (
							<span class="ui-circle__percentage--full u-icon icon-check"></span>
						) : (
							<span class="ui-circle__percentage">{`${this.decimalConverter(this._percentage)
								.toString()
								.replace('.', ',')}%`}</span>
						)}
						{this.showRatio && (
							<span class="ui-circle__number">{`${this.thousandCompressor(
								this._circleProgressBar.part.value,
							)}/${this.thousandCompressor(this._circleProgressBar.total.value)}`}</span>
						)}
					</div>
				</div>
				{this._circleProgressBar.part.label && this._circleProgressBar.total.label && (
					<span class="ui-circle__txt">{`${this._circleProgressBar.part.label.toUpperCase()} / ${this._circleProgressBar.total.label.toUpperCase()}`}</span>
				)}
			</Host>
		);
	}
}
