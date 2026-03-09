import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKMyAppsCardData, ICDKMyAppsCardLiterals } from '../models/cdk-my-apps-card.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-my-apps-card',
	styleUrl: 'cdk-my-apps-card.scss',
	shadow: false,
	scoped: true,
})
export class CDKMyAppsCard {
	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ICDKMyAppsCardLiterals | string;
	@State() _literals: ICDKMyAppsCardLiterals;
	@Watch('literals') parseLiterals(newLiterals: ICDKMyAppsCardLiterals | string) {
		this._literals = _parseProp<ICDKMyAppsCardLiterals>(newLiterals as string);
	}

	/**Contenido de la card */
	@Prop({ reflect: true }) myAppsCardData: ICDKMyAppsCardData | string;
	@Watch('myAppsCardData') myAppsCardDataChange(newVal: ICDKMyAppsCardData | string) {
		this._myAppsCardData = _parseProp(newVal);
	}

	@State() _myAppsCardData: ICDKMyAppsCardData;

	@Event() onclick: EventEmitter;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.myAppsCardDataChange(this.myAppsCardData);
	}
	handleClick(e) {
		e.preventDefault();
		this.onclick.emit(this._myAppsCardData.link);
	}
	render() {
		return (
			<Host>
				<a class="ui-card-container" title={this._myAppsCardData.title}>
					<article class="ui-card-article">
						<a class="cdk-my-apps-card" onClick={e => this.handleClick(e)} href="#">
							<div class="cdk-my-apps-card-icon">
								<figure>
									<img src={this._myAppsCardData.icon}></img>
								</figure>
							</div>
							<div class="cdk-my-apps-card-title">
								<h3>
									<a title={this._myAppsCardData.title}>{this._myAppsCardData.title}</a>
								</h3>
							</div>
						</a>
						<div class="cdk-my-apps-card-action">
							{!this._myAppsCardData.locked_activation && (
								<scib-ui-switch
									name={this._myAppsCardData.id}
									class="center"
									checked={this._myAppsCardData.isActive}
									label={this._literals.active}
									myapps={true}
								></scib-ui-switch>
							)}
						</div>
					</article>
				</a>
			</Host>
		);
	}
}
