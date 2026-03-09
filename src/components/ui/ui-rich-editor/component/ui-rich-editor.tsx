import { Component, Host, h, Prop, EventEmitter, Event, Method, Listen } from '@stencil/core';
import Quill from 'quill';

/**
 * Component description
 *
 * @slot attached-bar - Attached bar content
 */
@Component({
	tag: 'scib-ui-rich-editor',
	styleUrl: 'ui-rich-editor.scss',
	shadow: false,
	scoped: false,
})
export class UIRichEditor {
	$editorRef!: HTMLElement;
	$toolbarRef!: HTMLElement;

	_quill: any;

	@Prop({ reflect: true }) newTextValue: string;

	/** Valor del campo. @readonly */
	@Prop({ reflect: true, mutable: true }) value: string;

	/** Etiqueta del campo (no se visualiza, solo para accesibilidad). */
	@Prop({ reflect: true }) label: string = 'text';

	/** Etiqueta del placeholder */
	@Prop({ reflect: true }) placeholder: string;

	/** Name */
	@Prop({ reflect: true }) name: string = 'no-named-rich-editor';

	/** Toolbar id */
	@Prop({ reflect: true }) toolbarId: string = 'toolbar';

	@Prop() smallScreen: boolean;

	/** Evento emitido al cambiar el valor */
	@Event() eventChange: EventEmitter<string>;

	/*Boolean to activate multiselect listing in mobile query*/
	@Prop({ reflect: false }) isMobile: boolean;

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.multiselectResponsive();
	}

	private multiselectResponsive() {
		if (window.innerWidth < 1024) {
			this.isMobile = true;
		} else {
			this.isMobile = false;
		}
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

	_toolbarOptions: { [key: string]: any }[] = [
		['bold', 'italic', 'underline', 'strike'],
		[{ color: [] }, { background: [] }],
		[{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
	];

	componentDidLoad() {
		this._quill = new Quill(this.$editorRef, {
			placeholder: this.placeholder,
			modules: {
				toolbar: '#toolbar' + this.toolbarId,
			},
			theme: 'snow',
		});

		// Desactiva el tabulador en el editor
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
		this._setInputValue();
	}

	private _setInputValue(): void {
		if (this.newTextValue && this.newTextValue.length > 0) {
			const text = this._quill.clipboard.convert(this.newTextValue);
			this._quill.setContents(text, 'silent');
		}
	}

	render() {
		return (
			<Host class={{ 'c-ui-rich-editor': true, 'c-ui-rich-editor--small-screen': this.smallScreen }}>
				<label class="c-ui-rich-editor__label" htmlFor={this.name}>
					{this.label}
				</label>
				<input class="c-ui-rich-editor__input" type="text" value={this.value} name={this.name} />
				<div class="c-ui-rich-editor__attached">
					<slot name="attached-bar" />
				</div>
				<div id={'toolbar' + this.toolbarId} class="toolbar">
					<span class="ql-formats span">
						<select class="ql-size">
							<option selected></option>
							<option value="small"></option>
							<option value="large"></option>
							<option value="huge"></option>
						</select>
					</span>

					<span class="ql-formats span">
						<button class="ql-bold"></button>
						<button class="ql-italic"></button>
						<button class="ql-underline"></button>
						<button class="ql-strike"></button>
					</span>

					<span class="ql-formats span">
						<select class="ql-color"></select>
						<select class="ql-background"></select>
					</span>

					<span class="ql-formats span">
						<button class="ql-list" value="ordered"></button>
						<button class="ql-list" value="bullet"></button>
						<select class="ql-align">
							<option selected></option>
							<option value="center"></option>
							<option value="right"></option>
							<option value="justify"></option>
						</select>
					</span>

					<span class="ql-formats span">
						<slot name="c-sendbar-footer" />
					</span>
				</div>
				<div class="u-rich-text" aria-hidden="true" ref={el => (this.$editorRef = el as HTMLElement)}></div>
			</Host>
		);
	}
}
