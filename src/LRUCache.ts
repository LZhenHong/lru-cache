class LinkListNode<K, V> {
    constructor(
        readonly key: K,
        public value: V,
        public prev: LinkListNode<K, V> | null = null,
        public next: LinkListNode<K, V> | null = null
    ) { }
}

class LinkList<K, V> {
    private head: LinkListNode<K, V> | null = null;
    private tail: LinkListNode<K, V> | null = null;

    insertNodeAtHead(node: LinkListNode<K, V>) {
        if (!node || node === this.head) {
            return;
        }

        if (this.head) {
            node.next = this.head;
            node.prev = null;

            this.head.prev = node;
            this.head = node;
        } else {
            this.head = this.tail = node;
        }
    }

    bringNodeToHead(node: LinkListNode<K, V>) {
        if (!node || node === this.head) {
            return;
        }
        this.removeNode(node);
        this.insertNodeAtHead(node);
    }

    removeNode(node: LinkListNode<K, V>) {
        if (!node) {
            return;
        }

        node.prev ? node.prev.next = node.next : this.head = node.next;
        node.next ? node.next.prev = node.prev : this.tail = node.prev;
    }

    removeTailNode(): LinkListNode<K, V> | null {
        if (!this.tail) {
            return null;
        }

        const tail = this.tail;
        this.removeNode(tail);
        return tail;
    }

    removeAll() {
        this.head = this.tail = null;
    }
}

export default class LRUCache<K, V> {
    private list: LinkList<K, V> = new LinkList();
    private cache: Map<K, LinkListNode<K, V>> = new Map();

    get size(): number {
        return this.cache.size;
    }

    constructor(readonly capacity: number) { }

    set(key: K, value: V) {
        if (this.capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
        }

        let node = this.cache.get(key);
        if (node) {
            if (value === null || value === undefined) {
                this.list.removeNode(node);
            } else {
                node.value = value;
                this.list.bringNodeToHead(node);
            }
        } else {
            node = new LinkListNode(key, value);
            this.cache.set(key, node);
            this.list.insertNodeAtHead(node);
        }

        while (this.size > this.capacity) {
            const tail = this.list.removeTailNode();
            tail && this.cache.delete(tail.key);
        }
    }

    get(key: K): V | undefined {
        const node = this.cache.get(key);
        if (node) {
            this.list.bringNodeToHead(node);
            return node.value;
        }
        return undefined;
    }

    remove(key: K): V | undefined {
        const node = this.cache.get(key);
        if (node) {
            this.cache.delete(key);
            this.list.removeNode(node);
            return node.value;
        }
        return undefined;
    }

    removeAll() {
        this.cache.clear();
        this.list.removeAll();
    }

    trimTo(size: number) {
        if (size < 0) {
            return;
        }
        while (this.size > size) {
            const tail = this.list.removeTailNode();
            tail && this.cache.delete(tail.key);
        }
    }
}
