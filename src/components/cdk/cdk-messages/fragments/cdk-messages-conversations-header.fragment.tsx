import { FunctionalComponent, h } from '@stencil/core';
import { ICDKMessagesMailboxes } from '../models/cdk-messages.model';

export const CDKMessagesConversationsHeader: FunctionalComponent<{
	title: string;
	subtitle: string;
	notifications?: any;
	searchPlaceholderTxt: string;
	addButton?: boolean;
	searchInputDefault?: string;
	tabs?: string;
	mailBoxes: ICDKMessagesMailboxes[];
	activeMailBox?: string;
	selectedMailBox?: string;
	activeTab?: string;
	collapsed?: boolean;
	onNewClick: (event: CustomEvent<any>) => void;
	onCloseClick: (event: CustomEvent<any>) => void;
	onSearchBy: (event: CustomEvent<any>) => void;
	onTapChange: (event: CustomEvent<any>) => void;
}> = props => {
	const appMailboxSelected = props.selectedMailBox === 'apps' || props.activeMailBox === 'apps';
	return (
		<div class={{ 'c-conversations-header-wrapper': true, '--collapsed': props.collapsed, '--no-padding': appMailboxSelected }}>
			<div class="c-conversations-header-top">
				{/* Tap bar element */}
				<scib-ui-tapbar
					// action-menu-show
					taps={props.mailBoxes}
					onEventTapChange={props.onTapChange}
					activeTap={props.activeMailBox}
				></scib-ui-tapbar>
			</div>
			<div class="c-conversations-header-container-actions">
				{/* Search Bar */}
				<div class={{ 'c-conversations-header-searchbar': true, 'c-conversations-header-searchbar--adjust': !props.addButton }}>
					<scib-ui-input
						communication-search
						placeholder={props.searchPlaceholderTxt || '[[searchPlaceholderTxt]]'}
						search-input
						debounceTime={450}
						onEventChange={props.onSearchBy}
						no-min-height
						value={props.searchInputDefault || ''}
					></scib-ui-input>
				</div>
				{/* Button container */}
				<div class="c-conversations-header-buttons">
					{props.addButton ? (
						<scib-ui-button primary communication-new icon="icon-add" hide-txt onEventClick={props.onNewClick}>
							Add
						</scib-ui-button>
					) : null}
				</div>
			</div>
			{appMailboxSelected && (
				<div class="c-conversations-header-mailbox">
					<scib-ui-tabnav
						small
						maximize-tab
						active-tab={props.activeTab}
						tabs={props.tabs}
						onEventTabChange={props.onTapChange}
					></scib-ui-tabnav>
				</div>
			)}
		</div>
	);
};
