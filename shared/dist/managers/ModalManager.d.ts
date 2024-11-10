import type { View } from '../View';
import type { Viewport } from '../Viewport';
import type { Screen } from '../Screen';
import type { Rect } from '../geometry';
export declare class ModalManager {
    #private;
    reset(): void;
    requestModal(parent: View, modal: View, onClose: () => void, rect: Rect): boolean;
    renderModals(screen: Screen, viewport: Viewport): View;
}
