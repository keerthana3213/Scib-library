import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { CDKContractListPillContent } from '../fragments/cdk-contract-list-pill-content.fragment';
import { statusConfigSwitchIbor, CDKStatusTypeEnumIbor } from '../utils/cdk-contract-list.config-ibor';
import { CDKStatusTypeEnumReviewer, statusConfigSwitchReviewer } from '../utils/cdk-contract-list.config-reviewer';
import {
	CDKContractListSkeleton,
	CDKContractListSkeletonTablet,
	CDKContractListSkeletonMobile
} from '../fragments/cdk-contract-list-skeleton.fragment';
import { ICDKContractData, ICDKContractLiterals, CDKStatusArchetypeEnum } from '../models/cdk-contract-list.model';

/**
 * Component description
 *
 * @slot dataContent - DataContent slot container
 */
@Component({
	tag: 'scib-cdk-contract-list',
	styleUrl: 'cdk-contract-list.scss',
	shadow: false,
	scoped: false
})
export class CDKContractList {
	/** Literales */
	@Prop({ reflect: false }) literals: ICDKContractLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ICDKContractLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKContractLiterals;

	@Prop({ reflect: false }) filtersApply;
	@Watch('filtersApply') parseFiltersApply(newFiltersApply) {
		this._filtersApply = _parseProp(newFiltersApply);
	}
	@State() _filtersApply: ICDKContractLiterals;

	/** Previous status filter */
	@Prop({ reflect: true, mutable: false }) prevFilterStatus;

	/** Data */
	@Prop({ reflect: false }) data: ICDKContractData | string;
	@Watch('data') parseData(newData: ICDKContractData | string) {
		this._data = _parseProp(newData);
	}
	@State() _data: ICDKContractData;

	/** Open dropdown */
	@State() _openDropDownIndex: number;

	/**Var to activate responsive skeletons*/
	@Prop({ mutable: true, reflect: false }) showSkeleton: boolean;
	@Prop({ mutable: true, reflect: false }) desktop: boolean;
	@Prop({ mutable: true, reflect: false }) tablet: boolean;
	@Prop({ mutable: true, reflect: false }) mobile: boolean;

	/**Var to activate no stat styles*/
	@Prop({ mutable: true, reflect: false }) noStat: boolean;

	/**Var to activate simple contract-list styles*/
	@Prop({ mutable: true, reflect: false }) isForseti: boolean;

	/**Var to activate horizontal filter styles*/
	@Prop({ mutable: true, reflect: false }) horizontalFilter: boolean;

	/**Var to hidden help btn from legend*/
	@Prop({ mutable: true, reflect: false }) hiddenHelp: boolean;

