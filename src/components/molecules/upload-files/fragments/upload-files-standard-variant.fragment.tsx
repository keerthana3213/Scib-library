import { FunctionalComponent, h } from '@stencil/core';
import { ILiterals } from '../models/upload-files.model';
import { MoleculesUploadFilesErrorsContent } from './upload-files-errors-content.fragment';
import { MoleculesUploadFilesInputFile } from './upload-files-input-file.fragment';

export const MoleculesUploadFilesStandardVariant: FunctionalComponent<{
	maxFileLimit: boolean;
	errorFile: boolean;
	duplicatedFilename: boolean;
	errorSize: boolean;
	literals: ILiterals;
	handleClick: () => {};
	showUploadFiles: boolean;
	filesArray: any[];
	idelement: string;
	acceptedTypeFiles: string;
	onSelectFile: Function;
	name: string;
	highlighted: boolean;
	disabled: boolean;
}> = ({
	maxFileLimit,
	errorFile,
	duplicatedFilename,
	errorSize,
	literals,
	handleClick,
	showUploadFiles,
	filesArray,
	idelement,
	acceptedTypeFiles,
	onSelectFile,
	name,
	highlighted,
	disabled
}) => {
	return (
		<scib-ui-column colLg={showUploadFiles && filesArray?.length > 0 ? 3 : 6}>
			{literals?.labelSelector !== '' && (
				<div class="c-label sc-scib-ui-dropdown">
					<span class="sc-scib-ui-dropdown">{literals?.labelSelector}</span>
				</div>
			)}
			<section
				class={{
					'upload-files': true,
					'upload-files--disabled': disabled
				}}
			>
				<div
					class={{
						'upload-files__draggdrop': true,
						'upload-files__draggdrop--drop': highlighted,
						'upload-files__draggdrop--disabled': disabled
					}}
					onClick={() => handleClick()}
				>
					{/* <span
						class={{
							'upload-files__action': true,
							'upload-files__action--disabled': disabled
						}}
					>
						<i class="icon" />
					</span> */}
					<scib-atoms-color-icon
						class={{
							'upload-files__action': true,
							'upload-files__action--disabled': disabled
						}}
						name="attach-document"
					></scib-atoms-color-icon>
					<MoleculesUploadFilesInputFile
						idelement={idelement}
						acceptedTypeFiles={acceptedTypeFiles}
						onSelectFile={onSelectFile}
						name={name}
						disabled={disabled}
					></MoleculesUploadFilesInputFile>
					<span
						class={{
							'upload-files__txt': true,
							'upload-files__txt--drop': highlighted,
							'upload-files__txt--disabled': disabled
						}}
					>
						<div>{literals?.titleselector}</div>
					</span>
				</div>
				<MoleculesUploadFilesErrorsContent
					maxFileLimit={maxFileLimit}
					errorFile={errorFile}
					duplicatedFilename={duplicatedFilename}
					errorSize={errorSize}
					literals={literals}
					styleVariant={'standard'}
					disabled={disabled}
				></MoleculesUploadFilesErrorsContent>
			</section>
		</scib-ui-column>
	);
};
