import { Component, h, Prop, Watch, State, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { CDKVdrCardSkeleton } from '../fragments/cdk-vdr-card.skeleton';
import { ICDKVdrCardLiterals, ICDKVdrListLiterals } from '../models/cdk-vdr-card.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-card',
	styleUrl: 'cdk-vdr-card.scss',
	shadow: false,
	scoped: false,
})
export class CDKVdrCard {
	$parentEl: HTMLElement;
	$parentEl2: HTMLElement;
	$vdrCardParent: HTMLElement;

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKVdrCardLiterals | string;

	/*Condicional para activar las caracteristicas adicionales de empleados*/
	@Prop({ reflect: true }) isEmployees: boolean;

	/*Indica si se mostrará la tarjeta como un skeleton*/
	@Prop({ reflect: true }) showSkeleton: boolean;

	/*Indica la posición del tooltip*/
	@Prop({ reflect: true }) tooltipPosition: string = 'right';

	/** Listado de owners*/
	@Prop({ mutable: true, reflect: true }) ownersList: ICDKVdrListLiterals[] | string;

	/** Listado de members*/
	@Prop({ mutable: true, reflect: true }) membersList: ICDKVdrListLiterals[] | string;

	/** Indicates if vdr has a closed status */
	@Prop({ mutable: true, reflect: true }) closed: boolean;
	@Watch('closed') closedChange(newVal: boolean) {
		this._closed = newVal;
	}
	@State() _closed: boolean;

	@Watch('literals') literalsChange(newVal: ICDKVdrCardLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	/** Parseo de los owners */
	@Watch('ownersList') ownersListChange(newVal: ICDKVdrListLiterals[] | string) {
		this._ownersList = _parseProp(newVal, []);
	}

	/** Parseo de los members */
	@Watch('membersList') membersListChange(newVal: ICDKVdrListLiterals[] | string) {
		this._membersList = _parseProp(newVal, []);
	}

	@State() _literals: ICDKVdrCardLiterals;
	@State() _ownersList: ICDKVdrListLiterals[];
	@State() _membersList: ICDKVdrListLiterals[];
	@State() _parentHeight: string;
	@State() _showTooltip: string;
	@State() _parentHeight2: string;
	@State() _showTooltip2: string;

	@State() _resizeView: number = window.innerWidth;
	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this._resizeView = window.innerWidth;
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.ownersListChange(this.ownersList);
		this.membersListChange(this.membersList);
		this.closedChange(this.closed);
	}

	/** Life cycle executed after the first Render after loading */
	componentDidLoad() {}

	/** Life cycle by removing the instance of the component */
	disconnectedCallback() {}

	showTooltip(check, id) {
		switch (id) {
			case 'members':
				if (check) {
					this._parentHeight = this.$parentEl?.clientHeight + 'px';
					this.$vdrCardParent.style.zIndex = '2';
					this._showTooltip = 'block';
				} else {
					this._showTooltip = 'none';
					this.$vdrCardParent.style.zIndex = '1';
				}
				break;
			case 'owners':
				if (check) {
					this._parentHeight2 = this.$parentEl?.clientHeight + 'px';
					this.$vdrCardParent.style.zIndex = '2';
					this._showTooltip2 = 'block';
				} else {
					this._showTooltip2 = 'none';
					this.$vdrCardParent.style.zIndex = '1';
				}
				break;
			default:
				break;
		}
	}

