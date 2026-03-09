import { ICDKRequest, ICDKLiterals, ICDKButtons, ICDKLegend } from '../models/cdk-list-request.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { CDKListRequestLegend } from '../fragments/cdk-list-request-legend.fragment';
import { UIFilterLiterals } from '../../../ui/ui-filter/models/ui-filter.model';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import {
	CDKListRequestSkeleton,
	CDKListRequestSkeletonEmployees,
	CDKListRequestSkeletonTablet,
	CDKListRequestSkeletonTabletEmployees,
	CDKListRequestSkeletonMobile,
	CDKListRequestSkeletonMobileEmployees
} from '../fragments/cdk-list-request-skeleton.fragment';

/**
 * Component description
 *
 * @slot dataContent - dataContent slot content
 * @slot textBtns - textBtns slot content
 * @slot iconBtns - iconBtns slot content
 * @slot child - child slot content
 */
@Component({
	tag: 'scib-cdk-list-request',
	styleUrl: 'cdk-list-request.scss',
	shadow: false,
	scoped: true
})
export class CDKListRequest {
	/*Variable that stores the selected instructions */
	@State() selectedInstructions: any[] = [];

	/** Indicates if the user who is viewing the requests is an employee or a client */
	@Prop({ reflect: false }) isEmployee: boolean = true;

	/** Indicates if the request is locked */
	@Prop({ reflect: false }) isLocked: boolean;

	/** Request label data */
	@Prop({ reflect: false }) requestLabels: string;

	/** Request details */
	@Prop({ reflect: false }) requests: ICDKRequest[] | string;
	@Watch('requests') requestsChange(newVal: ICDKRequest[] | string) {
		this._loadingMore = false;
		this._requests = _parseProp(newVal);
	}
	@State() _requests: ICDKRequest[];
	@State() _loadingMore: boolean;

	/**Buttons list Request details */
	@Prop({ reflect: false }) buttons: ICDKButtons | string;
	@Watch('buttons') buttonsChange(newVal: ICDKButtons | string) {
		this._buttons = _parseProp(newVal);
	}
	@State() _buttons: ICDKButtons;

	/** Legend of the request list */
	@Prop({ reflect: false }) legend: ICDKLegend | string;
	@Watch('legend') legendChange(newVal: ICDKLegend | string) {
		this._legend = _parseProp(newVal);
	}
	@State() _legend: ICDKLegend;

	/**Filter Literals */
	@Prop({ reflect: true }) filterLiterals: UIFilterLiterals | string;
	@Watch('filterLiterals') filterLiteralsChange(newVal: UIFilterLiterals | string) {
		this._filterLiterals = _parseProp(newVal);
	}
	@State() _filterLiterals: UIFilterLiterals;

	/**State unSelect */
	@Prop({ reflect: true }) unAllSelect: boolean;
	@Watch('unAllSelect') unAllSelectChange(newVal: boolean) {
		this._unAllSelect = _parseProp(newVal);
		this.disableButtons();
		this.selectedInstructions = [];
		this.unSelectAllInstructions.emit();
	}
	@State() _unAllSelect: boolean;

	/** Indicates if expanded panel*/
	@Prop({ reflect: true }) expanded: boolean;
	@Watch('expanded') expandedChange() {
		this.toggleChild.emit();
	}

	/** Literals */
	@Prop({ reflect: false }) literals: string;
	@Watch('literals') literalsChange(newVal: string | ICDKLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKLiterals;

	/** Labels */
	@Prop({ reflect: false }) labels: string[] | string;
	@Watch('labels') labelsChange(newVal: string[] | string) {
		this._labels = _parseProp(newVal);
	}
	@State() _labels: string[];

	/** Show the loading button */
	@Prop({ reflect: false }) showLoading: boolean = true;

	/** Indicate the num to repeat skeleton request */
	@Prop({ reflect: false }) numSkeletonsRepeat: number;

	/*Skeleton Request config*/
	@Prop({ reflect: false }) showSkeleton: boolean;
	@Prop({ reflect: false }) desktop: boolean;
	@Prop({ reflect: false }) tablet: boolean;
	@Prop({ reflect: false }) mobile: boolean;

	@State() isButtonRequestDisabled: boolean;
	@State() isButtonConfirmDisabled: boolean;
	@State() isButtonRequestLocked: boolean;
	@State() isButtonPendingLocked: boolean = false;
	@State() selectedFlagLocked: boolean = false;
	@State() selectedFlag: boolean = false;

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.skeltonsResposnive();
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.requestsChange(this.requests);
		this.literalsChange(this.literals);
		this.labelsChange(this.labels);
		this.buttonsChange(this.buttons);
		this.legendChange(this.legend);
		this.filterLiteralsChange(this.filterLiterals);
		this.unAllSelectChange(this._unAllSelect);
		this.expandedChange();
		this._loadingMore = false;
		this.skeletons();
		this.skeltonsResposnive();
	}
	/** Lifecycle when removing the component instance*/
	disconnectedCallback() {
		this._loadingMore = false;
	}

