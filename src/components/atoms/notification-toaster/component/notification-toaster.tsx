import { Component, Host, h, Element, Prop, Watch, State, EventEmitter, Event } from '@stencil/core';
import { parseProp } from '../../../../utils/helpers/common';
import { NotificationToaster, ToasterTypeEnum } from '../models/notification-toaster.model';
import { AtomsNotificationToasterNotificationCard } from '../fragments/notification-toaster-notification-card.fragment';
import { AtomsNotificationToasterMessageCard } from '../fragments/notification-toaster-message-card.fragment';

/**
 * Component description
 *
 * @status stable
 */
@Component({
	tag: 'scib-atoms-notification-toaster',
	styleUrl: 'notification-toaster.scss',
	shadow: true
})
export class AtomsNotificationToaster {
	@Element() _hostRef: HTMLElement;

	/**
	 * Footer text.
	 */
	@Prop() footerText: string;

	/**
	 * Open state for toaster.
	 */
	@Prop() open: boolean;
	@State() _openStatus: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		this._toggleToaster(!!newValue);
	}

	/**
	 * Notifications array to display.
	 */
	@Prop() itemList: string | NotificationToaster[];
	@State() $itemList: NotificationToaster[];
	@Watch('itemList') _itemListHandler(newValue: string | NotificationToaster[]) {
		this.$itemList = parseProp<NotificationToaster[]>(newValue || []);
	}

	/**
	 * Event of footer click.
	 */
	@Event() footerClick: EventEmitter<void>;

	/**
	 * Event of notification card click, return notification id.
	 */
	@Event() notificationClicked: EventEmitter<number>;

	/**
	 * Event of notification card closed icon click, return notification id.
	 */
	@Event() notificationClosed: EventEmitter<number>;

	componentWillLoad() {
		this._itemListHandler(this.itemList);
		this._openHandler(this.open);
	}

	componentDidLoad() {
		this._toggleToaster(this.open);
	}

	/**
	 * Toggle open state of toaster.
	 */
	private _toggleToaster(status: boolean) {
		this._openStatus = status;
	}

	render() {
		return (
			<Host>
				<div class={{ toaster__container: true, toaster__closed: !this._openStatus }}>
					<div class="arrow"></div>
					<div class="toaster-box">
						<div id="toaster-content">
							{this.$itemList?.map((item, index) => (
								<div>
									{item.type === ToasterTypeEnum.NOTIFICATION ? (
										<AtomsNotificationToasterNotificationCard
											name={item.title}
											description={item.content}
											app={item.app}
											close={() => {
												this.notificationClosed.emit(item.id);
											}}
											redirect={() => {
												this.notificationClicked.emit(item.id);
											}}
										></AtomsNotificationToasterNotificationCard>
									) : (
										<AtomsNotificationToasterMessageCard
											title={item.title}
											description={item.content}
											user={item.users?.from?.name}
											messageType={item.app}
											avatar={item.users?.avatar}
											close={() => {
												this.notificationClosed.emit(item.id);
											}}
											redirect={() => {
												this.notificationClicked.emit(item.id);
											}}
										></AtomsNotificationToasterMessageCard>
									)}

									{index !== this.$itemList?.length - 1 ? (
										<div class="divider-container">
											<div class="divider"></div>
										</div>
									) : (
										''
									)}
								</div>
							))}
						</div>
						<div class="footer" onClick={() => this.footerClick.emit()}>
							<span class="footer-text">{this.footerText}</span>
							{/* <span class="footer__item-container" style={{ '--icon-content': `var(--theme-scib-icon-settings)` }}>
								<i class="icon footer__icon" />
							</span> */}
						</div>
						<div class="footer-border"></div>
					</div>
				</div>
			</Host>
		);
	}
}
