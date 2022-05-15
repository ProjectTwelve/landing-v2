export function getMousePos(eventMouse: MouseEvent, target: HTMLCanvasElement) {
    var rect = target.getBoundingClientRect();
    return {
        x: (eventMouse.clientX - rect.left) / (rect.right - rect.left) * target.width,
        y: (eventMouse.clientY - rect.top) / (rect.bottom - rect.top) * target.height
    };
}