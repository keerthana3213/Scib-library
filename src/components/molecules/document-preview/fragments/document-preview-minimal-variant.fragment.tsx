import { EventEmitter, FunctionalComponent, h } from '@stencil/core';
import { IDocumentPreviewFile } from '../models/document-preview.model';
import { MoleculesDocumentPreviewFileContent } from './document-preview-file-content.fragment';

export const MoleculesDocumentPreviewMinimalVariant: FunctionalComponent<{
	files: IDocumentPreviewFile[];
	userAction: EventEmitter;
}> = ({ files, userAction }) => {
	return (
		files &&
		files.map((file, index) => (
			<MoleculesDocumentPreviewFileContent file={file} userAction={userAction} index={index}></MoleculesDocumentPreviewFileContent>
		))
	);
};
