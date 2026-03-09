import { FunctionalComponent, h } from '@stencil/core';
import { IconFormat, IDocumentPreviewFile } from '../models/document-preview.model';

export const MoleculesDocumentPreviewPillContent: FunctionalComponent<{
	file: IDocumentPreviewFile;
}> = ({ file }: { file: IDocumentPreviewFile }) => {
	const icon: { [key: string]: string } = IconFormat;

	return [
		<div class="preview-icon">
			<span
				class="u-icon"
				style={{
					'--icon-content': !icon[file.extension] ? `var(--theme-scib-icon-filepage)` : `var(--theme-scib-${icon[file.extension]})`
				}}
			>
				<i class="icon" />
			</span>
			<span
				class="preview-icon-extension"
				style={{
					display: file.extension && !icon[file.extension] ? 'block' : 'none'
				}}
			>
				{file.extension}
			</span>
		</div>,
		<div class="preview-icon-textcontent">
			<p class="preview-icon-textcontent__title">{file.name}</p>
			<p
				class={{
					'preview-icon-textcontent__subtitle': true,
					'--error': Boolean(file.error)
				}}
			>
				{typeof file.error === 'string' ? file.error : file.formatedSize ? file.formatedSize : file.size}
			</p>
		</div>
	];
};
