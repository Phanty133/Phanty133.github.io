export const getFirstElementWithProperty = (initial: Element, property: string, value: string): HTMLElement => {
	let parent = initial.parentElement;

	while(parent.getAttribute(property) !== value && parent !== document.body){
		
		parent = parent.parentElement;
	}

	return (parent === document.body ? null : parent);
}
