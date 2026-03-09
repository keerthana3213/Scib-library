import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals, IData } from '../models/cdk-ism-content.model';
import { CDKIsmContentInfoCard } from '../fragments/cdk-ism-content-info-card.fragment';
import { CDKIsmContentSkeleton } from '../fragments/cdk-ism-content-skeleton.fragment';
/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ism-content',
	styleUrl: 'cdk-ism-content.scss',
	shadow: false,
	scoped: true,
})
export class CDKIsmContent {
	@Prop({ reflect: true }) showSkeleton: boolean;
	@Prop({ reflect: true }) fullWidth: boolean = false;

	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	@Prop({ reflect: true }) data: IData | string;
	@State() _data: IData;
	@Watch('data') parseData(newData: IData | string) {
		this._data = _parseProp<IData>(newData as string);
	}

	@Prop({ reflect: true }) type: string;

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
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host>
				{this.showSkeleton ? (
					<div class="cdk-ism__skeleton">
						<div class="cdk-ism__skeleton-container">
							<CDKIsmContentSkeleton />
							<div class="cdk-ism__skeleton-shine" />
						</div>
					</div>
				) : (
					<div class="cdk-ism__card">
						<scib-ui-card
							iconArrow
							onClick={() => {
								this.eventChange.emit();
							}}
						>
							<h2>
								{this._literals.title}
								{/* <span>{this._data.total}</span> */}
							</h2>

							<article class="cdk-ism__article">
								{this._data.data.map(_data => {
									return (
										// <scib-ui-column col-lg="3">
										<CDKIsmContentInfoCard data={_data} literals={this._literals} example="titulo" type={this.type} fullWidth={this.fullWidth}></CDKIsmContentInfoCard>
										// </scib-ui-column>
									);
								})}
							</article>
						</scib-ui-card>
					</div>
				)}
			</Host>
		);
	}
}
