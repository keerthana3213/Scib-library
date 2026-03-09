import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKAddElement } from '../models/cdk-add-element.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-add-element',
	styleUrl: 'cdk-add-element.scss',
	shadow: false,
	scoped: false,
})
export class CDKAddElement {
	/**Data */
	@Prop({ reflect: true }) data: ICDKAddElement[] | string;

	@Watch('data') dataChange(newVal: ICDKAddElement[] | string) {
		this._data = _parseProp(newVal);
	}

	@State() _data: ICDKAddElement[];

	/**Exist a section */
	@Prop({ mutable: true, reflect: false }) section: number;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.dataChange(this.data);
	}

	/** Add element event */
	@Event() addElementEvent: EventEmitter;
	/**Add open modal event */
	@Event() eventOpenModal: EventEmitter;

	/**
	 * Open modal add element to pitch
	 * @param e Event
	 * @param title
	 */
	handleClick(e, title) {
		e.preventDefault();
		this.addElementEvent.emit(title);
	}

	/**
	 * Open modal gif
	 * @param e Event
	 * @param title
	 */
	openModal(e) {
		e.preventDefault();
		this.eventOpenModal.emit(e);
	}

	render() {
		return (
			<Host>
				{' '}
				<div class="cdk-add-element">
					{this._data &&
						this._data.map(item => (
							<div class="cdk-add-element__item">
								{this.section == 0 && (
									<figure class="cdk-add-element__image">
										<img class="cdk-add-element__img" src={item.image} alt={item.imageAlt} />
									</figure>
								)}
								<div class="cdk-add-element__group">
									<div class="element-group__top">
										<h2 class="cdk-add-element__title" innerHTML={item.title}></h2>
										{this.section != 0 && (
											<scib-ui-button
												class="cdk-add-element__addBtn"
												primary
												disable-min-width
												small
												hideTxt
												icon="icon-add"
												onClick={e => this.handleClick(e, item.title)}
											></scib-ui-button>
										)}
									</div>
									<div class="element-group__bottom">
										<p class="cdk-add-element__description" innerHTML={item.description}></p>
										{item.subtitle ? (
											<button class="cdk-add-element__subtitle cdk-add-element__info" onClick={e => this.openModal(e)}>
												<i class="u-icon c-icon icon-info"></i>
												<span>{item.subtitle}</span>
											</button>
										) : null}
									</div>
									{this.section == 0 && (
										<scib-ui-button
											style={{ margin: '16px auto' }}
											class="cdk-add-element__addBtn"
											primary
											disable-min-width
											small
											hideTxt
											icon="icon-add"
											onClick={e => this.handleClick(e, item.title)}
										></scib-ui-button>
									)}
								</div>
							</div>
						))}
				</div>
			</Host>
		);
	}
}
