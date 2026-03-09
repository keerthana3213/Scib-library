import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKIborPreviewData, ICDKIborPreviewLiterals } from '../models/cdk-ibor-preview.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-ibor-preview',
	styleUrl: 'cdk-ibor-preview.scss',
	shadow: false,
	scoped: false,
})
export class CDKIborPreview {
	@Prop() isLoading: boolean = false;

	@Prop() errorOnLoading: boolean = false;

	@Prop() loadingImgSrc: string;

	@Prop({ mutable: true, reflect: true }) literals: string | ICDKIborPreviewLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKIborPreviewLiterals) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKIborPreviewLiterals;

	/** Array de progress bar con los datos que tienen */
	@Prop({ mutable: true, reflect: true }) data: string | ICDKIborPreviewData[];
	@Watch('data') parseData(newData: string | ICDKIborPreviewData[]) {
		this._data = _parseProp(newData);
	}
	@State() _data: ICDKIborPreviewData[];

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	render() {
		return (
			<Host>
				{this.errorOnLoading && !this.isLoading ? (
					<div class="cdk-ibor-preview__error">
						<span class="u-icon icon-hide-eye"></span>
						<span class="cdk-ibor-preview__error-title">{this._literals.errorTitle}</span>
						<span class="cdk-ibor-preview__error-desc">{this._literals.errorDesc}</span>
					</div>
				) : this.isLoading ? (
					<div class="cdk-ibor-preview__loading">
						<figure class="cdk-ibor-preview__loading-fig">
							<img class="cdk-ibor-preview__loading-img" src={this.loadingImgSrc} alt="Loading..." />
						</figure>
					</div>
				) : (
					<div class="cdk-ibor-preview">
						{this._data.map(circle => (
							<scib-ui-circle-progress-bar
								class="cdk-ibor-preview__element"
								circle-progress-bar-id={circle.id}
								part-label={circle.partLabel}
								part-value={circle.partValue}
								total-label={circle.totalLabel}
								total-value={circle.totalValue}
								show-ratio={circle.showRatio}
								show-check-when-complete={circle.showCheckWheComplete}
								styling={circle.styling}
							></scib-ui-circle-progress-bar>
						))}
					</div>
				)}
			</Host>
		);
	}
}
