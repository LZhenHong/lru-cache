# LRU Cache

A fast, type-safe LRU (Least Recently Used) cache implementation in TypeScript.

## Why This Exists

You need a cache that automatically evicts old data when it gets full. This implementation uses a doubly-linked list with hash map for O(1) operations on all cache methods.

## Installation

```bash
npm install ts-lru-cache
```

## Usage

```typescript
import LRUCache from 'ts-lru-cache';

// Create a cache with capacity of 100 items
const cache = new LRUCache<string, number>(100);

// Basic operations
cache.set('key1', 42);
cache.set('key2', 84);

const value = cache.get('key1'); // 42
const removed = cache.remove('key2'); // 84

// Check size
console.log(cache.size); // 1

// Clear all
cache.removeAll();

// Trim to specific size
cache.trimTo(50); // Keep only 50 most recent items
```

## API

### Constructor

- `new LRUCache<K, V>(capacity: number)` - Create cache with specified capacity

### Methods

- `set(key: K, value: V): void` - Add/update item (moves to front)
- `get(key: K): V | undefined` - Get item (moves to front if found)
- `remove(key: K): V | undefined` - Remove item, returns value if existed
- `removeAll(): void` - Clear all items
- `trimTo(size: number): void` - Remove oldest items to reach target size
- `size: number` - Current number of items

## Performance

- **Set**: O(1)
- **Get**: O(1) 
- **Remove**: O(1)
- **Memory**: O(capacity)

All operations are constant time thanks to the hash map + doubly-linked list design.

## License

MIT
