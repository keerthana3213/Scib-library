import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { CDKIsmModalDetailIsmContentCard } from '../fragments/cdk-ism-modal-detail-ism-content-card.fragment';
import { CDKIsmModalDetailIsmContentFiles } from '../fragments/cdk-ism-modal-detail-ism-content-files.fragment';
import { CDKIsmModalDetailIsmContentResume } from '../fragments/cdk-ism-modal-detail-ism-content-resume.fragment';
import { CDKIsmModalDetailIsmContentTable } from '../fragments/cdk-ism-modal-detail-ism-content-table.fragment';
import { CDKIsmModalDetailIsmContentText } from '../fragments/cdk-ism-modal-detail-ism-content-text.fragment';
import { ILiterals, IData } from '../models/cdk-ism-modal-detail.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ism-modal-detail',
	styleUrl: 'cdk-ism-modal-detail.scss',
	shadow: false,
	scoped: true,
})
export class CDKIsmModalDetail {
	/** Open / close modal */
	@Prop({ reflect: true }) open: boolean;
	@State() _open: boolean;
	@Watch('open') parseBoolean(newOpen: boolean) {
		this._open = _parseProp<boolean>(newOpen as boolean);
	}

	@State() quantity: boolean = false;
	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
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

	/** Controls that only one accordion is open */
	@State() openedAccordion: Array<boolean> = [];

	/** Controls that only one eye is open on table */
	@State() _show: Array<boolean> = [];
	@State() _resume: Array<any> = [];
	@State() idBtn: number = 0;

	@State() isSelected: boolean[] = [];

	@Prop({ reflect: true }) literalsQuantity: any | string;

