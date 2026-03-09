import { EventEmitter, FunctionalComponent, h } from '@stencil/core';
import { IDocumentPreviewFile, ILiterals } from '../models/document-preview.model';
import { MoleculesDocumentPreviewFileContent } from './document-preview-file-content.fragment';

export const MoleculesDocumentPreviewStandardVariant: FunctionalComponent<{
	files: IDocumentPreviewFile[];
	userAction: EventEmitter;
	collapseLimit: number;
	accordionCollapsed: boolean;
	literals: ILiterals;
}> = ({ files, userAction, collapseLimit, accordionCollapsed, literals }) => {
	return (
		<scib-ui-v2-scroll-container>
			<div class="document-preview-container">
				{files &&
					files.slice(0, collapseLimit === 0 ? files.length : collapseLimit).map((file, index) => (
						<scib-ui-v2-card class="card-container" cardId="aaa" type="elevated">
							<MoleculesDocumentPreviewFileContent
								file={file}
								userAction={userAction}
								index={index}
							></MoleculesDocumentPreviewFileContent>
						</scib-ui-v2-card>
					))}
				{files && files.length > collapseLimit && collapseLimit > 0 && (
					<scib-atoms-accordion>
						<div slot="header" class="accordion-header">
							{accordionCollapsed ? (
								<span>
									{literals?.showMoreFiles} ({files.length - collapseLimit})
								</span>
							) : (
								<span>{literals?.showLessFiles}</span>
							)}
						</div>
						<div slot="content" class="accordion-content fit-content-cards">
							{files.slice(collapseLimit).map((file, index) => (
								<scib-ui-v2-card class="card-container" cardId="aaa" type="elevated">
									<MoleculesDocumentPreviewFileContent
										file={file}
										userAction={userAction}
										index={index + collapseLimit}
									></MoleculesDocumentPreviewFileContent>
								</scib-ui-v2-card>
							))}
						</div>
					</scib-atoms-accordion>
				)}
			</div>
		</scib-ui-v2-scroll-container>
	);
};