	@Event() toggleChild: EventEmitter;
	/** Event launched to indicate loading of more content */
	@Event() loadMoreRequests: EventEmitter;
	/** Event launched when any button is operated */
	@Event() clickRequestButton: EventEmitter<{ type: string; id: string }>;
	@Event() publishSelectedInstructions: EventEmitter;
	/* Emit when click in  view detail instrucction*/
	/* @Event() viewDetailInstruction: EventEmitter<any>;
	auxTogle(rq) {
			//this.viewDetailInstruction.emit(rq);
	} */
	_clickOnLoad() {
		this._loadingMore = true;
		this.loadMoreRequests.emit();
	}
	@Event() unSelectAllInstructions: EventEmitter;
	@Listen('toggleChild', { target: 'window' })
	_handleOnSelect(e: any) {
		e.preventDefault();
		this.selectedInstructions = [];
		this.publishInstructionsSelected(this.selectedInstructions);
		this.disableButtons();
		this.unSelectAllInstructions.emit();
	}
	@Listen('selectInstruction', { target: 'window' })
	_handleSelectInstruction(e: any) {
		e.preventDefault();
		const selectedInstructionAux = e.detail[0];
		if (selectedInstructionAux.selected) {
			this.selectedInstructions.push(selectedInstructionAux);
			this.isButtonsDisabled();
			this.publishInstructionsSelected(this.selectedInstructions);
			return;
		}
		this.unSelectInstructions(selectedInstructionAux);
	}
	@Event() publishSummarySelection: EventEmitter;
	@Listen('emitHeaderSelection', { target: 'window' })
	_handleSelection(e: any) {
		e.preventDefault();
		if (!e.detail || e.detail === '') {
			return;
		}
		this.publishSummarySelection.emit(e.detail);
	}
	private unSelectInstructions(selectedInstruction: any) {
		this.selectedInstructions = this.selectedInstructions.filter((el) => {
			return el.id !== selectedInstruction.id;
		});
		this.isButtonsDisabled();
		this.publishInstructionsSelected(this.selectedInstructions);
	}
	publishInstructionsSelected(selectedInstructions: any[]) {
		this.publishSelectedInstructions.emit(selectedInstructions);
	}

	/**Functions to disable the request buttons */
	isButtonsDisabled() {
		if (!this.selectedInstructions.length) {
			this.disableButtons();
			return;
		}
		this.isButtonRequestDisabled = this.selectedInstructions.some((el) => {
			return el.status === 'Requested';
		});
		this.isButtonRequestLocked = this.selectedInstructions.some((el) => {
			return el.status === 'Requested (Locked)';
		});
		this.isButtonPendingLocked = this.selectedInstructions.some((el) => {
			return el.status === 'Pending (Locked)';
		});
		this.selectedFlagLocked = this.selectedInstructions.some((el) => {
			return el.status === 'Pending (Locked)' || el.status === 'Requested (Locked)';
		});
		this.selectedFlag = this.selectedInstructions.some((el) => {
			return el.status === 'Pending' || el.status === 'Requested';
		});
		this.getButtonRequestDisabled();
	}
	private disableButtons() {
		this.isButtonRequestDisabled = false;
		this.isButtonConfirmDisabled = false;
		this.isButtonRequestLocked = false;
		this.isButtonPendingLocked = false;
		this.selectedFlagLocked = false;
		this.selectedFlag = false;
	}

	/**Function to identify which buttons of the request are disabled*/
	private getButtonRequestDisabled() {
		if (!this.isButtonRequestDisabled) {
			this.isButtonConfirmDisabled = this.selectedInstructions.some((el) => {
				return el.status === 'Pending';
			});
		}
	}

