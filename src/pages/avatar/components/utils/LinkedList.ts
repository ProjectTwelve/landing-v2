export class Node<T> {
    public next: Node<T> | null = null;
    public value: T | null = null;
    constructor (value: T | null) {
        this.value = value;
    }
}

export class LinkedList<T> {
    sentry: Node<T> = new Node<T>(null);
    tail: Node<T> | null = null;

    constructor() {
        this.sentry = new Node<T>(null);
        this.tail = this.sentry; 
    }

    add(value: T) {
        const newNode: Node<T> = new Node(value);
        this.tail!.next = newNode;
        this.tail = newNode;
    }

    forEach(interator: (node: Node<T>, prevNode: Node<T>, index: number) => void) {
        let currentNode: Node<T> | null = this.sentry.next!
        let prevNode = this.sentry;
        let nextNode: Node<T> | null = this.sentry;
        let index = 0;
        for(;currentNode !== null;currentNode = nextNode) {
            nextNode = currentNode.next;
            interator(currentNode, prevNode, index);
            prevNode = currentNode;
            index += 1;
        }
    }
}