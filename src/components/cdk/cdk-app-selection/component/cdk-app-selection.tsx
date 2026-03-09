import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { CDKAppSelectionArray } from '../models/cdk-app-selection.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-app-selection',
	styleUrl: 'cdk-app-selection.scss',
	shadow: false,
	scoped: true,
})
export class CDKAppSelection {
	@Prop({ reflect: true }) name: any;
	/** Lista apps */
	@Prop({ mutable: true, reflect: true }) apps: any;

	@Watch('apps') parseApps(newApps: string | Array<any>) {
		if (newApps) {
			try {
				if (typeof newApps === 'string') {
					newApps = JSON.parse(newApps);
				} // first time
				this._apps = [...newApps];
				this._appsTotal = this._apps.filter(item => item.select).length;
				let auxNoSelectedApps = this._apps.filter(item => !item.select);
				this._appsNoSelected = new CDKAppSelectionArray(auxNoSelectedApps);
			} catch (e) {
				console.error(e);
			}
		}
	}

	@State() _apps: Array<any>;

	/** Total de las apps seleccionadas */
	@State() _appsTotal: number;

	/** Total de las apps no seleccionadas */
	@State() _appsNoSelected: CDKAppSelectionArray;

	/** Evento emitido al cambiar el valor para formulario */
	@Event() eventFormChange: EventEmitter;
	/** Evento emitido al cambiar el valor del checkbox */
	@Event() eventCheckChange: EventEmitter;

	@Event() eventFormInputhange: EventEmitter;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) literals: string;

	@Watch('literals') parseLiterals(newLiterals: string) {
		if (newLiterals) {
			try {
				this._literals = JSON.parse(newLiterals);
			} catch (e) {}
		}
	}

	@State() _literals: { [key: string]: any };

	/** Escucha la seleccion del input */
	_handleInputChange(event) {
		let app;
		this._apps.find(item => {
			if (item.id === parseInt(event.detail)) {
				item.select = true;
				app = item;
			}
		});
		this.apps = [...this._apps];
		this.emitFormChange();
		this.emitCheckboxChange(app);
	}

	/** Escucha el estado de los checkbox */
	_handleCheckbox(ev, id) {
		let app;
		this._apps.forEach(item => {
			if (item.id === parseInt(id)) {
				item.select = ev.detail;
				app = item;
			}
		});
		this.apps = [...this._apps];
		this.emitFormChange();
		this.emitCheckboxChange(app);
	}

	/** Emitir el listado de las apps */
	emitFormChange() {
		this.eventFormChange.emit(this.apps.filter(item => item.select));
	}

	emitFormInputChange(event) {
		this.debounce(this.filterApps(event), 500);
	}

	filterApps(event) {
		let auxNoSelectedApps = this._apps.filter(item => !item.select);
		let auxApps = auxNoSelectedApps.filter(app => {
			return app.name.toLowerCase().includes(event.detail.toLowerCase());
		});
		this._appsNoSelected = new CDKAppSelectionArray(auxApps);
	}

	debounce(callback, wait) {
		let timeout;
		return (...args) => {
			const context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => callback.apply(context, args), wait);
		};
	}

	/** Emitir la app checkeada */
	emitCheckboxChange(app) {
		this.eventCheckChange.emit(app);
	}

	/*
	--------------------------------------------------------------------------------------
	-------------------------------  LIFECYCLE METHODS  ----------------------------------
	--------------------------------------------------------------------------------------
	*/

	/** 1 First lifecycle method - BEFORE RENDER */
	connectedCallback() {}

	/** 2 Second lifecycle method - BEFORE RENDER */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseApps(this.apps);
	}

	/** 3 Third lifecycle method - BEFORE RENDER */
	componentWillRender() {}

	/** 5 Fifth lifecycle method, AFTER RENDER */
	componentDidRender() {}

	/** 6 Fifth lifecycle method, AFTER RENDER */
	componentDidLoad() {}

	/** 7 Sixth lifecycle method, AFTER RENDER (after WATCH and PROP states changed) */
	componentShouldUpdate() {}

	/** 8 Seventh lifecycle method, AFTER RENDER (after WATCH and PROP states changed) */
	componentWillUpdate() {}

	/** 9 LAST lifecycle method, BEFORE DESTROY INSTANCE */
	disconnectedCallback() {}

	/** 4 Fourth lifecycle method */
	render() {
		return (
			<Host>
				<div class="cdk-app-selection">
					<scib-ui-input
						autocomplete
						options={JSON.stringify(this._appsNoSelected)}
						label={this.name}
						placeholder="Select applications"
						multiselect={false}
						automatic-open={false}
						onEventInputChange={evento => this._handleInputChange(evento)}
						onEventChange={event => this.emitFormInputChange(event)}
					></scib-ui-input>
					{this._apps.map(item => (
						<div class="cdk-app-selection__checkbox" style={{ display: item.select ? 'block' : 'none' }}>
							<scib-ui-checkbox
								checked={item.select}
								idCheck={item.id}
								name={item.name}
								label={item.name}
								onCheckboxChange={() => this._handleCheckbox(event, item.id)}
							></scib-ui-checkbox>
						</div>
					))}
					<p>Selected: {this._appsTotal} applications </p>
				</div>
			</Host>
		);
	}
}