	typeCounter = (typeToFilter) => {
		if (
			typeof this._data.statusTypeCount !== 'undefined' &&
			this._data.statusTypeCount.length !== 0 &&
			typeof this._data.statusTypeCount.find((status) => status.type === typeToFilter) !== 'undefined'
		) {
			return this._data.statusTypeCount.find((status) => status.type === typeToFilter).count;
		} else {
			return this._data.groupList.filter((obj) => obj.status.type === typeToFilter).length;
		}
	};

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseFiltersApply(this.filtersApply);
		this.parseData(this.data);
		this.skeltonsResposnive();
	}

	/** Descripción del evento */
	@Event() userAction: EventEmitter;

	handleOpenDropDown(id, selectedIndex) {
		this._openDropDownIndex = selectedIndex;
		this.userAction.emit({
			type: 'openGroupDropDown',
			payload: id
		});
	}

	handleCloseDropDown() {
		this._openDropDownIndex = undefined;
	}

	iconClass(auxClass: string) {
		let buttonclass = '';
		switch (auxClass) {
			case 'icon-filepage':
				buttonclass = 'cdk-contract__btn--filepage';
				break;
			case 'icon-player':
				buttonclass = 'cdk-contract__btn--player';
				break;
			case 'icon-message':
				buttonclass = 'cdk-contract__btn--vdr';
				break;
			case 'icon-meeting':
				buttonclass = 'cdk-contract__btn--createvdr';
				break;
			case 'icon-awarness':
				buttonclass = 'cdk-contract__btn--awarness';
				break;
			case 'icon-awarness-fill':
				buttonclass = 'cdk-contract__btn--desecalate';
				break;
			case 'icon-check':
				buttonclass = 'cdk-contract__btn--check';
				break;
			case 'icon-sign':
				buttonclass = 'cdk-contract__btn--sign';
				break;
			case 'icon-doc_ok':
				buttonclass = 'cdk-contract__btn--doc';
				break;
			case 'icon-delete':
				buttonclass = 'cdk-contract__btn--delete';
				break;
			case 'icon-reject':
				buttonclass = 'cdk-contract__btn--reject';
				break;
			case 'icon-upload':
				buttonclass = 'cdk-contract__btn--upload';
				break;
			case 'icon-information-in-a-circle':
				buttonclass = 'cdk-contract__btn--detail';
				break;
			case 'icon-send':
				buttonclass = 'cdk-contract__btn--resend';
				break;
		}
		return buttonclass;
	}

	@Listen('emitHeaderSelection', { target: 'window' })
	_handleSelection(e: any) {
		e.preventDefault();
		if (!e.detail || e.detail === '') {
			return;
		}
		this.userAction.emit({
			type: 'clickSummary',
			payload: e.detail
		});
	}

	/**
	 * Deshabilita el botón VDR y UploadSignedContract si:
	 * - el topicPermission imperativamente tiene que ser un booleano (TRUE O FALSE)
	 * - el topicPermission es false (no tiene permisos sobre el tópico)
	 * - Si el subtype del status es 'pendingSignReviewClient', el botón upload se mantiene oculto y el VDR se muestra, deshabilitado o no según el topicPermission.
	 * */
	disabledByTopicPermissions(group, button): boolean {
		const case0 = typeof group.topicPermission === 'boolean'; // Es preciso que venga true o false, si es undefined no debe activar el tooltip.
		const case1 = (button.eventName === 'uploadSignedContract' || button.eventName === 'vdr') && !group.topicPermission;
		const case2 = button.eventName === 'vdr' && group.status.subType === 'signedUnderReview' && !group.topicPermission;
		return case0 && (case1 || case2);
	}
	disabledByNoTopic(group, button): boolean {
		let topicId = false;
		if (button.eventName === 'vdr' && !group.topicId) {
			topicId = true;
		} else {
			topicId = false;
		}
		return topicId;
	}
	disabledByDigitalSignature(group, button): boolean {
		let disabled: boolean = false;
		if (group.status.subType === 'digitalSignaturePending' && button.eventName === 'reject' && this._data.permissions[button.eventName]) {
			disabled = true;
		}
		return disabled;
	}
	statusConfigSwitch(status, literals) {
		switch (this._data.archetype) {
			case CDKStatusArchetypeEnum.IBOR:
				return statusConfigSwitchIbor(status, literals);
			case CDKStatusArchetypeEnum.REVIEWER:
				return statusConfigSwitchReviewer(status, literals);
			default:
				return statusConfigSwitchIbor(status, literals);
		}
	}

	@Listen('eventValuesFormEmitter')
	filterHandler(event: CustomEvent) {
		this.userAction.emit({
			type: 'filter',
			payload: event.detail
		});
		event.stopPropagation();
	}

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.skeltonsResposnive();
	}
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
	/** Parse to string a boolean value */
	_parseBoolean(item): string {
		return item.toString();
	}

	/** Devuelve true si existe el valor prevFilterStatus en el legendData */
	_identifiedStatus(legendData): boolean {
		return !!legendData.find((item) => item.label.toLowerCase() === this.prevFilterStatus.toLowerCase());
	}

	render() {
		const statusTypes = () => {
			switch (this._data.archetype) {
				case CDKStatusArchetypeEnum.IBOR:
					return Object.values(CDKStatusTypeEnumIbor);
				case CDKStatusArchetypeEnum.REVIEWER:
					return Object.values(CDKStatusTypeEnumReviewer);
				default:
					return [];
			}
		};
		const legendData = statusTypes().map((type) => {
			return { label: type, count: this.typeCounter(type) };
		});

		return this.showSkeleton ? (
			<div role="status" aria-busy="true" aria-live="polite">
				<figure class="cdk-contract--loading">
					{this.desktop && <CDKContractListSkeleton literalSkeleton={this._literals.accessibleLoading}></CDKContractListSkeleton>}

					{this.tablet && (
						<CDKContractListSkeletonTablet literalSkeleton={this._literals.accessibleLoading}></CDKContractListSkeletonTablet>
					)}

					{this.mobile && (
						<CDKContractListSkeletonMobile literalSkeleton={this._literals.accessibleLoading}></CDKContractListSkeletonMobile>
					)}
				</figure>
			</div>
		) : (
			<section class={{ 'cdk-contract': true, 'cdk-contract--forseti': this.isForseti }}>
				<div class="cdk-contract__panel">
					<div>
						<span class="cdk-contract__total">
							{this._data.itemCount} {this._literals.itemCountLabel}
						</span>
						<span class="cdk-contract__total">
							{this._data.subitemCount} {this._literals.subitemCountLabel}
						</span>
					</div>
					<div class="cdk-contract__group">
						<ul class="cdk-contract__list">
							{!this.hiddenHelp && (
								<scib-ui-button
									nobackground
									icon="icon-help-empty"
									title={this._literals.tooltip}
									hide-txt
									onClick={(e) => {
										this.userAction.emit({
											type: 'statusContext'
										});
										e.stopPropagation();
									}}
								></scib-ui-button>
							)}
							{!this.isForseti
								? legendData.map((status) => (
										<li class="cdk-contract__item">
											<span class="cdk-contract__state">
												{this._literals[status.label == 'progress' ? 'progress' : status.label]}
											</span>
											<scib-ui-color-panel status={status.label}>
												<span class="cdk-contract__number" slot="dataContent">
													{status.count}
												</span>
											</scib-ui-color-panel>
										</li>
								  ))
								: this._data.totalesStatus &&
								  Object.keys(this._data.totalesStatus).map((key) => (
										<li class="cdk-contract__item">
											<span class="cdk-contract__state">{this._literals[key.toLowerCase()]}</span>
											<scib-ui-color-panel
												id="scib-ui-color-panel"
												status={key}
												role="status"
												is-filter={this.isForseti}
												is-prev-active={
													!!this.prevFilterStatus &&
													this._identifiedStatus(legendData) &&
													this._parseBoolean(key === this.prevFilterStatus)
												}
											>
												<span class="cdk-contract__number" slot="dataContent">
													{this._data.totalesStatus[key]}
												</span>
											</scib-ui-color-panel>
										</li>
								  ))}
						</ul>
						<scib-ui-filter
							alignButtons={this.isForseti}
							filtersApply={this._filtersApply}
							horizontalFilter={this.horizontalFilter}
							filter-literals={JSON.stringify({
								filterTitle: this._literals.filterLiterals.filterTitle,
								filterbtn: this._literals.filterLiterals.filterbtn,
								fieldset: this._literals.filterLiterals.fieldset
							})}
						></scib-ui-filter>
					</div>
				</div>
				<div class="cdk-contract__listing">
					{this._data.groupList.map((group, index) => {
						/* TODO: Mirarlo con Enric, reemplazar los statusConfigSwitch por this.statusConfigSwitch */
						const statusConfigSwitch = (status, literals) => {
							switch (this._data.archetype) {
								case CDKStatusArchetypeEnum.IBOR:
									return statusConfigSwitchIbor(status, literals);
								case CDKStatusArchetypeEnum.REVIEWER:
									return statusConfigSwitchReviewer(status, literals, this._data.permissions);
								default:
									return statusConfigSwitchIbor(status, literals);
							}
						};
						return (
							<div class="cdk-contract__row" data-cy="contract-row">
								<scib-ui-color-panel status={group.status.type}>
									<div
										class={{
											'cdk-contract__slot cdk-contract__slot--column': true,
											'cdk-contract__slot--noStat': this.noStat
										}}
										slot="dataContent"
										data-cy="contract-row-content"
									>
										<div class={`cdk-contract__element cdk-contract-${group.status.type}`} data-cy="contract-row-content-headers">
											<div class="cdk-contract__cell" data-cy="contract-row-content-headers-cell">
												<label class="cdk-contract__label">{this._literals.status}</label>
												<div class="cdk-contract__box">
													<div class="cdk-contract__progress-title">
														{!statusConfigSwitch(group.status.subType, this._literals).noProgressBar && (
															<scib-ui-circle-progress-bar
																key={group.status.subType + group.id}
																circle-progress-bar-id={`circle-progress-bar-${group.id}`}
																styling={{
																	color: statusConfigSwitch(group.status.subType, this._literals).color,
																	strokeWidth: 8,
																	trailWidth: 4,
																	trailColor: '#DCDCDC'
																}}
																part-value={statusConfigSwitch(group.status.subType, this._literals).progress}
																noDecimals
																total-value="100"
																show-ratio="false"
																show-check-when-complete
															></scib-ui-circle-progress-bar>
														)}
														<span
															class={{
																'cdk-contract__data': true,
																'cdk-contract__data--nomrg': statusConfigSwitch(group.status.subType, this._literals)
																	.noProgressBar
															}}
															title={this._literals[group.status.subType]}
														>
															{this._literals[group.status.subType]}
														</span>
													</div>
													{statusConfigSwitch(group.status.subType, this._literals).showFeed && (
														<scib-ui-button
															icon="icon-guide"
															disable-min-width
															hide-txt
															nobackground
															disabled={group.feedDisabled}
															class="cdk-contract__feed-btn"
															onClick={(e) => {
																this.userAction.emit({
																	type: 'feed',
																	payload: group.id
																});
																e.stopPropagation();
															}}
														></scib-ui-button>
													)}
												</div>
											</div>
											<div class="cdk-contract__cell">
												<label class="cdk-contract__label">{this._literals.group}</label>
												<span class="cdk-contract__data" title={group.groupName}>
													{group.groupName}
												</span>
											</div>
											<div class="cdk-contract__cell">
												<label class="cdk-contract__label">{this._literals.contracts}</label>
												<span class="cdk-contract__data">{group.contracts}</span>
											</div>
											{statusConfigSwitch(group.status.subType, this._literals).date && (
												<div class="cdk-contract__cell">
													<label class="cdk-contract__label">{this._literals.date}</label>
													<span class="cdk-contract__data">{group.trade_date}</span>
												</div>
											)}
											<div class="cdk-contract__cell">
												<label class="cdk-contract__label">{this._literals.amendment}</label>
												{group.hasTemplate ? (
													<div
														class={{
															'cdk-contract__file': true,
															'cdk-contract__file--unassigned':
																!group.amendmentName || !this._data.permissions.downloadEnabled
														}}
														onClick={(e) => {
															group.amendmentName &&
																this._data.permissions.downloadEnabled &&
																this.userAction.emit({
																	type: 'downloadAmendment',
																	payload: group.id
																});
															e.stopPropagation();
														}}
													>
														{group.amendmentName && <CDKContractListPillContent file={group.amendmentName} />}
														<span
															class="cdk-contract__data"
															title={
																group.amendmentName ? group.amendmentName : this._literals.pendingToAssignAmendment
															}
														>
															{group.amendmentName ? group.amendmentName : this._literals.pendingToAssignAmendment}
														</span>
														{!statusConfigSwitch(group.status.subType, this._literals).uploadEnabled &&
															this._data.permissions.downloadEnabledIcon &&
															this._data.permissions.downloadEnabledIcon && (
																<span class="cdk-contract__data">
																	<scib-ui-button
																		icon="icon-download"
																		disable-min-width
																		hide-txt
																		nobackground
																		disabled={!this._data.permissions.downloadEnabledIcon}
																		onClick={(e) => {
																			if (this._data.permissions.downloadEnabledIcon) {
																				this.userAction.emit({
																					type: 'downloadAmendment',
																					payload: group.id
																				});
																			}
																			e.stopPropagation();
																		}}
																	></scib-ui-button>
																</span>
															)}
														{statusConfigSwitch(group.status.subType, this._literals).uploadEnabled && (
															<span class="cdk-contract__data">
																<scib-ui-button
																	icon="icon-upload"
																	disable-min-width
																	hide-txt
																	nobackground
																	disabled={!this._data.permissions.uploadEnabled}
																	tooltip={this._literals.tooltip}
																	onClick={(e) => {
																		if (this._data.permissions.uploadEnabled) {
																			this.userAction.emit({
																				type: 'uploadAmendment',
																				payload: group.id
																			});
																		}
																		e.stopPropagation();
																	}}
																></scib-ui-button>
															</span>
														)}
													</div>
												) : group.status.subType !== 'proposalPreparation' &&
												  group.status.subType !== 'proposalPreparationDelete' ? (
													<span class="cdk-contract__data" title={this._literals.pendingToAssignParameters}>
														{this._literals.pendingToAssignParameters}
													</span>
												) : (
													<span class="cdk-contract__data" title={this._literals.pendingToAssignTemplate}>
														{this._literals.pendingToAssignTemplate}
													</span>
												)}
											</div>
											{group.clientName && (
												<div class="cdk-contract__cell">
													<label class="cdk-contract__label">{this._literals.client}</label>
													<span class="cdk-contract__data" title={group.clientName}>
														{group.clientName}
													</span>
												</div>
											)}
										</div>
										<div class="cdk-contract__cell cdk-contract__cell--actions" data-cy="contract-row-content-actions">
											<div class="cdk-contract__cell cdk-contract__cell--btns" data-cy="contract-row-content-actions-buttons">
												{statusConfigSwitch(group.status.subType, this._literals).buttonListConfig.map((button) => (
													<scib-ui-button
														class={'cdk-contract__btn ' + this.iconClass(button.icon)}
														icon={button.icon}
														disable-min-width
														icon-left
														nobackground
														small
														onClick={() => {
															if (
																this._data.permissions[button.eventName] &&
																!this.disabledByTopicPermissions(group, button) &&
																!this.disabledByNoTopic(group, button) &&
																!(
																	group.status.subType === 'readyToNegotiate' &&
																	button.eventName === 'startNegotation' &&
																	new Date(group.blockEnd).getTime() > new Date().getTime()
																)
															) {
																this.userAction.emit({
																	type: button.eventName,
																	payload: group.id
																});
															}
														}}
														disabled={
															!this._data.permissions[button.eventName] ||
															this.disabledByTopicPermissions(group, button) ||
															this.disabledByNoTopic(group, button) ||
															(group.status.subType === 'readyToNegotiate' &&
																button.eventName === 'startNegotation' &&
																new Date(group.blockEnd).getTime() > new Date().getTime()) ||
															this.disabledByDigitalSignature(group, button)
														}
														tooltip={this._literals.tooltip}
														disabled-tooltip={this._literals.disabledTooltip}
														class-tooltip={'--forseti'}
													>
														{button.label}
													</scib-ui-button>
												))}
											</div>
											{!statusConfigSwitch(group.status.subType, this._literals).noDropDown && (
												<scib-ui-button
													icon="icon-chevron-down"
													disable-min-width
													hide-txt
													nobackground
													onClick={() => {
														if (index === this._openDropDownIndex) {
															this.handleCloseDropDown();
														} else {
															this.handleOpenDropDown(group.id, index);
														}
													}}
													class={{
														'cdk-contract__dropdown-btn--open': this._openDropDownIndex === index
													}}
												></scib-ui-button>
											)}
										</div>
									</div>
									{index === this._openDropDownIndex && (
										<div
											class={{
												'cdk-contract__slot': true,
												'cdk-contract__slot--child': true,
												'cdk-contract__slot--border': group.paramList && group.paramList.length > 0
											}}
											slot="dataContent"
										>
											{group.paramList && group.paramList.length > 0 && (
												<section class="cdk-contract__details cdk-contract__details--padding">
													<scib-ui-row>
														<scib-ui-column col-xs="6" col-md="6" col-lg="6">
															<div class="cdk-contract__template--box">
																<div class="cdk-contract__template--wrapper">
																	<div class="cdk-contract__template--cell">
																		<span class="cdk-contract__template">{this._literals.template}</span>
																		{group.template && group.template !== '' && (
																			<scib-ui-button
																				link
																				disableMinWidth
																				title={group.template}
																				onClick={() => {
																					this.userAction.emit({
																						type: 'templateDetail',
																						payload: group.id
																					});
																				}}
																			>
																				{group.template}
																			</scib-ui-button>
																		)}
																	</div>
																	{this._literals.contact && this._literals.contact !== '' && (
																		<div class="cdk-contract__template--cell">
																			<span class="cdk-contract__template">{this._literals.contact}&nbsp;</span>
																			{group.contactEmail && group.contactEmail !== '' ? (
																				<span
																					class="cdk-contract__template--details"
																					title={group.contactEmail}
																				>
																					{group.contactEmail}
																				</span>
																			) : (
																				<span
																					class="cdk-contract__template--details"
																					title={this._literals.emptyContact}
																				>
																					{this._literals.emptyContact}
																				</span>
																			)}
																		</div>
																	)}
																</div>
																{statusConfigSwitch(group.status.subType, this._literals).editParamsEnabled && (
																	<scib-ui-button
																		icon="icon-edit-pencil"
																		icon-left
																		disable-min-width
																		link
																		disabled={!this._data.permissions.editParameters}
																		onClick={() => {
																			if (this._data.permissions.editParameters) {
																				this.userAction.emit({
																					type: 'editParametersCase',
																					payload: group.id
																				});
																			}
																		}}
																	>
																		{this._literals.editParameters}
																	</scib-ui-button>
																)}
															</div>
														</scib-ui-column>
													</scib-ui-row>
													<scib-ui-row class="cdk-contract__paramlist">
														{group.paramTypes.map((paramType, index) => (
															<scib-ui-row>
																<scib-ui-column
																	class="cdk-contract__paramlist--param"
																	col-xs="6"
																	col-md="6"
																	col-lg="6"
																>
																	<b>{!!this._literals.paramTypes && this._literals.paramTypes[index]}</b>
																</scib-ui-column>
																<scib-ui-column
																	class="cdk-contract__paramlist--data"
																	col-xs="6"
																	col-md="6"
																	col-lg="6"
																>
																	{group.paramList.find((param) => param.parameterType === paramType) ? (
																		<scib-ui-row>
																			{group.paramList.map(
																				(param) =>
																					param.parameterType === paramType && (
																						<scib-ui-column col-xs="6" col-lg="2">
																							<scib-ui-label-data
																								label={param.label}
																								text={
																									Array.isArray(param.text)
																										? param.text.join(', ')
																										: param.text
																								}
																							></scib-ui-label-data>
																						</scib-ui-column>
																					)
																			)}
																		</scib-ui-row>
																	) : (
																		<scib-ui-row>
																			<scib-ui-column
																				class="cdk-contract__paramlist--empty"
																				col-xs="6"
																				col-lg="6"
																			>
																				{this._literals.emptyState}
																			</scib-ui-column>
																		</scib-ui-row>
																	)}
																</scib-ui-column>
															</scib-ui-row>
														))}
													</scib-ui-row>
												</section>
											)}
											{!group.emptyState ? (
												group.contractList && group.contractList.length > 0 ? (
													<section class="cdk-contract__details cdk-contract__details--padding">
														<scib-ui-row>
															<scib-ui-column col-xs="6" col-md="6" col-lg="6">
																<div class="cdk-contract__table">
																	<scib-ui-table
																		show-skeleton={group.isLoading}
																		table-id={group.id}
																		detail-header={group.detailHeader}
																		has-rendered-icons={true}
																		column-defs={JSON.stringify(this._data.tableColumnDefs)}
																		row-data={JSON.stringify(group.contractList)}
																		top-buttons={JSON.stringify([
																			{
																				text: this._literals.tableLiterals.assignGroup,
																				icon: 'icon-size_refresh',
																				eventId: 'assignToGroup',
																				showIfAnySelectedOnly:
																					this._data.tableTopButtons[0]?.showIfAnySelectedOnly || false,
																				disableIfNoneSelected:
																					this._data.tableTopButtons[0]?.disableIfNoneSelected || true,
																				hiddenIfAnySelectedOnly:
																					this._data.tableTopButtons[0]?.hiddenIfAnySelectedOnly || false,
																				link: true,
																				isDisabled:
																					!this._data.permissions._reassignOperation ||
																					statusConfigSwitch(group.status.subType, this._literals)
																						.reasignOperationEnabled === false
																			},
																			{
																				text: this._literals.tableLiterals.downloadSelection,
																				icon: 'icon-download',
																				eventId: 'downloadMessageFiles',
																				showIfAnySelectedOnly:
																					this._data.tableTopButtons[1]?.showIfAnySelectedOnly || true,
																				hiddenIfAnySelectedOnly:
																					this._data.tableTopButtons[1]?.hiddenIfAnySelectedOnly || false,
																				link: true,
																				isDisabled: !this._data.permissions._downloadOperations
																			},
																			{
																				text: this._literals.tableLiterals.downloadAll,
																				icon: 'icon-download',
																				eventId: 'downloadMessageFiles',
																				showIfAnySelectedOnly:
																					this._data.tableTopButtons[2]?.showIfAnySelectedOnly || false,
																				hiddenIfAnySelectedOnly:
																					this._data.tableTopButtons[2]?.hiddenIfAnySelectedOnly || true,
																				link: true,
																				isDisabled: !this._data.permissions._downloadOperations
																			}
																		])}
																		element-name={this._literals.tableItemCount}
																		is-selectable={true}
																		is-draggable={true}
																		activate-horizontal-scroll={-1}
																		pagination-page-size={10}
																		literals={JSON.stringify(this._literals.tableLiterals)}
																	></scib-ui-table>
																</div>
															</scib-ui-column>
														</scib-ui-row>
													</section>
												) : (
													<section class="cdk-contract__details cdk-contract__details--padding cdk-contract__details--empty">
														<h4>{this._literals.loading}...</h4>
													</section>
												)
											) : (
												<section class="cdk-contract__details cdk-contract__details--padding cdk-contract__details--empty">
													<h4>{this._literals.noTableMessage}</h4>
													<p>{this._literals.noTableSubMessage}</p>
												</section>
											)}
										</div>
									)}
								</scib-ui-color-panel>
							</div>
						);
					})}
				</div>
				<scib-ui-loading
					literals={{ buttonText: this._literals.loadBtn }}
					secondary={true}
					show={this._data.showLoading}
					animation={this._data.loadingMoreItems}
					button={true}
					bottom={true}
				></scib-ui-loading>
			</section>
		);
	}
}