	private skeletons() {
		return Array(this.numSkeletonsRepeat).fill(null);
	}

	/**Function to get the screen resolution*/
	private skeltonsResposnive() {
		if (window.innerWidth >= 1024) {
			this.desktop = true;
			this.tablet = false;
			this.mobile = false;
		} else if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
			this.desktop = false;
			this.tablet = true;
			this.mobile = false;
		} else if (window.innerWidth >= 320 && window.innerWidth <= 767) {
			this.desktop = false;
			this.tablet = false;
			this.mobile = true;
		}
	}
	render() {
		return (
			<Host>
				<div class={{ 'cdk-request--load': this.showSkeleton, 'cdk-request--hidden': !this.showSkeleton }}>
					<div role="status" aria-busy="true" aria-live="polite">
						<figure class="cdk-request--loading">
							{this.desktop && !this.isEmployee && (
								<CDKListRequestSkeleton literalSkeleton={this._literals.accessibleLoading}></CDKListRequestSkeleton>
							)}

							{this.tablet && !this.isEmployee && (
								<CDKListRequestSkeletonTablet literalSkeleton={this._literals.accessibleLoading}></CDKListRequestSkeletonTablet>
							)}

							{this.mobile && !this.isEmployee && (
								<CDKListRequestSkeletonMobile literalSkeleton={this._literals.accessibleLoading}></CDKListRequestSkeletonMobile>
							)}
							{this.desktop && this.isEmployee && (
								<CDKListRequestSkeletonEmployees literalSkeleton={this._literals.accessibleLoading}></CDKListRequestSkeletonEmployees>
							)}

							{this.tablet && this.isEmployee && (
								<CDKListRequestSkeletonTabletEmployees
									literalSkeleton={this._literals.accessibleLoading}
								></CDKListRequestSkeletonTabletEmployees>
							)}

							{this.mobile && this.isEmployee && (
								<CDKListRequestSkeletonMobileEmployees
									literalSkeleton={this._literals.accessibleLoading}
								></CDKListRequestSkeletonMobileEmployees>
							)}
						</figure>
					</div>
				</div>
				{this.isEmployee ? (
					<section class={{ 'cdk-request': true, 'cdk-request--employees': true, 'cdk-request--hidden': this.showSkeleton }}>
						<header class="cdk-request__header">
							{this._requests?.length > 0 ? <span class="cdk-request__total">{this._literals.totalResult}</span> : ''}
							<div class="cdk-request__options">
								<CDKListRequestLegend legend={this._legend} />
								<scib-ui-filter
									filter-literals={JSON.stringify({
										filterTitle: this._filterLiterals.filterTitle,
										filterbtn: this._filterLiterals.filterbtn,
										fieldset: this._filterLiterals.fieldset
									})}
								></scib-ui-filter>
							</div>
						</header>
						{this._requests?.length > 0 ? (
							<div class="cdk-request__body">
								{this._requests.map((request) => (
									<div class="cdk-request__element">
										<scib-ui-color-panel
											idRequest={request.requestData.id}
											hover-effect
											status={request.requestData.status}
											have-childs={!!request.childsData}
										>
											<scib-cdk-panel-data
												status={request.requestData.status}
												slot="dataContent"
												request-labels={this.requestLabels}
												employee={this.isEmployee}
												data={request.requestData}
											>
												{this._buttons.textBtns?.map((textBtn) => {
													const { noConfirm, noLock, noUnlock, typeTextBtn } = this.getConfigButtons(textBtn, request);
													if (noConfirm === false && noLock === false && noUnlock === false) {
														return (
															<scib-ui-button
																slot="textBtns"
																class={{
																	'cdk-btn': true,
																	[typeTextBtn]: true,
																	'--disabled': this.getButtonStatus(request, textBtn, request.requestData.id)
																}}
																disable-min-width
																icon-left
																no-background
																small
																no-event-propagation
																onEventClick={() => {
																	if (!request.locked)
																		this.clickRequestButton.emit({
																			type: textBtn.event,
																			id: request.requestData.id
																		});
																}}
																icon={textBtn.icon}
																disabled={this.getButtonStatus(request, textBtn, request.requestData.id)}
															>
																{textBtn.label}
															</scib-ui-button>
														);
													}
												})}
												{this._buttons.iconBtns?.map((iconBtn) => {
													const typeIconBtn = 'cdk-btn-' + iconBtn.name.toLowerCase();
													return (
														<scib-ui-button
															slot="iconBtns"
															class={typeIconBtn}
															disable-min-width
															hide-txt
															no-background
															small
															no-event-propagation
															onEventClick={() => {
																this.clickRequestButton.emit({ type: iconBtn.event, id: request.requestData.id });
															}}
															icon={iconBtn.icon}
														>
															{iconBtn.label}
														</scib-ui-button>
													);
												})}
											</scib-cdk-panel-data>
											{request.childsData ? (
												<scib-cdk-childs-table
													slot="child"
													locked={request.locked}
													childs={request.childsData}
													labels={this._labels}
													idRequest={request.requestData.id}
												></scib-cdk-childs-table>
											) : (
												''
											)}
										</scib-ui-color-panel>
									</div>
								))}
								{this.showLoading && (
									<scib-ui-button
										class="cdk-request__btn"
										icon-left
										secondary
										small
										onEventClick={() => this._clickOnLoad()}
										loading={this._loadingMore}
										icon="icon-retry"
									>
										{this._literals.loadBtn}
									</scib-ui-button>
								)}
							</div>
						) : (
							<div class="cdk-request__body cdk-request__body--empty">
								<figure class="cdk-request__figure">
									<img class="cdk-request__img" src={assetUrl('/assets/images/coffeBreak.svg')} alt="" />
								</figure>
								<span class="cdk-request__empty">
									<strong class="cdk-request__empty cdk-request__empty--strong">{this._literals.firstMessage}</strong>
									{this._literals.secondMessage}
								</span>
							</div>
						)}
					</section>
				) : (
					<section class={{ 'cdk-request': true, 'cdk-request--hidden': this.showSkeleton }}>
						<header class="cdk-request__header">
							{this._requests?.length > 0 ? <span class="cdk-request__total">{this._literals.totalResult}</span> : ''}
							<div class="cdk-request__options">
								<CDKListRequestLegend legend={this._legend} />
							</div>
						</header>
						{this._requests?.length > 0 ? (
							<div class="cdk-request__body">
								{this._requests.map((request) => (
									<div class="cdk-request__element">
										<scib-ui-color-panel
											idRequest={request.requestData.id}
											hover-effect
											status={request.requestData.status}
											locked={this.isLocked}
											have-childs={!!request.childsData}
										>
											<scib-cdk-panel-data
												status={request.requestData.status}
												slot="dataContent"
												request-labels={this.requestLabels}
												employee={this.isEmployee}
												data={request.requestData}
											>
												{this._buttons.textBtns?.map((textBtn) => {
													const { noConfirm, noLock, noUnlock, typeTextBtn } = this.getConfigButtons(textBtn, request);
													if (noConfirm === false && noLock === false && noUnlock === false) {
														return (
															<scib-ui-button
																slot="textBtns"
																class={{
																	'cdk-btn': true,
																	[typeTextBtn]: true,
																	'--disabled': this.getButtonStatus(request, textBtn, request.requestData.id)
																}}
																disabled={this.getButtonStatus(request, textBtn, request.requestData.id)}
																disable-min-width
																icon-left
																no-background
																small
																no-event-propagation
																onEventClick={() => {
																	if (!request.locked)
																		this.clickRequestButton.emit({
																			type: textBtn.event,
																			id: request.requestData.id
																		});
																}}
																icon={textBtn.icon}
															>
																{textBtn.label}
															</scib-ui-button>
														);
													}
												})}
												{this._buttons.iconBtns?.map((iconBtn) => {
													const typeIconBtn = 'cdk-btn-' + iconBtn.name.toLowerCase();
													return (
														<scib-ui-button
															slot="iconBtns"
															class={typeIconBtn}
															disable-min-width
															hide-txt
															no-background
															small
															no-event-propagation
															onEventClick={() => {
																this.clickRequestButton.emit({ type: iconBtn.event, id: request.requestData.id });
															}}
															icon={iconBtn.icon}
														>
															{iconBtn.label}
														</scib-ui-button>
													);
												})}
											</scib-cdk-panel-data>
											{request.childsData ? (
												<scib-cdk-childs-table
													slot="child"
													locked={this.isLocked}
													childs={request.childsData}
													labels={this._labels}
													idRequest={request.requestData.id}
												></scib-cdk-childs-table>
											) : (
												''
											)}
										</scib-ui-color-panel>
									</div>
								))}
								{this.showLoading && (
									<scib-ui-button
										class="cdk-request__btn"
										icon-left
										secondary
										small
										onEventClick={() => this._clickOnLoad()}
										loading={this._loadingMore}
										icon="icon-retry"
									>
										{this._literals.loadBtn}
									</scib-ui-button>
								)}
							</div>
						) : (
							<div class="cdk-request__body cdk-request__body--empty">
								<figure class="cdk-request__figure">
									<img class="cdk-request__img" src={assetUrl('/sources/images/coffeBreak.svg')} alt="" />
								</figure>
								<span class="cdk-request__empty">
									<strong class="cdk-request__empty cdk-request__empty--strong">{this._literals.firstMessage}</strong>
									{this._literals.secondMessage}
								</span>
							</div>
						)}
					</section>
				)}
			</Host>
		);
	}
	private getConfigButtons(textBtn: { name: string; label: string; icon: string; event: string }, request: ICDKRequest) {
		const typeTextBtn = '--' + textBtn.name.toLowerCase();
		let aux = this.selectedInstructions.some((el) => {
			return el.status === 'Pending (Locked)' || el.status === 'Requested (Locked)';
		});
		let checkSelectedInstructions = request.childsData.data.some((el) => {
			return el.status === 'Pending' || el.status === 'Requested';
		});
		const noConfirm =
			(request.requestData.status === 'in-progress' || request.requestData.status === 'requested') && textBtn.name.toLowerCase() === 'confirm';

		let noLock;
		if (aux === true && checkSelectedInstructions === true && textBtn.name.toLowerCase() === 'lock') {
			noLock = true;
		} else if (aux === false && checkSelectedInstructions === true && textBtn.name.toLowerCase() === 'lock') {
			noLock = false;
		} else if (aux === true && checkSelectedInstructions === false && textBtn.name.toLowerCase() === 'lock') {
			noLock = true;
		} else if (aux === false && checkSelectedInstructions === false && textBtn.name.toLowerCase() === 'lock') {
			noLock = false;
		} else {
			noLock = false;
		}
		let noUnlock;
		if (aux === true && checkSelectedInstructions === true && textBtn.name.toLowerCase() === 'unlock') {
			noUnlock = false;
		} else if (aux === false && checkSelectedInstructions === true && textBtn.name.toLowerCase() === 'unlock') {
			noUnlock = true;
		} else if (aux === true && checkSelectedInstructions === false && textBtn.name.toLowerCase() === 'unlock') {
			noUnlock = false;
		} else if (aux === false && checkSelectedInstructions === false && textBtn.name.toLowerCase() === 'unlock') {
			noUnlock = true;
		} else {
			noUnlock = false;
		}
		return { noConfirm, noLock, noUnlock, typeTextBtn };
	}
	private getButtonStatus(request: ICDKRequest, textBtn: { name: string; label: string; icon: string; event: string }, idRequest): boolean {
		if (!this.selectedInstructions.length || parseInt(this.selectedInstructions[0].idRequest) !== parseInt(idRequest)) {
			return true;
		}
		let aux = false;
		if (request.locked && !this.isEmployee) {
			aux = true;
		} else if (this.selectedInstructions.length == 0) {
			aux = true;
		} else if (this.isButtonRequestDisabled && textBtn.name.toLowerCase() === 'confirm') {
			aux = true;
		} else if (!this.isButtonConfirmDisabled && textBtn.name.toLowerCase() === 'confirm') {
			aux = true;
		} else if (this.isButtonRequestLocked && textBtn.name.toLowerCase() === 'locked') {
			aux = true;
		} else if (this.isButtonPendingLocked && textBtn.name.toLowerCase() === 'locked') {
			aux = true;
		} else if (this.isButtonRequestLocked && textBtn.name.toLowerCase() === 'confirm') {
			aux = true;
		} else if (this.isButtonPendingLocked && textBtn.name.toLowerCase() === 'confirm') {
			aux = true;
		} else if (this.selectedFlagLocked && this.selectedFlag && textBtn.name.toLowerCase() === 'locked') {
			aux = true;
		} else if (this.selectedFlagLocked && this.selectedFlag && textBtn.name.toLowerCase() === 'unlock') {
			aux = true;
		} else {
			aux = false;
		}
		return aux;
	}
}
