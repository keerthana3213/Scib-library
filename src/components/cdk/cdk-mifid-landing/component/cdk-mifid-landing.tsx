import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-mifid-landing',
	styleUrl: 'cdk-mifid-landing.scss',
	shadow: false,
	scoped: false
})
export class CDKMifidLanding {
	$rowElement: HTMLElement;

	@Prop() reportImageSrc: string;

	@Prop() hideData: boolean = false;

	@Prop() literals: string | any;
	@Watch('literals') parseLiterals(newLiterals: string | any) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: any;

	@Prop() data: string | any;
	@Watch('data') parseData(newData: string | any) {
		this._data = _parseProp(newData);
	}
	@State() _data: any;

	@Prop() srcVideo: string | any;
	@Watch('srcVideo') parseSrcVideo(newData: string | any) {
		this._srcVideo = _parseProp(newData);
	}
	@State() _srcVideo: any;

	@Prop() exploreLinks: string | any;
	@Watch('exploreLinks') parseExploreLinks(newData: string | any) {
		this._exploreLinks = _parseProp(newData);
	}
	@State() _exploreLinks: any;

	@Prop() communicationData: string | any;
	@Watch('communicationData') parseCommunicationData(newData: string | any) {
		this._communicationData = _parseProp(newData);
	}
	@State() _communicationData: any;

