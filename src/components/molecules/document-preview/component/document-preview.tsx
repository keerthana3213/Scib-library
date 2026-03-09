import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { StyleVariant } from '../../../../shared/models';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { MoleculesDocumentPreviewMinimalVariant } from '../fragments/document-preview-minimal-variant.fragment';
import { MoleculesDocumentPreviewStandardVariant } from '../fragments/document-preview-standard-variant.fragment';
import { IDocumentPreviewFile, ILiterals, LayoutMode } from '../models/document-preview.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-molecules-document-preview',
	styleUrl: 'document-preview.scss',
	shadow: true
})
export class MoleculesDocumentPreview {
	private _contentElement!: HTMLElement;

	/**
	 *
	 */
	@Prop() styleVariant: StyleVariant = 'standard';

	/**
	 * The document list will be collapsed in an accordion starting from document number 'collapseLimit'.
	 * If 0, it won't collapse
	 */
	@Prop() collapseLimit: number = 0;

	/**
	 * Controls the layout mode of the cards
	 * - rows: Cards will flow in rows (one after another, default)
	 * - columns: Cards will be displayed in two columns
	 */
	@Prop() layoutMode: LayoutMode = 'columns';

	/**
	 *
	 */
	@Prop() literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') listenLiteralsChanges(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) files: IDocumentPreviewFile[] | string;
	@State() _files: IDocumentPreviewFile[];
	@Watch('files') listenFilesChanges(newFiles: IDocumentPreviewFile[] | string) {
		this._files = _parseProp(newFiles);
		requestAnimationFrame(() => this.scrollAttachedDocs());
		if (newFiles?.length <= this.collapseLimit) {
			this._accordionCollapsed = true;
		}
	}

	/**
	 * Listen accordion open/close event to show the right literal
	 */
	@Listen('eventAccordionChange', { target: 'body' })
	public handleAccordion(event: CustomEvent<boolean>) {
		this._accordionCollapsed = event.detail;
	}

	/**
	 *
	 */
	@State() _accordionCollapsed: boolean = true;

	/**
	 * Evento de acción del Usuario
	 */
	@Event() userAction: EventEmitter;

	/**
	 *
	 */
	componentWillLoad() {
		this._files = _parseProp(this.files);
		this.listenLiteralsChanges(this.literals);
	}

	/**
	 *
	 */
	scrollAttachedDocs() {
		if (this._contentElement) {
			this._contentElement.scrollTop = this._contentElement.clientHeight;
		}
	}

	/**
	 *
	 */
	renderByStyleVariant() {
		let content;
		switch (this.styleVariant) {
			case 'minimal':
				content = (
					<MoleculesDocumentPreviewMinimalVariant files={this._files} userAction={this.userAction}></MoleculesDocumentPreviewMinimalVariant>
				);
				break;
			default:
				content = (
					<MoleculesDocumentPreviewStandardVariant
						files={this._files}
						userAction={this.userAction}
						collapseLimit={this.collapseLimit}
						literals={this._literals}
						accordionCollapsed={this._accordionCollapsed}
					></MoleculesDocumentPreviewStandardVariant>
				);
				break;
		}
		return content;
	}

	render() {
		return (
			<Host style={{ display: this._files?.length > 0 ? 'block' : 'none' }}>
				{this._files && (
					<div class="preview-container">
						<div class="preview-header">
							<slot name="title" />
						</div>
						<div class="preview-body">
							<div class="preview-body-content" ref={(el) => (this._contentElement = el as HTMLElement)}>
								<div class={{ 'preview-body-content-list': true, '--columns': this.layoutMode === 'columns' }}>
									{this.renderByStyleVariant()}
								</div>
							</div>
						</div>
					</div>
				)}
			</Host>
		);
	}
}
