import { EventEmitter, FunctionalComponent, h } from '@stencil/core';
import { IDocumentPreviewFile } from '../models/document-preview.model';
import { MoleculesDocumentPreviewPillContent } from './document-preview-pill-content.fragment';

export const MoleculesDocumentPreviewFileContent: FunctionalComponent<{
	file: IDocumentPreviewFile;
	userAction: EventEmitter;
	index: number;
}> = ({ file, index, userAction }) => {
	return (
		<li
			class={{
				'preview-body-content-list__item': true,
				'--center': file.downloable
			}}
		>
			<span class="content-item-download">
				<MoleculesDocumentPreviewPillContent file={file} />
				{file.downloable && (
					<button
						class="content-button-download"
						type="button"
						onClick={(ev) => {
							file.indexInFileList = index;
							userAction.emit({
								actionType: 'download',
								data: file
							});
							ev.stopPropagation();
						}}
					>
						<div class="content-button-download__action">
							<i class="icon" />
						</div>
					</button>
				)}
				{!!!file.disableRemoveFile && (
					<button
						class="content-item-action"
						type="button"
						style={{
							'--icon-content': file.error ? `var(--theme-scib-icon-retry)` : `var(--theme-scib-icon-close)`
						}}
						onClick={(e) => {
							file.indexInFileList = index;
							userAction.emit({
								actionType: file.error ? 'retry' : 'cancel',
								data: file
							});
							e.stopPropagation();
						}}
					>
						<i class="icon action__icon" />
					</button>
				)}
			</span>
		</li>
	);
};
