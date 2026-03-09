import { ICDKVdrDetailLiterals, ICDKVdrDetailMembersLiterals, ICDKVdrDetailOwnersLiterals } from '../models/cdk-vdr-detail.model';
import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { CDKVdrDetailSkeleton } from '../fragments/cdk-vdr-detail-skeleton.fragment';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-detail',
	styleUrl: 'cdk-vdr-detail.scss',
	shadow: false,
	scoped: false,
})
export class CDKVdrDetail {
	$parentEl: HTMLElement;
	$parentEl2: HTMLElement;

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKVdrDetailLiterals | string;

	/** Owners List*/
	@Prop({ mutable: true, reflect: true }) ownersList: ICDKVdrDetailOwnersLiterals[] | string;

	/** Members List*/
	@Prop({ mutable: true, reflect: true }) membersList: ICDKVdrDetailMembersLiterals[] | string;

	/** tooltip data */
	@Prop({ mutable: true, reflect: true }) tooltipData: any | string;

	/*Indica la posición del tooltip*/
	@Prop({ reflect: true }) tooltipPositionX: string = 'right';

	/*Indica la posición del tooltip*/
	@Prop({ reflect: true }) tooltipPositionY: string = 'top';

	/*Indica si se mostrará la tarjeta como un skeleton*/
	@Prop({ reflect: true }) showSkeleton: boolean;

	/** Indicates if vdr is opened or closed */
	@Prop({ reflect: true }) vdrStatus: boolean;

	@Prop({ reflect: true }) scalation: boolean = false;

	@Watch('literals') literalsChange(newVal: ICDKVdrDetailLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	/** Parseo de los owners */
	@Watch('ownersList') ownersListChange(newVal: ICDKVdrDetailOwnersLiterals[] | string) {
		this._ownersList = _parseProp(newVal, []);
	}

	/** Parseo de los members */
	@Watch('membersList') membersListChange(newVal: ICDKVdrDetailMembersLiterals[] | string) {
		this._membersList = _parseProp(newVal, []);
	}

	/** Parseo de los members */
	@Watch('tooltipData') tooltipDataChange(newVal: any | string) {
		this._tooltipData = _parseProp(newVal);
	}

	@Watch('vdrStatus') closeVdrChange(newVal: boolean) {
		this._vdrStatus = newVal;
	}

	@Watch('scalation') scalationVdr(newVal: boolean) {
		this._scalation = newVal;
	}

	@State() _literals: ICDKVdrDetailLiterals;
	@State() _ownersList: ICDKVdrDetailOwnersLiterals[];
	@State() _membersList: ICDKVdrDetailMembersLiterals[];
	@State() _parentHeight: string;
	@State() _showTooltip: string;
	@State() _parentHeight2: string;
	@State() _showTooltip2: string;
	@State() _tooltipData: any;
	@State() _vdrStatus: boolean;
	@State() _scalation: boolean;

	@State() _resizeView: number = window.innerWidth;
	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this._resizeView = window.innerWidth;
	}

	/** Event when you click the edit button */
	@Event() eventEditVdr: EventEmitter;

	/** Event when you click the edit button */
	@Event() eventManageRequest: EventEmitter;

