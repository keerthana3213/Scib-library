import { ICDKPitchSectionContainerData, ICDKPitchSectionContainerLiterals } from '../models/cdk-pitch-section-container.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-pitch-section-container',
	styleUrl: 'cdk-pitch-section-container.scss',
	shadow: false,
	scoped: true,
})
export class CDKPitchSectionContainer {
	/** Literals text */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKPitchSectionContainerLiterals;
	@Watch('literals') parseLiterals(newVal: string | ICDKPitchSectionContainerLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKPitchSectionContainerLiterals;

	/** Props that are passed:
	 * When personalPitch = true and pitches = [], it shows the create pitch option.
	 */
	@Prop({ mutable: true, reflect: true }) props: string | ICDKPitchSectionContainerData;
	@Watch('props') parseProps(newVal: string | ICDKPitchSectionContainerData) {
		this._props = _parseProp(newVal);
	}
	@State() _props: ICDKPitchSectionContainerData;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseProps(this.props);
	}

	/** Description of the emitter event */
	@Event() eventChange: EventEmitter;
	@Event() eventOpenPitch: EventEmitter;
	@Event() eventOptionClicked: EventEmitter;

	// @Listen('pitchEventEmitter')
	openPitch(event: CustomEvent) {
		this.eventOpenPitch.emit(event.detail);
	}

	// @Listen('eventOptionsPitch')
	openPitchOptions(eventId: CustomEvent) {
		this.eventOptionClicked.emit(eventId.detail);
	}

	/** Event that is emitted when clicking on the button*/
	createNewPitch(e) {
		e.preventDefault();
		this.eventChange.emit(true);
	}

	render() {
		return (
			<Host>
				{this._props.personalPitch && !this._props.pitches.length ? (
					<section class="cdk-section__container">
						<header class="cdk-section__header">
							<span class="u-icon icon-options icon-style"></span>
							<h2 class="cdk-section__section-title">{this._literals.sectionTitle}</h2>
						</header>

						<section class="cdk-section__content" style={{ 'background-image': 'url(' + this._literals.imgUrl + ')' }}>
							<h3 class="cdk-section__title">{this._literals.mainTitle}</h3>
							<p class="cdk-section__text">{this._literals.titleDescription}</p>
							<div class="cdk-section__button-box">
								<scib-ui-button type="button" class="cdk-section__button" primary large disableMinWidth onClick={e => this.createNewPitch(e)}>
									{this._literals.add}
								</scib-ui-button>
							</div>
						</section>
					</section>
				) : this._props.pitches.length ? (
					<section class="cdk-section__container">
						<header class="cdk-section__header">
							<span class="u-icon icon-options icon-style"></span>
							<h2 class="cdk-section__section-title">{this._props.title}</h2>
						</header>
						<div>
							<scib-cdk-pitch-card
								data={JSON.stringify(this._props.pitches)}
								literals={JSON.stringify(this._literals)}
								onEventOptionsPitch={e => this.openPitchOptions(e)}
								onEventPitchEmitter={e => this.openPitch(e)}
							></scib-cdk-pitch-card>
						</div>
					</section>
				) : null}
			</Host>
		);
	}
}
