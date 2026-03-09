import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Method } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/ui-rich-editor-mobile.model';
import Quill from 'quill';
/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-rich-editor-mobile',
	styleUrl: 'ui-rich-editor-mobile.scss',
	shadow: false,
	scoped: false,
})
export class UIRichEditorMobile {
	_quill: any;
	$editorRef!: HTMLElement;

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

	/** Valor del campo. @readonly */
	@Prop({ reflect: true, mutable: true }) value: string;

	/** Etiqueta del campo (no se visualiza, solo para accesibilidad). */
	@Prop({ reflect: true }) label: string = 'text';

	/** Etiqueta del placeholder */
	@Prop({ reflect: true }) placeholder: string;

	/** Para hacer absolute la barra en el New Message*/
	@Prop({ reflect: true }) isAbsolute?: boolean = false;

	/** Name */
	@Prop({ reflect: true }) name: string = 'no-named-rich-editor';

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this._quill = new Quill(this.$editorRef, {
			modules: {
				toolbar: false,
			},
			placeholder: this.placeholder,
			theme: 'snow',
		});

		delete this._quill.getModule('keyboard').bindings['9'];
		this._quill.on('text-change', () => {
			const content = (this.$editorRef.firstChild as HTMLElement).innerHTML;
			if (this.$editorRef.scrollTop + (this.$editorRef.clientHeight + 40) >= this.$editorRef.scrollHeight) {
				this.$editorRef.scrollTop = this.$editorRef.scrollHeight;
			}
			this.value = content || '';
			if (this.value) {
				this.eventChange.emit(this.value);
			}
		});
	}

	@Method()
	async setValue(newValue: string) {
		if (newValue === 'undefined') {
			newValue = '';
		}
		let data = newValue.split(',');
		if (data[0] === 'defaultBody') {
			let defaultMessage = [];
			data.forEach((elem, index) => {
				if (index > 0) {
					if (index === 1) {
						let obj = { insert: elem, attributes: { bold: true, color: '#EC0000' } };
						defaultMessage.push(obj);
						defaultMessage.push({ insert: '\n' });
					} else {
						defaultMessage.push({ insert: elem });
						defaultMessage.push({ insert: '\n' });
					}
				}
			});
			this._quill.setContents(defaultMessage, 'api');
			const content = (this.$editorRef.firstChild as HTMLElement).innerHTML;
			this.value = content;
			this.eventChange.emit(this.value);
		} else {
			const delta = this._quill.clipboard.convert(newValue);
			this._quill.setContents(delta, 'api');
			this.value = '';
		}
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host>
				<div class={{ 'container-mobile': true, '--absolute': this.isAbsolute }}>
					<div class="bar">
						<slot name="add-button" />

						<div class="input_bar">
							<div class="u-rich-text" aria-hidden="true" ref={el => (this.$editorRef = el as HTMLElement)}></div>
							<input class="u-rich-text" name={this.name} value={this.value} aria-hidden="true" hidden></input>
							<div class="u-rich-attached">
								<slot name="attached-bar" />
							</div>
						</div>

						<slot name="send-button" />
					</div>
				</div>
			</Host>
		);
	}
}
