import {createContext, useContext} from 'react';
import {NodesView} from '../nodeMap/useNodeMap.js';
import {ViewState} from '../window/types.js';
import {SetState} from '../utility/types.js';

export type ListItemContext<T extends any[] | readonly any[] = any> = {
	items: T;
	setItems: SetState<T>;
	control: ViewState['_control'];
	// Focus extends up the focus tree to the root node
	isFocus: boolean;
	// Focus based only on whatever focus given by the List component containing this list item
	isShallowFocus: boolean;
	index: number;
};

export type PageContext = {
	control: ViewState['_control'];
	// Focus extends up the focus tree to the root node
	isFocus: boolean;
	// Focus based only on whatever focus given by the Pages component containing this page
	isShallowFocus: boolean;
	index: number;
};

export type WindowContext = {
	isFocus: boolean;
};

export type NodeContext<T extends string = string> = {
	name: T;
	isFocus: boolean;
	isShallowFocus: boolean;
	control: NodesView<T>['_control'];
};

export const ListItemContext = createContext<ListItemContext | null>(null);
export const PageContext = createContext<PageContext | null>(null);
export const WindowContext = createContext<WindowContext | null>(null);
export const NodeContext = createContext<NodeContext | null>(null);

// If no Context exists, this is the root node and therefore focus is true.
// Otherwise, focus is dependent on the Context value.
export function useWindowFocus(): boolean {
	const windowContext = useContext(WindowContext);
	if (windowContext === null) return true;
	return windowContext.isFocus;
}
export function usePageFocus(): boolean {
	const pageContext = useContext(PageContext);
	if (pageContext === null) return true;
	return pageContext.isFocus;
}
export function useItemFocus(): boolean {
	const listItemContext = useContext(ListItemContext);
	if (listItemContext === null) return true;
	return listItemContext.isFocus;
}
export function useNodeFocus(): boolean {
	const nodeContext = useContext(NodeContext);
	if (nodeContext === null) return true;
	return nodeContext.isFocus;
}
// Combine focus of all the above
export function useIsFocus(): boolean {
	const itemFocus = useItemFocus();
	const pageFocus = usePageFocus();
	const windowFocus = useWindowFocus(); // Don't think this is necessary
	const nodeFocus = useNodeFocus();
	return itemFocus && pageFocus && windowFocus && nodeFocus;
}

// prettier-ignore
const errMsg = (h: string, cmp: string) => `Attemping to use ${h} hook outside the context of a ${cmp} component.`;

export function useListItem<
	T extends any[] | readonly any[] = any,
>(): ListItemContext<T> & {
	item: T[number];
} {
	const listItemContext = useContext(ListItemContext);

	if (listItemContext === null) {
		throw new Error(errMsg('useListItem', 'List'));
	}

	const items = listItemContext.items;
	const setItems = listItemContext.setItems;
	const index = listItemContext.index;
	const control = listItemContext.control;
	const isFocus = listItemContext.isFocus;
	const isShallowFocus = listItemContext.isShallowFocus;
	const item = items[index];

	return {items, setItems, index, isFocus, isShallowFocus, item, control};
}

export function usePage(): PageContext {
	const pageContext = useContext(PageContext);

	if (pageContext === null) {
		throw new Error(errMsg('usePage', 'Pages'));
	}

	return pageContext;
}

export function useNode<T extends string = string>(): NodeContext<T> {
	const nodeContext = useContext(NodeContext);
	if (nodeContext === null) {
		throw new Error(errMsg('useNavNode', 'Nav.Node'));
	}
	return nodeContext as NodeContext<T>;
}
