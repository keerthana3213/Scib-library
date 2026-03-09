import { ICDKContractCardLiterals, ICDKContractCardData } from '../models/cdk-contract-card.model';
import { CDKContractCardSkeleton } from '../fragments/cdk-contract-card-skeleton.fragment';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, h, Prop, Watch, State } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-contract-card',
	styleUrl: 'cdk-contract-card.scss',
	shadow: false,
	scoped: false,
})
export class CDKContractCard {
	/** Literals */
	@Prop({ reflect: true }) literals: ICDKContractCardLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKContractCardLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKContractCardLiterals;

	/** Contenido de la card */
	@Prop({ reflect: true }) data: ICDKContractCardData | string;

	@Watch('data') dataChange(newVal: ICDKContractCardData | string) {
		this._data = _parseProp(newVal);
	}

	@State() _data: ICDKContractCardData;

	/*Activa el skeleton de la card*/
	@Prop({ reflect: false }) showSkeleton: boolean;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.dataChange(this.data);
	}

	render() {
		return this.showSkeleton ? (
			<div role="status" aria-busy="true" aria-live="polite">
				<figure class="cdk-contract-card--loading">
					<CDKContractCardSkeleton literalSkeleton={this._literals.accessibleLoading}></CDKContractCardSkeleton>
				</figure>
			</div>
		) : (
			<section class="cdk-contract-card">
				<scib-ui-card card-id={this._data.id} tooltip={this._literals.tooltip}>
					<h4 class="cdk-contract-card__title">{this._data.title}</h4>
					<scib-ui-button nobackground icon="icon-chrevron-right" hide-txt small></scib-ui-button>
					<div class="cdk-contract-card__items">
						{this._data.items.map((item, index) => (
							<span>
								{item} {this._literals.items[index]}
							</span>
						))}
					</div>
					<footer class="cdk-contract-card__footer">
						{Object.entries(this._data.status).map(([key, value], index) => (
							<scib-ui-color-panel class="c-legend" top-label={this._literals.status[index]} status={key}>
								<div class="c-legend-text" slot="dataContent">
									{value}
								</div>
							</scib-ui-color-panel>
						))}
					</footer>
				</scib-ui-card>
			</section>
		);
	}
}