	/** Event to manage the switch button */
	@Event() eventSwitchVdr: EventEmitter;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.ownersListChange(this.ownersList);
		this.membersListChange(this.membersList);
		this.tooltipDataChange(this.tooltipData);
		this.closeVdrChange(this.vdrStatus);
		this.scalationVdr(this.scalation);
	}

	/** Emitter to button to edit */
	_handleManageRequest() {
		this.eventManageRequest.emit();
	}

	/** Emitter to button to edit */
	_handleEdit() {
		this.eventEditVdr.emit();
	}

	_handleSwitch(event) {
		this._vdrStatus = !this._vdrStatus;
		this.eventSwitchVdr.emit(event);
	}

	showTooltip(e, check, id) {
		this.checkXYPosition(e);
		switch (id) {
			case 'members':
				if (check) {
					this._parentHeight = this.$parentEl?.clientHeight + 'px';
					this._showTooltip = 'block';
				} else {
					this._showTooltip = 'none';
				}
				break;
			case 'owners':
				if (check) {
					this._parentHeight2 = this.$parentEl?.clientHeight + 'px';
					this._showTooltip2 = 'block';
				} else {
					this._showTooltip2 = 'none';
				}
				break;
			default:
				break;
		}
	}

	checkXYPosition(mouseEvent) {
		let positionX = mouseEvent.clientX;
		let positionY = mouseEvent.clientY;

		let windowX = window.outerWidth;
		let windowY = window.outerHeight;

		if (positionX >= windowX / 2 && positionY <= windowY / 2) {
			this.tooltipPositionX = 'right';
			this.tooltipPositionY = 'top';
		} else if (positionX < windowX / 2 && positionY <= windowY / 2) {
			this.tooltipPositionX = 'left';
			this.tooltipPositionY = 'top';
		} else if (positionX >= windowX / 2 && positionY > windowY / 2) {
			this.tooltipPositionX = 'right';
			this.tooltipPositionY = 'bottom';
		} else {
			this.tooltipPositionX = 'left';
			this.tooltipPositionY = 'bottom';
		}
	}

	render() {
		return this.showSkeleton ? (
			<div class="cdk-detail__skeleton">
				<div class="cdk-detail__skeleton-container">
					<CDKVdrDetailSkeleton />
					<div class="cdk-detail__skeleton-shine" />
				</div>
			</div>
		) : (
			<section class={{ 'cdk-detail': true, 'cdk-detail--closed': this._vdrStatus }}>
				<div class="cdk-detail__vdr">
					<div class="cdk-detail__header">
						{this._scalation && this._literals.criticality && (
							<span
								style={{ 'background-color': this._literals.criticality.color }}
								class="cdk-detail__title--criticality"
								innerHTML={this._literals.criticality.title}
							></span>
						)}
						<h3 class="cdk-detail__title">{this._literals.title}</h3>
						{this._literals.title.length > 25 && (
							<scib-ui-info-tooltip
								tooltipPos={this._resizeView > 767 ? 'right' : 'left'}
								title="Click to see complete title"
								text={this._literals.title}
							></scib-ui-info-tooltip>
						)}
					</div>
					<p class="cdk-detail__description">
						<span>{this._literals.description}</span>
						{this._literals.description.length > 52 && (
							<scib-ui-info-tooltip
								tooltipPos={this._resizeView > 767 ? 'right' : 'left'}
								title="Click to see complete description"
								text={this._literals.description}
							></scib-ui-info-tooltip>
						)}
					</p>
				</div>

				<div class="cdk-detail__owners">
					<div
						class="cdk-detail__owners-wrapper"
						ref={el => (this.$parentEl2 = el as HTMLElement)}
						onMouseEnter={e => this.showTooltip(e, true, 'owners')}
						onMouseLeave={e => this.showTooltip(e, false, 'owners')}
					>
						<label class="cdk-detail__label">{this._literals.ownersLabel}</label>
						<div class="cdk-detail__grouping">
							<ul class="cdk-detail__list">
								{this._ownersList.slice(0, 3).map(owners => (
									<li
										class={{
											'cdk-detail__item': true,
											'cdk-detail__item--single': this._ownersList.length <= 1,
										}}
									>
										<div class="cdk-detail__owner">
											{owners.imgSrc ? (
												<figure class="cdk-detail__avatar cdk-detail__avatar--employees">
													<img
														class="cdk-detail__img"
														src={owners.imgSrc}
														alt=""
														onError={event => {
															const img = event.target as HTMLElement;
															img.setAttribute(
																'src',
																"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E",
															);
														}}
													/>
												</figure>
											) : (
												<figure
													class={{
														'cdk-detail__avatar': true,
														'cdk-detail__avatar--employees': true,
														'cdk-detail__avatar--fallback': true,
														'cdk-detail__avatar--no-avatar': !owners.imgSrc,
													}}
												>
													<span class="cdk-detail__no-avatar">
														{owners.imgAlt
															? owners.imgAlt.slice(0, 1).toUpperCase() +
															  '' +
															  owners.imgAlt.split(' ')[1].slice(0, 1).toUpperCase()
															: owners.name.slice(0, 1).toUpperCase() +
															  '' +
															  owners.name.split(' ')[1].slice(0, 1).toUpperCase()}
													</span>
												</figure>
											)}
											{/* {this._ownersList.length <= 1 && <p class="cdk-detail__info">{owners.name}</p>} */}
										</div>
									</li>
								))}
							</ul>
							{this._ownersList.length > 1 &&
								(this._ownersList.length >= 4 ? (
									<div class="cdk-detail__counter" innerHTML={`<span>+ ${this._ownersList.length - 3}</span>`}></div>
								) : (
									''
								))}
						</div>

						<scib-cdk-members-tooltip
							positionX={this.tooltipPositionX}
							positionY={this.tooltipPositionY}
							members={this._ownersList}
							parentHeight={this._parentHeight2}
							show={this._showTooltip2}
							linkData={this._tooltipData?.link}
						></scib-cdk-members-tooltip>
					</div>
				</div>
				{this._membersList.length ? (
					<div class="cdk-detail__options cdk-detail__members">
						<div class="cdk-detail__group">
							<div
								class="cdk-detail__members"
								ref={el => (this.$parentEl = el as HTMLElement)}
								onMouseEnter={e => this.showTooltip(e, true, 'members')}
								onMouseLeave={e => this.showTooltip(e, false, 'members')}
							>
								<label class="cdk-detail__label">{this._literals.membersLabel}</label>
								<div class="cdk-detail__grouping">
									<ul class="cdk-detail__list">
										{this._membersList.slice(0, 3).map(members => (
											<li class="cdk-detail__item">
												{members.imgSrc ? (
													<figure
														class={{
															'cdk-detail__avatar': true,
															'cdk-detail__avatar--employees': members.isEmployees,
														}}
													>
														<img
															class="cdk-detail__img"
															src={members.imgSrc}
															alt={members.imgAlt}
															onError={event => {
																const img = event.target as HTMLElement;
																img.setAttribute(
																	'src',
																	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E",
																);
															}}
														/>
													</figure>
												) : (
													<figure
														class={{
															'cdk-detail__avatar': true,
															'cdk-detail__avatar--fallback': true,
															'cdk-detail__avatar--employees': members.isEmployees,
															'cdk-detail__avatar--no-avatar': !members.imgSrc,
														}}
													>
														<span class="cdk-detail__no-avatar">
															{members.imgAlt
																? members.imgAlt.slice(0, 1).toUpperCase() +
																  '' +
																  members.imgAlt.split(' ')[1].slice(0, 1).toUpperCase()
																: members.name.slice(0, 1).toUpperCase() +
																  '' +
																  members.name.split(' ')[1].slice(0, 1).toUpperCase()}
														</span>
													</figure>
												)}
											</li>
										))}
									</ul>
									{this._membersList.length >= 4 ? (
										<div class="cdk-detail__counter" innerHTML={`<span>+ ${this._membersList.length - 3}</span>`}></div>
									) : (
										''
									)}
								</div>
								<scib-cdk-members-tooltip
									positionX={this.tooltipPositionX}
									positionY={this.tooltipPositionY}
									members={this._membersList}
									parentHeight={this._parentHeight}
									show={this._showTooltip}
									linkData={this._tooltipData?.link}
								></scib-cdk-members-tooltip>
							</div>
						</div>
					</div>
				) : (
					''
				)}
				{this._scalation && this._literals.state && (
					<div class="cdk-detail__state">
						<label class="cdk-detail__label">{this._literals.stateVdr}</label>
						<p>
							<span role="icon" style={{ 'background-color': this._literals.state.color }}></span>
							<span class="cdk-detail__info">{this._literals.state.title}</span>
						</p>
					</div>
				)}
				<div class="cdk-detail__status">
					<label class="cdk-detail__label">{this._literals.status}</label>
					<span class="cdk-detail__info">{this._literals.activedate}</span>
				</div>
				<div class="cdk-detail__options">
					{this._literals.isEmployees ? (
						<div class="cdk-detail__btns">
							{/* <scib-ui-button
                            nobackground
                            icon="icon-inbox"
                            hide-txt
                            small
                            title={this._literals.btnCreate}
                            onEventClick={() => this._handleManageRequest()}
                        ></scib-ui-button> */}
							<scib-ui-button
								nobackground
								icon="icon-edit-pencil"
								hide-txt
								small
								title={this._literals.btnEdit}
								onEventClick={() => this._handleEdit()}
							></scib-ui-button>
							<scib-atoms-switch
								checked={this._vdrStatus}
								onValueChange={ev => {
									this._handleSwitch(ev);
								}}
							>
								<span class="cdk-detail__btns--close-vdr">{this._resizeView > 767 ? this._literals.switchClose : ''}</span>
							</scib-atoms-switch>
							{/* <scib-ui-switch checked label="Close VDR" onEventChange={() => this._handleSwitch()}></scib-ui-switch> */}
						</div>
					) : (
						''
					)}
				</div>
			</section>
		);
	}
}
