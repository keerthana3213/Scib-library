import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp, parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKVdrPreviewData, ICDKVdrPreviewLiterals } from '../models/cdk-vdr-preview.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-preview',
	styleUrl: 'cdk-vdr-preview.scss',
	shadow: false,
	scoped: false,
})
export class CDKVdrPreview {
	@Prop() isLoading: boolean = false;

	@Prop() errorOnLoading: boolean = false;

	@Prop({ mutable: true, reflect: true }) literals: string | ICDKVdrPreviewLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKVdrPreviewLiterals) {
		this._literals = parseProp(newLiterals);
	}
	@State() _literals: ICDKVdrPreviewLiterals;

	@Prop({ mutable: true, reflect: true }) data: string | ICDKVdrPreviewData;
	@Watch('data') parseData(newData: string | ICDKVdrPreviewData) {
		this._data = parseProp(newData);
		if (!this._data) {
			this._data = {
				activeVDR: '',
				activeTopic: '',
				recentVDR: [],
				loadingImgSrc: '',
			};
		}
	}
	@State() _data: ICDKVdrPreviewData;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	/** Descripción del evento */
	@Event() eventOpenVDR: EventEmitter;

	render() {
		return (
			<Host>
				{this.errorOnLoading && !this.isLoading ? (
					<div class="cdk-vdr-preview__error">
						<span class="u-icon icon-hide-eye"></span>
						<span class="cdk-vdr-preview__error-title">{this._literals.errorTitle}</span>
						<span class="cdk-vdr-preview__error-desc">{this._literals.errorDesc}</span>
					</div>
				) : this.isLoading ? (
					<div class="cdk-vdr-preview__loading">
						<figure class="cdk-vdr-preview__loading-fig">
							<img class="cdk-vdr-preview__loading-img" src={this._data.loadingImgSrc} alt="Loading..." />
						</figure>
					</div>
				) : (
					<article class="cdk-vdr-preview">
						<div class="cdk-vdr-preview__active">
							<div class="cdk-vdr-preview__active-el">
								<span class="cdk-vdr-preview__active-txt">{this._literals.activeVDR}</span>
								<div class="cdk-vdr-preview__active-data">
									<span class="cdk-vdr-preview__active-num">{this._data.activeVDR}</span>
									<span class="u-icon icon-meeting"></span>
								</div>
							</div>
							<div class="cdk-vdr-preview__active-el">
								<span class="cdk-vdr-preview__active-txt">{this._literals.activeTopic}</span>
								<div class="cdk-vdr-preview__active-data">
									<span class="cdk-vdr-preview__active-num">{this._data.activeTopic}</span>
									<span class="u-icon icon-flag"></span>
								</div>
							</div>
						</div>
						<div class="cdk-vdr-preview__recent">
							<span class="cdk-vdr-preview__recent-title">{this._literals.recentActivity}</span>
							<div class="cdk-vdr-preview__cards-container">
								{this._data.recentVDR.map(card => (
									<div class="cdk-vdr-preview__card">
										{/* <a href={card.url}> */}
										<span class="cdk-vdr-preview__card-txt">{card.title}</span>
										{/* </a> */}
									</div>
								))}
							</div>
						</div>
					</article>
				)}
			</Host>
		);
	}
}
