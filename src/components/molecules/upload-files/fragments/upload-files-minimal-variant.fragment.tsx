import { FunctionalComponent, h } from '@stencil/core';
import { ILiterals } from '../models/upload-files.model';
import { MoleculesUploadFilesInputFile } from './upload-files-input-file.fragment';

export const MoleculesUploadFilesMinimalVariant: FunctionalComponent<{
	literals: ILiterals;
	handleClick: () => {};
	idelement: string;
	acceptedTypeFiles: string;
	onSelectFile: Function;
	name: string;
	disabled: boolean;
}> = ({ literals, handleClick, idelement, acceptedTypeFiles, onSelectFile, name, disabled }) => {
	return (
		<scib-ui-column colLg={1.5}>
			<scib-atoms-button
				text={literals?.buttonText || 'Add File'}
				icon={literals?.icon || 'add_files'}
				size="s"
				level="tertiary"
				icon-position="trailing"
				type="button"
				onClick={() => handleClick()}
				disabled={disabled}
			>
				<MoleculesUploadFilesInputFile
					idelement={idelement}
					acceptedTypeFiles={acceptedTypeFiles}
					onSelectFile={onSelectFile}
					name={name}
					disabled={disabled}
				></MoleculesUploadFilesInputFile>
			</scib-atoms-button>
		</scib-ui-column>
	);
};