	@State() _resizeView: number = window.innerWidth;
	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this._resizeView = window.innerWidth;
	}

	@Prop({ reflect: true }) hiddebutton: boolean = false;
	@Watch('hiddebutton') parseHiddebutton(newData: boolean) {
		this._hiddebutton = _parseProp<boolean>(newData as boolean);
	}
	@State() _hiddebutton: boolean;
	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
		this.parseBoolean(this.open);
		this.parseHiddebutton(this.hiddebutton);
		/**Initialize values of accordion array opened control */
		this._data.forEach(() => {
			this.openedAccordion.push(false);
		});
		/**Initialize values of show more in table */
		this._data.forEach(item => {
			if (item.type === 'table') {
				item.data.content.forEach(() => {
					this._show.push(true);
					this.isSelected.push(false);
				});
			}
		});
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	showResumeTable(index, item) {
		this._show = this._show.map((value, i) => {
			return index === i ? !value : true;
		});

		this.isSelected = this.isSelected.map((value, i) => {
			return index === i ? !value : false;
		});

		this.idBtn = index;
		this._resume = item;
	}

	goToElem(elem) {
		this.eventRoute.emit(elem);
	}

	getLiterals(data) {
		if (data.number != undefined) {
			return {
				textInfoLabel: data.number,
				errorText: 'Pending required info',
			};
		} else {
			return {
				textInfoLabel: '',
				errorText: 'Pending required info',
			};
		}
	}

	mapKeysHeaders(obj: any) {
		if (obj) {
			let keys = [];
			for (let key in obj[0]) {
				if (key !== 'resume') {
					keys.push(key);
				}
			}
			return keys;
		}
	}

	renderDropElement(type, data) {
		if (type === 'table') {
			data.headers = this.mapKeysHeaders(data.content);
		}

		switch (type) {
			case 'table':
				return (
					<CDKIsmModalDetailIsmContentTable
						show={this._show}
						idBtn={this.idBtn}
						resume={this._resume}
						data={data}
						isSelected={this.isSelected}
						size={this._resizeView}
						showResume={(index, item) => {
							this.showResumeTable(index, item);
						}}
						sendData={elem => this.goToElem(elem)}
					></CDKIsmModalDetailIsmContentTable>
				);
			case 'text':
				return <CDKIsmModalDetailIsmContentText data={data} sendData={elem => this.goToElem(elem)}></CDKIsmModalDetailIsmContentText>;
			case 'files':
				return <CDKIsmModalDetailIsmContentFiles data={data}></CDKIsmModalDetailIsmContentFiles>;
			case 'resume':
				return <CDKIsmModalDetailIsmContentResume data={data} size={this._resizeView} sendData={elem => this.goToElem(elem)}></CDKIsmModalDetailIsmContentResume>;
			case 'card':
				return <CDKIsmModalDetailIsmContentCard data={data}></CDKIsmModalDetailIsmContentCard>;
		}
	}

	closeAccordion(index) {
		this._data.forEach(item => {
			if (item.type === 'table') {
				this._show = this._show.map(() => {
					return true;
				});
				this.isSelected = this.isSelected.map(() => {
					return false;
				});
			}
		});

		this.openedAccordion = this.openedAccordion.map((value, i) => {
			return index === i ? !value : false;
		});
	}

	sendData(data) {
		this.eventRoute.emit(data);
	}

	getCriticality(criticality) {
		switch (criticality.toUpperCase()) {
			case 'P01':
				return '#444444';
			case 'P02':
				return '#732645';
			case 'P03':
				return '#990000';
			case 'P03+':
				return '#946F00';
			case 'P04':
				return '#3366FF';
			case 'P05':
				return '#1BB3BC';
		}
	}

	moreInfo(event) {
		event.stopPropagation();
		// this.eventInfoRoute.emit(true);
	}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	@Event() eventRoute: EventEmitter;

	@Event() eventLink: EventEmitter;

	render() {
		return (
			<Host>
				<scib-ui-v2-dialog disableClose={this._hiddebutton} dialogTitle={this._literals.title} open={this._open} onDialogClosed={() => this.eventChange.emit(false)}>
					<div slot="content" class="cdk-ism-modal-detail">
						<section class="cdk-ism-modal-detail__info">
							<h3>{this._literals.subtitle}</h3>
							{this._literals &&
								this._literals.data.map(item =>
									item.type === 'data' ? (
										<div>
											{item.mainTitle != undefined ? <span class="cdk-ism-modal-detail__main-title">{item.mainTitle}</span> : ''}
											<div
												class={{
													'cdk-ism-modal-detail__items': true,
													'cdk-ism-modal-detail__items--columns': item.content.length % 3 === 0 && (item.onlyText == undefined || !item.onlyText),
													'cdk-ism-modal-detail__items--staggered-shape': item.onlyText != undefined && item.onlyText,
												}}
											>
												{item.content &&
													item.content.map(elem =>
														typeof elem.content !== 'string' && elem.content.length > 1 ? (
															this._resizeView < 767 ? (
																<p class="cdk-ism-modal-detail__item " style={{ marginTop: item.mainTitle ? '16px' : '' }}>
																	<span class="cdk-ism-modal-detail__item--title">{elem.title}</span>
																	<span>{elem.content.toString().replaceAll(',', ', ')}</span>
																</p>
															) : (
																<p class="cdk-ism-modal-detail__item cdk-ism-modal-detail__item--tooltip" style={{ marginTop: item.mainTitle ? '16px' : '' }}>
																	<div id="info-tooltip">
																		<span class="cdk-ism-modal-detail__item--title">{elem.title}</span>
																		<scib-ui-info-tooltip title="Click to see more info" text={elem.content.toString().replaceAll(',', ', ')}></scib-ui-info-tooltip>
																	</div>
																	<span>{elem.content[0].toString()}, ...</span>
																</p>
															)
														) : (
															<p class="cdk-ism-modal-detail__item" style={{ marginTop: item.mainTitle ? '16px' : '' }}>
																<span class="cdk-ism-modal-detail__item--title">{elem.title}</span>
																{elem.criticality ? (
																	<div class="cdk-ism-modal-detail__item--dot">
																		<span style={{ backgroundColor: this.getCriticality(elem.content) }}></span>
																		<span class={{ 'cdk-ism-modal-detail__item--critical': elem.status && elem.status === 'critical' }}>{elem.content}</span>
																	</div>
																) : elem.status && elem.status === 'critical' ? (
																	<a
																		href="#"
																		title={'Go to ' + elem.content + ' detail'}
																		onClick={event => {
																			event.preventDefault();
																			this.sendData(elem);
																		}}
																		class={{ 'cdk-ism-modal-detail__item--critical': elem.status && elem.status === 'critical' }}
																	>
																		{elem.content}
																	</a>
																) : elem.status && elem.status === 'code' ? (
																	<div class="cdk-ism-modal-detail__item--code">
																		<div>
																			<span role="img" class="u-icon icon-warning"></span>
																		</div>
																		<p>
																			<span>{elem.content}</span>
																			<a
																				href="#"
																				title={'Go to ' + elem.content + ' detail'}
																				onClick={event => {
																					event.preventDefault();
																					this.sendData(elem);
																				}}
																				class={{ 'cdk-ism-modal-detail__item--critical': elem.status && elem.status === 'critical' }}
																			>
																				{elem.subtitle}
																				<span role="img" class="u-icon icon-chrevron-right"></span>
																			</a>
																		</p>
																	</div>
																) : (
																	<span>{elem.content}</span>
																)}
															</p>
														),
													)}
											</div>
										</div>
									) : item.type === 'text' && item.content ? (
										<div class="cdk-ism-modal-detail__items--texts">
											{item.content.map(obj => (
												<article>
													<span class="cdk-ism-content-resume__items--title">{obj.title}</span>
													<div>
														<pre>{obj.content}</pre>
													</div>
													<br></br>
												</article>
											))}
										</div>
									) : (
										''
									),
								)}
						</section>
						{this._data ? (
							<section class="cdk-ism-modal-detail__sections">
								{this._data.map((item, index) => (
									<div class="cdk-ism-modal-detail__section">
										<scib-ui-accordion
											open={this.openedAccordion[index]}
											titleText={item.title}
											literals={this.getLiterals(item.data)}
											showInfoLabel={true}
											quantity={true}
											onEventAccordionChange={() => this.closeAccordion(index)}
										>
											{this.renderDropElement(item.type, item.data)}
										</scib-ui-accordion>
									</div>
								))}
							</section>
						) : (
							''
						)}
						{this._literals.info ? (
							<div class="cdk-ism-modal-detail__more-info">
								<span role="img" class="u-icon icon-tooltip"></span>
								<p id="info">
									<span>{this._literals.info.textBefore}</span>
									<a href={this._literals.info.linkAdress} title={'Open ' + this._literals.info.link} id="link" target="_blank" rel="noopener noreferrer">
										{this._literals.info.link}
									</a>
									<span>{this._literals.info.textAfter}</span>
								</p>
							</div>
						) : (
							''
						)}
						{!this._hiddebutton && this._resizeView > 767 && (
							<div class="cdk-ism-modal-detail__btn">
								<scib-ui-button onEventClick={() => this.eventChange.emit(false)} secondary>
									{this._literals.button}
								</scib-ui-button>
							</div>
						)}
					</div>
				</scib-ui-v2-dialog>
			</Host>
		);
	}
}
