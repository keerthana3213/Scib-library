import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKLinkDataTooltip, ICDKListMembersTooltip, ICDKLiteralsTooltip } from '../models/cdk-members-tooltip.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-members-tooltip',
	styleUrl: 'cdk-members-tooltip.scss',
	shadow: false,
	scoped: true,
})
export class CDKMembersTooltip {
	$memberTooltip: HTMLElement;

	/** Recoge el alto del elemento padre, donde se va a colocar el tooltip */
	@Prop({ mutable: true, reflect: true }) parentHeight: string;

	/** Indica si se muestra el tooltip */
	@Prop({ mutable: true, reflect: true }) show: string;

	/** Indica la posición del tooltip */
	@Prop({ mutable: true, reflect: true }) positionX: string;

	/** Indica la posición del tooltip */
	@Prop({ mutable: true, reflect: true }) positionY: string;

	/** Listado de miembros */
	@Prop({ mutable: true, reflect: true }) linkData: string | ICDKLinkDataTooltip;
	@Watch('linkData') parseLinkData(newVal: string | ICDKLinkDataTooltip) {
		this._linkData = _parseProp(newVal);
	}

	/** Listado de miembros */
	@Prop({ mutable: true, reflect: true }) members: string | ICDKListMembersTooltip[];
	@Watch('members') parseMembers(newVal: string | ICDKListMembersTooltip[]) {
		this._members = _parseProp(newVal);
	}

	@Prop({ reflect: true }) readByTooltip?: boolean;
	@Prop({ reflect: true }) isMobile?: boolean;

	@Prop() literals: ICDKLiteralsTooltip;
	@Watch('literals') parseLiterals(newLiterals: ICDKLiteralsTooltip) {
		try {
			this._literals = newLiterals;
		} catch (e) {
			console.error(e);
		}
	}
	@State() _literals: ICDKLiteralsTooltip;

	@State() _members: ICDKListMembersTooltip[];
	@State() _linkData: ICDKLinkDataTooltip;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseMembers(this.members);
		this.parseLinkData(this.linkData);
	}

	cancelEventPropagation(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	/** Event when click see all members link */
	@Event() eventClickLinkTooltip: EventEmitter;
	@Event() eventTooltipClose: EventEmitter;

	countRead(members: ICDKListMembersTooltip[]): number {
		let count: number = 0;
		members.forEach(element => {
			if (element.readDate) {
				count++;
			}
		});
		return count;
	}

	sliceMembers(members: ICDKListMembersTooltip[]): ICDKListMembersTooltip[] {
		if (this.readByTooltip) {
			return members;
		} else {
			return members.slice(0, 8);
		}
	}

	render() {
		return (
			<Host>
				<div
					class={{ 'c-members-container': true, ['--' + this.positionX]: true, ['--' + this.positionY]: true }}
					ref={el => (this.$memberTooltip = el as HTMLElement)}
					onClick={e => this.cancelEventPropagation(e)}
					style={{ display: this.show, [this.positionY]: this.parentHeight }}
				>
					<div class={{ 'c-members-tooltip': true, ['--' + this.positionX]: true, ['--' + this.positionY]: true, '--read-by-tooltip': this.readByTooltip }}>
						{this.readByTooltip ? (
							<div class="c-tooltip-read-title">
								{this.isMobile ? (
									<span>
										<i class="u-icon c-icon icon-chrevron-right" onClick={() => this.eventTooltipClose.emit()}></i>
									</span>
								) : null}
								<span>
									<p>
										{this._literals.titleTxt || 'Message read by'} {this.countRead(this._members)}/{this._members.length} {this._literals.membersTxt || 'members'}
									</p>
								</span>
							</div>
						) : null}
						<ul class={{ 'c-members-list': true }}>
							{this.sliceMembers(this._members).map((member, index) => {
								if (!this.readByTooltip && index >= 7 && this._linkData) {
									return (
										<a
											class="c-members-list__link"
											href="javascript:void(0)"
											onClick={e => {
												this.eventClickLinkTooltip.emit(this._linkData.eventName);
												e.stopPropagation();
											}}
										>
											{this._linkData.literal}
										</a>
									);
								} else {
									return (
										<li class={{ 'c-tooltip-member': true }}>
											<div>
												{member.imgSrc ? (
													<figure
														class={{
															'c-tooltip-avatar': true,
															'--employees': member.isEmployees,
														}}
													>
														<img
															class="c-tooltip-img"
															src={member.imgSrc}
															alt={member.imgAlt}
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
															'c-tooltip-avatar': true,
															'--fallback': true,
															'--employees': member.isEmployees,
															'--no-avatar': !member.imgSrc,
														}}
													>
														<span class="c-tooltip-no-avatar">
															{member.imgAlt
																? member.imgAlt.slice(0, 1).toUpperCase() + '' + member.imgAlt.split(' ')[1].slice(0, 1).toUpperCase()
																: member.name.slice(0, 1).toUpperCase() + '' + member.name.split(' ')[1].slice(0, 1).toUpperCase()}
														</span>
													</figure>
												)}
												<span class="c-tooltip-name-and-read-date">
													<span class="c-tooltip-name">{member.name}</span>
													{this.readByTooltip ? (
														member.readDate ? (
															<span class="c-tooltip-read-date">{member.readDate}</span>
														) : (
															<span class="c-tooltip-read-date">{this._literals.unreadTxt || 'unread'}</span>
														)
													) : null}
												</span>
											</div>
										</li>
									);
								}
							})}
						</ul>
					</div>
				</div>
			</Host>
		);
	}
}