	@Prop() contactData: string | any;
	@Watch('contactData') parseContactData(newData: string | any) {
		this._contactData = _parseProp(newData);
	}
	@State() _contactData: any;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseSrcVideo(this.srcVideo);
		this.parseData(this.data);
		this.parseExploreLinks(this.exploreLinks);
		this.parseCommunicationData(this.communicationData);
		this.parseContactData(this.contactData);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this._equalHeight();
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this._equalHeight();
	}

	_equalHeight() {
		let maxHeight = 0;
		const rows = document.getElementsByClassName('ui-card-article');
		for (let index = 0; index < rows.length; index++) {
			const rowElement = rows[index] as HTMLElement;
			rowElement.style.height = '100%';
			if (rowElement.clientHeight > maxHeight) {
				maxHeight = rowElement.clientHeight;
			}
		}
		for (let index = 0; index < rows.length; index++) {
			const rowElement = rows[index] as HTMLElement;
			rowElement.style.height = maxHeight + 'px';
		}
	}

	_handleUserAction(eventId) {
		this.userAction.emit(eventId);
	}

	@Listen('eventOnCardClick') _handleCardClick(event) {
		if (event.detail === 'mifid-resume') {
			this.reportCardClick.emit();
		}
	}

	/** Reports card on click event */
	@Event() reportCardClick: EventEmitter;

	/** Reports card on click event */
	@Event() userAction: EventEmitter;

	render() {
		return (
			<Host>
				<div class="cdk-mifid-landing">
					<scib-ui-row ref={(el) => (this.$rowElement = el as HTMLElement)}>
						<scib-ui-column col-lg="2" col-md="3">
							<scib-ui-card card-id="mifid-resume" disable-hover={false}>
								<div class="cdk-mifid-landing__title-container">
									<h3 class="cdk-mifid-landing__title">{this._literals.mainTitle1}</h3>
									<scib-ui-button
										class="cdk-mifid-landing__icon"
										nobackground
										icon="icon-chrevron-right"
										onEventClick={() => this.reportCardClick.emit()}
										hide-txt
										small
									></scib-ui-button>
								</div>
								<div class="cdk-mifid-landing__report">
									<div class="cdk-mifid-landing__report-content">
										<div class="cdk-mifid-landing__report-data">
											<div class="cdk-mifid-landing__frame">
												<figure class="cdk-mifid-landing__report-figure">
													<img
														src={this.reportImageSrc ? this.reportImageSrc : assetUrl('/assets/images/i-files-stats.svg')}
														alt="Mifid Report"
													/>
												</figure>
											</div>
											<div class="cdk-mifid-landing__data">
												<div class="cdk-mifid-landing__data-row">
													<span class="cdk-mifid-landing__text cdk-mifid-landing__text--bold">
														{this._literals.reportTitle}
													</span>
													<span class="cdk-mifid-landing__text cdk-mifid-landing__text--bold">
														{this._literals.reportSubtitle}
													</span>
												</div>
												{!this.hideData && (
													<div class="cdk-mifid-landing__data-row cdk-mifid-landing__data-row--alt">
														<span class="cdk-mifid-landing__text cdk-mifid-landing__text--secondary">
															{this._literals.lastReportLabel} {this._data?.lastReportDate}
														</span>
													</div>
												)}
												{!this.hideData && (
													<div class="cdk-mifid-landing__total-report">
														<scib-ui-button
															class="cdk-mifid-landing__report-icon"
															nobackground
															icon="icon-filepage"
															hide-txt
															small
														></scib-ui-button>
														<span class="cdk-mifid-landing__text cdk-mifid-landing__text--headline">
															{this._literals.totalReportLabel + ' '}
															<span class="cdk-mifid-landing__text cdk-mifid-landing__text--bold">
																{this._data?.totalReportData}
															</span>
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
									<div
										class="cdk-mifid-landing__contact"
										onClick={(event) => {
											event.stopImmediatePropagation();
											return false;
										}}
									>
										<figure class="cdk-mifid-landing__contact-figure">
											<img
												src={
													this._contactData.image ? this._contactData.image : assetUrl('/assets/images/i-contact-email.svg')
												}
												alt=""
											/>
										</figure>
										<div class="cdk-mifid-landing__contact-content">
											<span class="cdk-mifid-landing__contact-title">{this._contactData.title}</span>
											<span class="cdk-mifid-landing__contact-desc">{this._contactData.description}</span>
											<a class="cdk-mifid-landing__contact-email" href={'mailto:' + this._contactData.email}>
												{this._contactData.email}
											</a>
										</div>
									</div>
								</div>
							</scib-ui-card>
						</scib-ui-column>
						<scib-ui-column col-lg="2" col-md="3">
							<scib-ui-card card-id="discover-landing" disable-hover={true}>
								<div class="cdk-mifid-landing__title-container">
									<h3 class="cdk-mifid-landing__title">{this._literals.mainTitle2}</h3>
								</div>
								<div class="cdk-mifid-landing__discover">
									<div class="cdk-mifid-landing__video">
										<video controls={true} loop={false} autoplay={false} muted={false}>
											{this._srcVideo.map((video) => (
												<source src={video.src} type={'video/' + video.type}></source>
											))}
											{/* <img src={this.imgSrc} alt={this.imgAlt} /> */}
										</video>
									</div>
									<div class="cdk-mifid-landing__discover-txt-container">
										<span class="cdk-mifid-landing__discover-txt">
											{this._literals.discoverText1 + ' '}
											<span class="cdk-mifid-landing__discover-txt--bold cdk-mifid-landing__discover-txt--nowrap">
												{this._literals.discoverTextBold}
											</span>
											.
										</span>
										<span class="cdk-mifid-landing__discover-txt cdk-mifid-landing__discover-txt--bold">
											{this._literals.discoverText2}
										</span>
									</div>
								</div>
							</scib-ui-card>
						</scib-ui-column>
						<scib-ui-column col-lg="2" col-md="3">
							<scib-ui-card card-id="explore-landing" disable-hover={true}>
								<div class="cdk-mifid-landing__title-container">
									<h3 class="cdk-mifid-landing__title">{this._literals.mainTitle3}</h3>
								</div>
								<div class="cdk-mifid-landing__explore">
									<div class="cdk-mifid-landing__explore-cards">
										{this._exploreLinks.map((exploreLink, index) => (
											<a
												class="cdk-mifid-landing__explore-card-link"
												href="javascript:void(0)"
												onClick={() => {
													this._handleUserAction(exploreLink.eventId);
												}}
											>
												<div class="cdk-mifid-landing__explore-card">
													<div class="cdk-mifid-landing__explore-card-content">
														<figure class="cdk-mifid-landing__explore-card-figure">
															<img
																src={
																	exploreLink.image
																		? exploreLink.image
																		: index === 0
																		? assetUrl('/assets/images/i-man-check-phone.svg')
																		: assetUrl('/assets/images/i-file-color-dot.svg')
																}
																alt=""
															/>
														</figure>
														<div>
															<span class="cdk-mifid-landing__explore-card-title">{exploreLink.name}</span>
															<span class="cdk-mifid-landing__explore-card-desc">{exploreLink.description}</span>
														</div>
													</div>
												</div>
											</a>
										))}
									</div>
									<div class="cdk-mifid-landing__explore-communication">
										<figure class="cdk-mifid-landing__explore-comm-figure">
											<img
												src={
													this._communicationData.image
														? this._communicationData.image
														: assetUrl('/assets/images/i-chat-messages.svg')
												}
												alt=""
											/>
										</figure>
										<div class="cdk-mifid-landing__explore-comm-content">
											<span class="cdk-mifid-landing__explore-comm-title">{this._communicationData.title}</span>
											<span class="cdk-mifid-landing__explore-comm-desc">{this._communicationData.description}</span>
											<scib-ui-button
												link
												icon="icon-chrevron-right"
												onEventClick={() => this._handleUserAction(this._communicationData.eventId)}
												ultrasmall
											>
												{this._communicationData.btnText}
											</scib-ui-button>
										</div>
									</div>
								</div>
							</scib-ui-card>
						</scib-ui-column>
					</scib-ui-row>
				</div>
			</Host>
		);
	}
}
