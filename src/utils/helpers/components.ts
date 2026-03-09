export class CoreUtils {
	protected _root: HTMLElement;

	constructor(private _hostRef: HTMLElement) {}

	connectedCallback() {
		this._root = (this._hostRef as any).shadowRoot;
	}
}
