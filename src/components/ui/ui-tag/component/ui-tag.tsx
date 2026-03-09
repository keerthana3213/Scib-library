import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-tag',
	styleUrl: 'ui-tag.scss',
	shadow: false,
	scoped: true,
})
export class UITag {
	/** Id for filter tag component */
	@Prop({ mutable: true }) filterId: string | number;

	/** Text inside tag component */
	@Prop({ mutable: true }) text: string;

	// Functional props and specifics styles //

	/** Indicate clickable on tag component */
	@Prop({ mutable: true }) clickable: boolean = false;

	/** Indicate min width on tag component */
	@Prop({ mutable: true }) minWidth: boolean = false;

	/** Indicate large style (LG) on tag component */
	@Prop({ mutable: true }) large: boolean = false;

	/** Indicate samll style (SM) on tag component */
	@Prop({ mutable: true }) small: boolean = false;

	// Theme styles props //

	/** Apply closed style on tag component */
	@Prop({ mutable: true }) closed: boolean = false;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		if (this.filterId) {
			this.filterId = this.filterId.toString();
		}
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	clickOnTag(event) {
		if (this.clickable) {
			this.eventClick.emit({
				filterId: this.filterId,
				filterText: this.text,
			});
		}
		event.preventDefault();
		return false;
	}

	/** Descripción del evento */
	@Event() eventClick: EventEmitter;

	render() {
		return (
			<Host>
				<a
					href="#"
					class={{
						'ui-tag': true,
						'ui-tag--clickable': this.clickable,
						'ui-tag--min-w': this.minWidth,
						'ui-tag--lg': this.large,
						'ui-tag--sm': this.small,
						'ui-tag--closed': this.closed,
					}}
					onClick={e => this.clickOnTag(e)}
				>
					<span class="ui-tag__text">{this.text}</span>
				</a>
			</Host>
		);
	}
}
