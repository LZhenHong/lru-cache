class Node<K, V> {
    constructor(
        public key: K,
        public value: V,
        public prev: Node<K, V> | null = null,
        public next: Node<K, V> | null = null
    ) { }
}

export default class LRUCache<K, V> {
    private readonly cache = new Map<K, Node<K, V>>();
    private readonly head: Node<K, V>;
    private readonly tail: Node<K, V>;

    get size(): number {
        return this.cache.size;
    }

    constructor(readonly capacity: number) {
        this.head = new Node(null as any, null as any);
        this.tail = new Node(null as any, null as any);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    private addToHead(node: Node<K, V>) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next!.prev = node;
        this.head.next = node;
    }

    private removeNode(node: Node<K, V>) {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    private moveToHead(node: Node<K, V>) {
        this.removeNode(node);
        this.addToHead(node);
    }

    private removeTail(): Node<K, V> | null {
        const last = this.tail.prev;
        if (last === this.head) {
            return null; // Empty list
        }
        this.removeNode(last!);
        return last;
    }

    set(key: K, value: V) {
        if (this.capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
        }

        const existing = this.cache.get(key);

        if (existing) {
            // Update existing node
            existing.value = value;
            this.moveToHead(existing);
            return;
        }

        // Create new node
        const node = new Node(key, value);
        this.cache.set(key, node);
        this.addToHead(node);

        // Check capacity limit
        if (this.size > this.capacity) {
            const tail = this.removeTail();
            if (tail) {
                this.cache.delete(tail.key);
            }
        }
    }

    get(key: K): V | undefined {
        const node = this.cache.get(key);
        if (node) {
            this.moveToHead(node);
            return node.value;
        }
        return undefined;
    }

    remove(key: K): V | undefined {
        const node = this.cache.get(key);
        if (node) {
            this.cache.delete(key);
            this.removeNode(node);
            return node.value;
        }
        return undefined;
    }

    removeAll() {
        this.cache.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    trimTo(size: number) {
        if (size < 0) return;

        while (this.size > size) {
            const tail = this.removeTail();
            if (tail) {
                this.cache.delete(tail.key);
            }
        }
    }
}
