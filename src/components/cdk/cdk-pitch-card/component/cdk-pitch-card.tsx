import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { ICDKPitchCardLiterals, ICDKPitchCardData } from '../models/cdk-pitch-card.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-pitch-card',
	styleUrl: 'cdk-pitch-card.scss',
	shadow: false,
	scoped: true
})
export class CDKPitchCard {
	/**Actions */
	@Prop({ mutable: true, reflect: true }) data: string | ICDKPitchCardData[];
	@Watch('data') dataChange(newVal: string | ICDKPitchCardData[]) {
		this._data = _parseProp(newVal);
	}
	@State() _data: ICDKPitchCardData[];
	// @State() _isOpen: boolean;

	/** Property that reflects your changes on an attribute in the Custom Element Host and allows it to be internally mutated */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Literals */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKPitchCardLiterals;
	@Watch('literals') parseLiterals(newVal: string | ICDKPitchCardLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKPitchCardLiterals;

	/** General event emitter */
	@Event() eventPitchEmitter: EventEmitter;

	/** Options pitch event emitter */
	@Event() eventOptionsPitch: EventEmitter;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.dataChange(this.data);
		this.parseLiterals(this.literals);
	}

	/** Method used to go section data component */
	eventClick(event) {
		this.eventPitchEmitter.emit(event);
	}

	/** Opción elegida */
	eventOptionClick(itemClicked, index, id) {
		if (itemClicked.eventId === 'optionsPitch') {
			let aux: Array<ICDKPitchCardData> = [...this._data];
			aux.map((item, dataIndex) => {
				if (index === dataIndex) {
					item.openOptions = true;
				} else {
					item.openOptions = false;
				}
			});
			this.data = JSON.stringify(aux); // force update to render
		} else {
			this.eventOptionsPitch.emit({ id: id, eventId: itemClicked.eventId });
		}
	}

	/** Set the value false to the variable that controls the opening of the menu */
	eventClose() {
		let aux: Array<ICDKPitchCardData> = [...this._data];
		aux.map((item) => {
			item.openOptions = false;
		});
		this.data = JSON.stringify(aux); // force update to render
	}

	/** Method used to click the menu delete pitch button */
	eventOptionsClick(data) {
		let customEventId = {
			id: data.detail.id,
			eventId: data.detail.eventId
		};
		this.eventOptionsPitch.emit(customEventId);
		this.eventClose();
	}

	closeOptions(id) {
		this._data.find((i) => {
			if (i.id !== id && i.openOptions) {
				i.openOptions = false;
			}
		});
		this.data = JSON.stringify(this._data);
	}

	@Listen('click', { capture: true, target: 'document' })
	clickOut(e: any) {
		let findId;
		e.path?.forEach((item) => {
			if (!!item.id && item.id !== 'root') {
				findId = item.id;
				return;
			}
		});
		if (!!!findId) {
			this.eventClose();
		}
	}

	render() {
		return (
			<Host>
				<div class="cdk-pitch-card">
					{this._data &&
						this._data.map((element, index) => (
							<div class="cdk-pitch-card__item" id={'cdk-pitch-card__item' + element.id} onClick={() => this.closeOptions(element.id)}>
								<div class="cdk-pitch-card__content" style={{ 'background-image': 'url(' + element.url + ')' }}>
									<div class="cdk-pitch-card__type">
										<span role="image" class="u-icon c-icon icon-presentation"></span>
									</div>
									<div class="cdk-pitch-card__box">
										<p class="cdk-pitch-card__title">{element.title}</p>
										<div class="cdk-pitch-card__buttons">
											<button type="button" class="cdk-pitch-card__button" onClick={() => this.eventClick(element)}>
												{this._literals.btnOpen}
											</button>
											{this._data && (
												<div class="cdk-pitch-card__box--btn">
													{element.actions &&
														element.actions.map((item) => (
															<div
																style={{
																	visibility:
																		item.eventId === 'downloadPitch' ||
																		item.eventId === 'sharePitch' ||
																		item.eventId === 'shareDrupal' ||
																		(item.eventId === 'optionsPitch' && item.options && !!item.options.length)
																			? 'visible'
																			: 'hidden'
																}}
															>
																<scib-ui-button
																	icon={item.icon}
																	class="cdk-pitch-card__box--action"
																	hideTxt
																	small
																	link
																	onClick={() => {
																		this.eventOptionClick(item, index, element.id);
																	}}
																></scib-ui-button>
															</div>
														))}
												</div>
											)}
										</div>
									</div>
								</div>
								{element.actions.map(
									(item) =>
										item.options && (
											<div class="cdk-pitch-card__menu" style={{ display: element.openOptions ? 'block' : 'none' }}>
												{/* <CDKPitchCardMenu data={item.options} cardData={element} eventClickOptions={event => this.eventOptionsClick(event, element.id)} /> */}
												<scib-ui-options-menu
													id-elem={element.id}
													buttons={item.options as Array<any>}
													onEventClickOptions={(data) => this.eventOptionsClick(data)}
												></scib-ui-options-menu>
											</div>
										)
								)}
							</div>
						))}
				</div>
			</Host>
		);
	}
}
