import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { ILiterals, CardData } from '../models/cdk-ism-contact-list.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ism-contact-list',
	styleUrl: 'cdk-ism-contact-list.scss',
	shadow: false,
	scoped: true
})
export class CDKIsmContactList {
	/** Oculta el contenido del slot */
	@Prop({ reflect: true }) hide: boolean;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	@Prop({ reflect: true }) cardData: CardData[] | string;
	@State() _cardData: CardData[];
	@Watch('cardData') parseCardData(newCardData: CardData[] | string) {
		this._cardData = _parseProp<CardData[]>(newCardData as string);
	}

	@Prop({ reflect: true }) hasPermission: boolean;
	@State() _hasPermission: boolean;
	@Watch('hasPermission') parseHasPermission(newPermission: boolean) {
		this._hasPermission = _parseProp<boolean>(newPermission as boolean);
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseCardData(this.cardData);
		this.parseHasPermission(this.hasPermission);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	/** Default values no contact list **/
	@State() imgDefault = assetUrl('assets/images/generic-character.svg');
	@State() altDefault = 'There are not contact list';
	@State() textDefault = 'There are no relevant contacts at this moment';

	private noContactList(): any {
		const img = (this._literals.noContact && this._literals.noContact.img) || this.imgDefault;
		const alt = (this._literals.noContact && this._literals.noContact.alt) || this.altDefault;
		const text = (this._literals.noContact && this._literals.noContact.text) || this.textDefault;
		return (
			<div class="card" style={{ padding: '0' }}>
				<figure class="no-contact-figure">
					<img src={img} alt={alt} />
				</figure>
				<span class="no-contact-span">{text}</span>
			</div>
		);
	}

	private sendData(idBtn, card): any {
		let data: string = '';

		if (idBtn === 'share') {
			if (card.cardInfo.fullName.search(',')) {
				card.cardInfo.fullName = card.cardInfo.fullName.split(',').join(' ');
			}
			data = `{
				"body": "defaultBody,${card.cardInfo.fullName !== '-' ? card.cardInfo.fullName + ',' : ''}${
				card.extraInfo.position !== '-' ? card.extraInfo.position : ''
			} ${card.extraInfo.department !== '-' && card.extraInfo.position !== '-' ? ' | ' : ','} ${
				card.extraInfo.department !== '-' ? card.extraInfo.department + ',' : ''
			}${card.cardInfo.phone !== '-' ? card.cardInfo.phone + ',' : ''}${card.cardInfo.email !== '-' ? card.cardInfo.email + ',' : ''}",
				"disableEdit": true,
				"type": "ism"
			}`;
		} else {
			data = `{
				"toUser": {
					"id": "${card.cardInfo.id}",
					"email": "${card.cardInfo.email}",
					"name": "${card.cardInfo.fullName}",
					"isSelected": true,
					"avatar": {
						"src": "${card.img.src}",
						"alt": "avatar ${card.img.alt}"
					}
				},
				"subject": "",
				"disableEdit": true,
				"type": "ism"
			}`;
		}
		this.eventChange.emit(data);
	}

	private contactList(): any {
		return this._cardData.map((card: CardData) => (
			<div class="card card--item">
				<div class="section">
					<scib-ui-avatar images={[{ src: card.img.src, alt: card.img.alt }]}></scib-ui-avatar>
					<p class="contact-info">
						<span>{card.cardInfo.fullName}</span>
						<div>
							{card.cardInfo.showTag ? <span class="contact-info__tag">{card.cardInfo.tagText}</span> : ''}
							<span>{card.cardInfo.role}</span>
						</div>
					</p>
				</div>
				<div class="section section--space">
					<p class="user-contact__email">
						<span>{card.cardInfo.email}</span>
					</p>
					<div class="user-contact__phone">
						<span>{card.cardInfo.phone}</span>
						{this.hasPermission && (
							<div class="card-icons">
								<button
									class="u-icon icon-share-24"
									title="Share contact"
									onClick={() => {
										this.sendData('share', card);
									}}
								></button>
								<button
									class="u-icon icon-message"
									title="Send message to"
									onClick={() => {
										this.sendData('sendTo', card);
									}}
								></button>
							</div>
						)}
					</div>
				</div>
			</div>
		));
	}

	render() {
		return (
			<Host>
				<div class="cdk-ism-contact-list">{this._cardData && this._cardData.length > 0 ? this.contactList() : this.noContactList()}</div>
			</Host>
		);
	}
}
