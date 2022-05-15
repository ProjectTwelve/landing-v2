class Node<T> {
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
        this.tail!.next = new Node(value);
        this.tail!.next = this.tail;
    }

    forEach(interator: (node: Node<T>, prevNode: Node<T>, index: number) => void) {
        let currentNode = this.sentry.next!
        let prevNode = this.sentry;
        let index = 0;
        for(;currentNode.next != null;currentNode = currentNode.next!) {
            interator(currentNode, prevNode, index);
            prevNode = currentNode;
        }
        index += 1;
    }
}