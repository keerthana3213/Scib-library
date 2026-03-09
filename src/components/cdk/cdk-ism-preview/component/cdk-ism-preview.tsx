import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp, parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKIsmPreviewData, ICDKIsmPreviewLiterals as ICDKIsmPreviewLiterals } from '../models/cdk-ism-preview.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-ism-preview',
	styleUrl: 'cdk-ism-preview.scss',
	shadow: false,
	scoped: false
})
export class CDKIsmPreview {
	@Prop() isLoading: boolean = false;

	@Prop() errorOnLoading: boolean = false;

	@Prop({ mutable: true, reflect: true }) literals: ICDKIsmPreviewLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ICDKIsmPreviewLiterals | string) {
		this._literals = _parseProp<ICDKIsmPreviewLiterals>(newLiterals as string);
	}
	@State() _literals: ICDKIsmPreviewLiterals;

	@Prop({ mutable: true, reflect: true }) data: string | ICDKIsmPreviewData;
	@Watch('data') parseData(newData: string | ICDKIsmPreviewData) {
		this._data = parseProp(newData);
		if (!this._data) {
			this._data = {
				// actionPlans: '',
				// contracts: '',
				// incidents: '',
				// invoices: '',
				// relevantFacts: '',
				// relevantFactsList: [],
				loadingImgSrc: '',
				incidents: {
					inProgress: '',
					pending: '',
					critical: ''
				},
				relevantFacts: {
					newLast30: ''
				},
				invoices: {
					pending: ''
				},
				contracts: {
					formalizing: ''
				}
			};
		}
	}
	@State() _data: ICDKIsmPreviewData;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventOpenIsm: EventEmitter;

	render() {
		return (
			<Host>
				{this.errorOnLoading && !this.isLoading ? (
					<div class="cdk-ism-preview__error">
						<span role="img" class="u-icon icon-hide-eye"></span>
						<span class="cdk-ism-preview__error-title">{this._literals.errorTitle}</span>
						<span class="cdk-ism-preview__error-desc">{this._literals.errorDesc}</span>
					</div>
				) : this.isLoading ? (
					<div class="cdk-ism-preview__loading">
						<figure class="cdk-ism-preview__loading-fig">
							<img class="cdk-ism-preview__loading-img" src={this._data?.loadingImgSrc} alt="Loading..." />
						</figure>
					</div>
				) : (
					<article class="cdk-ism-preview">
						<div class="cdk-ism-preview__container">
							{/* Incidents*/}
							<div class="cdk-ism-preview__active">
								<p class="cdk-ism-preview__active">
									<span class="cdk-ism-preview__active-txt">{this._literals.literalsCard.incidents.title}</span>
									<span class="cdk-ism-preview__active-sub">{this._literals.literalsCard.incidents.inProgress}</span>
								</p>
								<div class="cdk-ism-preview__active-data">
									<span class="cdk-ism-preview__active-num">{this._data?.incidents?.inProgress}</span>
									<span role="img" class="u-icon icon-time"></span>
								</div>
							</div>
							<div class="cdk-ism-preview__active--subcontent">
								<p class="cdk-ism-preview__row">
									<span class="cdk-ism-preview__active-sub">{this._literals.literalsCard.incidents.critical}</span>
									<span class="cdk-ism-preview__active-num">{this._data?.incidents?.critical}</span>
									<span role="img" class="u-icon icon-awarness"></span>
									<span class="cdk-ism-preview__active-sub cdk-ism-preview__row--space">
										{this._literals.literalsCard.incidents.pending}
									</span>
									<span class="cdk-ism-preview__active-num">{this._data?.incidents?.pending}</span>
									<span role="img" class="u-icon icon-mifidii-report"></span>
								</p>
							</div>
							{/* Relevant Facts */}
							<div class="cdk-ism-preview__active cdk-ism-preview__borders">
								<p class="cdk-ism-preview__active">
									<span class="cdk-ism-preview__active-txt">{this._literals.literalsCard.relevantFacts.title}</span>
									<span class="cdk-ism-preview__active-sub">{this._literals.literalsCard.relevantFacts.subtitle}</span>
								</p>
								<div class="cdk-ism-preview__active-data">
									<span class="cdk-ism-preview__active-num">{this._data?.relevantFacts?.newLast30}</span>
									<span role="img" class="u-icon icon-communication-announcement"></span>
								</div>
							</div>
							{/* Invoices / Contracts */}
							<div class="cdk-ism-preview__active">
								<p class="cdk-ism-preview__row cdk-ism-preview__row--bar">
									<span class="cdk-ism-preview__active-txt">{this._literals.literalsCard.invoices.title}</span>
									<span class="cdk-ism-preview__active-sub">{this._literals.literalsCard.invoices.subtitle}</span>
									<div class="cdk-ism-preview__active-data">
										<span class="cdk-ism-preview__active-num">{this._data?.invoices?.pending}</span>
										<span role="img" class="u-icon icon-copy"></span>
									</div>
								</p>
								<p class="cdk-ism-preview__row cdk-ism-preview__row--postbar">
									<span class="cdk-ism-preview__active-txt">{this._literals.literalsCard.contracts.title}</span>
									<span class="cdk-ism-preview__active-sub">{this._literals.literalsCard.contracts.subtitle}</span>
									<div class="cdk-ism-preview__active-data">
										<span class="cdk-ism-preview__active-num">{this._data?.contracts?.formalizing}</span>
										<span role="img" class="u-icon icon-ibor"></span>
									</div>
								</p>
							</div>
						</div>
					</article>
				)}
			</Host>
		);
	}
}
