import { ICDKTopicCardLiterals, ICDKTopicListLiterals } from '../models/cdk-topic-card.model';
import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { CDKTopicCardSkeleton } from '../fragments/cdk-topic-card-skeleton.fragment';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-topic-card',
	styleUrl: 'cdk-topic-card.scss',
	shadow: false,
	scoped: false,
})
export class CDKTopicCard {
	$parentEl: HTMLElement;
	$topicCardParent: HTMLElement;

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKTopicCardLiterals | string;

	/*Condicional para activar las caracteristicas adicionales de empleados*/
	@Prop({ reflect: true }) isEmployees: boolean;

	/*Indica si se mostrará la tarjeta como un skeleton*/
	@Prop({ reflect: true }) showSkeleton: boolean;

	/*Indica la posición del tooltip*/
	@Prop({ reflect: true }) tooltipPosition: string = 'left';

	/** Indica si el topico contiene nuevas notificaciones */
	@Prop({ reflect: true }) haveNotifications: boolean;

	/** Indica si el topico esta en modo edición */
	@Prop({ reflect: true }) edit: boolean = false;

	/** Indicates if topic has a closed status */
	@Prop({ reflect: true }) closed: boolean = false;

	/** Indicates if topic has a closed status for swtch */
	@Prop({ reflect: true }) closedSwitch: boolean = false;

	/** Indica el id asociado a la conversación del framework de comunicaciones */
	@Prop({ reflect: true }) conversationId: string;

	/** Indicates if the user has close/open status permissions */
	@Prop() statusChangePermission: boolean = false;

	/** Listado de members*/
	@Prop({ mutable: true, reflect: true }) membersList: ICDKTopicListLiterals[] | string;

	@Prop({ reflect: true }) disabled: boolean = false;

	@Watch('literals') literalsChange(newVal: ICDKTopicCardLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	/** Parseo de los members */
	@Watch('membersList') membersListChange(newVal: ICDKTopicListLiterals[] | string) {
		this._membersList = _parseProp(newVal);
	}

	@Watch('haveNotifications') notificationsChange(newVal: boolean) {
		this._haveNotifications = newVal;
	}

	@Watch('disabled') disabledChange(newVal) {
		this._disabled = newVal;
	}

	@State() _literals: ICDKTopicCardLiterals;
	@State() _membersList: ICDKTopicListLiterals[];
	@State() _parentHeight: string;
	@State() _showTooltip: string;
	@State() _haveNotifications: boolean;
	@State() _disabled: boolean;
	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.membersListChange(this.membersList);
		this.notificationsChange(this.haveNotifications);
		this.disabledChange(this.disabled);
	}

	/** Life cycle executed after the first Render after loading */
	componentDidLoad() {}

	/** Life cycle by removing the instance of the component */
	disconnectedCallback() {}

	/** Emite un evento con el id de la conversación que se abrirá */
	@Event() eventOpenTopic: EventEmitter<string>;

	/** Emite un evento con el id del topico que se quiere editar */
	@Event() eventEditTopic: EventEmitter<string>;

	/** Event emitter to change status open/close */
	@Event() eventChangeStatus: EventEmitter;

	showTooltip(check) {
		if (check) {
			this._parentHeight = this.$parentEl?.clientHeight + 'px';
			this.$topicCardParent.style.zIndex = '2';
			this._showTooltip = 'block';
		} else {
			this.$topicCardParent.style.zIndex = '1';
			this._showTooltip = 'none';
		}
	}

	_handleStatusChange(ev) {
		this.eventChangeStatus.emit({
			id: this.conversationId,
			value: ev.detail.value,
			valueText: ev.detail.value ? 'open' : 'close',
		});
	}

	render() {
		return this.showSkeleton ? (
			<div class="cdk-topic-card__skeleton">
				<div class="cdk-topic-card__skeleton-container">
					<CDKTopicCardSkeleton />
					<div class="cdk-topic-card__skeleton-shine" />
				</div>
			</div>
		) : (
			<a
				class="cdk-topic-card"
				href="javascript:void(0)"
				ref={el => (this.$topicCardParent = el as HTMLElement)}
				title={this._literals.tooltipTopic}
				onClick={() => {
					this.eventOpenTopic.emit(this.conversationId);
					event.stopPropagation();
				}}
			>
				<article class={{ 'cdk-topic-article': true, 'cdk-topic-article--closed': this.closed }}>
					<div class="cdk-topic-article__title-container">
						<div
							class={{ 'cdk-topic-title': true, 'cdk-topic-title--closed': this.closed, 'cdk-topic-title--switch': this.edit && this.statusChangePermission }}
							innerHTML={this._literals.mainTitle}
						></div>
					</div>
					{this.edit ? (
						<div class={{ 'cdk-topic-status': this.statusChangePermission }}>
							<scib-ui-button
								nobackground
								icon="icon-edit-pencil"
								hide-txt
								small
								onEventClick={() => {
									this.eventEditTopic.emit(this.conversationId);
									event.stopPropagation();
								}}
							></scib-ui-button>
							{this.statusChangePermission && (
								<scib-ui-switch
									checked={!this.closedSwitch}
									label=""
									disabled={this.disabled}
									onEventChange={ev => {
										this._handleStatusChange(ev);
										event.stopPropagation();
									}}
								></scib-ui-switch>
							)}
						</div>
					) : (
						<scib-ui-button
							nobackground
							icon="icon-message"
							hide-txt
							small
							have-notification={this._haveNotifications}
							onEventClick={() => {
								this.eventOpenTopic.emit(this.conversationId);
								event.stopPropagation();
							}}
						></scib-ui-button>
					)}
					<div class="cdk-topic-desc" innerHTML={this._literals.description}></div>
					<footer class="cdk-topic-footer">
						<div
							class="cdk-topic-audience"
							ref={el => (this.$parentEl = el as HTMLElement)}
							onMouseEnter={() => this.showTooltip(true)}
							onMouseLeave={() => this.showTooltip(false)}
						>
							<div class="cdk-topic-group">
								<div class="cdk-topic-label" innerHTML={this._literals.members}></div>
								<ul class="cdk-topic-list">
									{this._membersList.slice(0, 3).map(members => (
										<li class="cdk-topic-item">
											{members.imgSrc ? (
												<figure class={{ 'cdk-topic-avatar': true, '--employees': members.isEmployees }}>
													<img
														class="cdk-topic-img"
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
												<figure class={{ 'cdk-topic-avatar': true, '--fallback': true, '--employees': members.isEmployees, '--no-avatar': !members.imgSrc }}>
													<span class="cdk-topic-no-avatar">
														{members.imgAlt
															? members.imgAlt.slice(0, 1).toUpperCase() + '' + members.imgAlt.split(' ')[1].slice(0, 1).toUpperCase()
															: members.name.slice(0, 1).toUpperCase() + '' + members.name.split(' ')[1].slice(0, 1).toUpperCase()}
													</span>
												</figure>
											)}
										</li>
									))}
								</ul>
							</div>
							{this._membersList.length >= 4 ? <div class="cdk-topic-counter" innerHTML={`<span>+ ${this._membersList.length - 3}</span>`}></div> : ''}
						</div>
					</footer>
				</article>
			</a>
		);
	}
}