	render() {
		return this.showSkeleton ? (
			<div class="cdk-vdr-card__skeleton">
				<div class="cdk-vdr-card__skeleton-container">
					<CDKVdrCardSkeleton />
					<div class="cdk-vdr-card__skeleton-shine" />
				</div>
			</div>
		) : (
			<a class="cdk-vdr-card cdk-vdr-card__link" href={this._literals.urlVdr} title={this._literals.tooltipVdr} ref={el => (this.$vdrCardParent = el as HTMLElement)}>
				<article class={{ 'cdk-vdr-card__article': true, 'cdk-vdr-card__article--closed': this._closed }}>
					<div class="cdk-vdr-card__title-container">
						{this._literals.criticality && (
							<span style={{ 'background-color': this._literals.criticality.color }} class="cdk-vdr-card__title--criticality" innerHTML={this._literals.criticality.title}></span>
						)}
						<div class={{ 'cdk-vdr-card__title': true, 'cdk-vdr-card__title--closed': this._closed }} innerHTML={this._literals.mainTitle}></div>
						<scib-ui-button nobackground icon="icon-chrevron-right" hide-txt small></scib-ui-button>
					</div>
					<div class="cdk-vdr-card__desc" innerHTML={this._literals.description}></div>
					<footer class={{ 'cdk-vdr-card__footer': true, 'cdk-vdr-card__footer--reorder': this._literals.state !== null }}>
						{this._literals.state ? (
							<div class="cdk-vdr-card__info">
								<div class="cdk-vdr-card__date" innerHTML={this._literals.date}></div>
								<div class="cdk-vdr-card__state">
									<span role="icon" style={{ 'background-color': this._literals.state.color }}></span>
									<span innerHTML={this._literals.state.title}></span>
								</div>
							</div>
						) : (
							<div class="cdk-vdr-card__date" innerHTML={this._literals.date}></div>
						)}
						<div class="cdk-vdr-card__audience">
							<div
								class="cdk-vdr-card__avatar-group"
								ref={el => (this.$parentEl2 = el as HTMLElement)}
								onMouseEnter={() => this.showTooltip(true, 'owners')}
								onMouseLeave={() => this.showTooltip(false, 'owners')}
							>
								<div class="cdk-vdr-card__group">
									<div class="cdk-vdr-card__label" innerHTML={this._literals.owners}></div>
									<ul class={{ 'cdk-vdr-card__list': true, 'cdk-vdr-card__list--one-item': this._ownersList.length === 1 }}>
										{this._ownersList.slice(0, this._resizeView > 767 ? 3 : 1).map(owners => (
											<li class="cdk-vdr-card__item">
												{owners.imgSrc ? (
													<figure class={{ 'cdk-vdr-card__avatar': true, 'cdk-vdr-card__avatar--employees': owners.isEmployees }}>
														<img
															class="cdk-vdr-card__img"
															src={owners.imgSrc}
															alt={owners.imgAlt}
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
															'cdk-vdr-card__avatar': true,
															'cdk-vdr-card__avatar--fallback': true,
															'cdk-vdr-card__avatar--employees': owners.isEmployees,
															'cdk-vdr-card__avatar--no-avatar': !owners.imgSrc,
														}}
													>
														<span class="cdk-vdr-card__no-avatar">
															{owners.imgAlt
																? owners.imgAlt.slice(0, 1).toUpperCase() + '' + owners.imgAlt.split(' ')[1].slice(0, 1).toUpperCase()
																: owners.name.slice(0, 1).toUpperCase() + '' + owners.name.split(' ')[1].slice(0, 1).toUpperCase()}
														</span>
													</figure>
												)}
											</li>
										))}
									</ul>
								</div>
								{this._resizeView > 767 ? (
									this._ownersList.length >= 4 ? (
										<div class="cdk-vdr-card__counter cdk-vdr-card__counter--mrgr" innerHTML={`<span>+ ${this._ownersList.length - 3}</span>`}></div>
									) : (
										''
									)
								) : this._ownersList.length >= 2 ? (
									<div class="cdk-vdr-card__counter cdk-vdr-card__counter--mrgr" innerHTML={`<span>+ ${this._ownersList.length - 1}</span>`}></div>
								) : (
									''
								)}
							</div>
							{this._membersList?.length > 0 ? (
								<div
									class="cdk-vdr-card__avatar-group"
									ref={el => (this.$parentEl = el as HTMLElement)}
									onMouseEnter={() => this.showTooltip(true, 'members')}
									onMouseLeave={() => this.showTooltip(false, 'members')}
								>
									<div class="cdk-vdr-card__group">
										<div class="cdk-vdr-card__label" innerHTML={this._literals.members}></div>
										<ul class={{ 'cdk-vdr-card__list': true, 'cdk-vdr-card__list--one-item': this._membersList.length === 1 }}>
											{this._membersList.slice(0, this._resizeView > 767 ? 3 : 1).map(members => (
												<li class="cdk-vdr-card__item">
													{members.imgSrc ? (
														<figure class={{ 'cdk-vdr-card__avatar': true, 'cdk-vdr-card__avatar--employees': members.isEmployees }}>
															<img
																class="cdk-vdr-card__img"
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
																'cdk-vdr-card__avatar': true,
																'cdk-vdr-card__avatar--fallback': true,
																'cdk-vdr-card__avatar--employees': members.isEmployees,
																'cdk-vdr-card__avatar--no-avatar': !members.imgSrc,
															}}
														>
															<span class="cdk-vdr-card__no-avatar">
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
									{this._resizeView > 767 ? (
										this._membersList.length >= 4 ? (
											<div class="cdk-vdr-card__counter" innerHTML={`<span>+ ${this._membersList.length - 3}</span>`}></div>
										) : (
											''
										)
									) : this._membersList.length >= 2 ? (
										<div class="cdk-vdr-card__counter" innerHTML={`<span>+ ${this._membersList.length - 1}</span>`}></div>
									) : (
										''
									)}
								</div>
							) : (
								''
							)}
						</div>
					</footer>
				</article>
			</a>
		);
	}
}
