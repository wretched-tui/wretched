import type { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import { Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
import { System } from '../System';
type Choices<T> = [string, T][];
interface SharedProps<T> extends ViewProps {
    choices: Choices<T>;
    title?: string;
}
type SelectMultipleFn<T> = (value: T[]) => void;
type SelectOneFn<T> = (value: T) => void;
interface SelectMultiple<T> {
    selected: readonly T[];
    onSelect?: SelectMultipleFn<T>;
}
interface SelectOne<T> {
    selected?: T;
    onSelect?: SelectOneFn<T>;
}
type Props<T, M extends boolean | undefined> = SharedProps<T> & (M extends true ? SelectMultiple<T> : SelectOne<T>);
type ConstructorProps<T, M extends boolean | undefined> = Props<T, M> & {
    multiple?: M;
};
export declare class Dropdown<T, M extends boolean> extends View {
    #private;
    dropdownSelector: DropdownSelector<T>;
    constructor({ multiple, ...props }: ConstructorProps<T, M>);
    update(props: Props<T, M>): void;
    get choices(): Choices<T>;
    set choices(choices: Choices<T>);
    dismissModal(): void;
    get selected(): M extends true ? () => T[] : T | undefined;
    set selected(selected: M extends true ? T[] : T | undefined);
    naturalSize(): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
interface SelectorProps<T> extends SharedProps<T> {
    onSelect(): void;
    selected: number[];
    multiple: boolean;
}
declare class DropdownSelector<T> extends Container {
    #private;
    constructor({ choices, selected, multiple, onSelect, ...viewProps }: SelectorProps<T>);
    get selectedRows(): number[];
    set selectedRows(rows: number[]);
    get selectedText(): string[] | undefined;
    get selectedValue(): T | undefined;
    get selectedValues(): T[];
    get choices(): [string, T][];
    /**
     * Sets new choices, preserving the previously selected items.
     */
    set choices(choices: SharedProps<T>['choices']);
    cellForItem(choice: T, row: number): View;
    render(viewport: Viewport): void;
}
export {};
