import LRUCache from "../src/LRUCache";

describe("LRUCache", () => {
    let cache: LRUCache<string, number>;

    beforeEach(() => {
        cache = new LRUCache(2);
    });

    it("should create a brand-new LRUCache", () => {
        expect(cache).not.toBeNull();
        expect(cache).toBeInstanceOf(LRUCache);
    });

    it("should have a capacity of 2", () => {
        expect(cache.capacity).toBe(2);
    });

    it("should throw error when capacity is 0", () => {
        cache = new LRUCache(0);
        expect(() => cache.set("a", 1))
            .toThrow();
    });

    it("should throw error when capacity is negative", () => {
        cache = new LRUCache(-1);
        expect(() => cache.set("a", 1))
            .toThrow("Capacity must be greater than 0");

        cache = new LRUCache(-100);
        expect(() => cache.set("b", 2))
            .toThrow("Capacity must be greater than 0");
    });

    it("should handle capacity of 1 correctly", () => {
        cache = new LRUCache(1);

        cache.set("a", 1);
        expect(cache.get("a")).toBe(1);
        expect(cache.size).toBe(1);

        cache.set("b", 2);
        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("b")).toBe(2);
        expect(cache.size).toBe(1);
    });

    it("should handle large capacity values", () => {
        const largeCache = new LRUCache<string, number>(1000);

        for (let i = 0; i < 500; i++) {
            largeCache.set(`key${i}`, i);
        }

        expect(largeCache.size).toBe(500);
        expect(largeCache.get("key0")).toBe(0);
        expect(largeCache.get("key499")).toBe(499);
    });

    it("should get undefined for non-existent keys", () => {
        expect(cache.get("a")).toBeUndefined();
    });

    it("should set and get values correctly", () => {
        cache.set("a", 1);
        cache.set("b", 0);

        expect(cache.get("a")).toBe(1);
        expect(cache.get("b")).toBe(0);

        cache.set("a", 3);
        expect(cache.get("a")).toBe(3);
    });

    it("should handle repeated operations on same key", () => {
        // Repeated setting of same key should update value and move to head
        cache.set("a", 1);
        cache.set("b", 2);

        // Repeated setting of 'a' should update value
        cache.set("a", 10);
        expect(cache.get("a")).toBe(10);
        expect(cache.size).toBe(2);

        // Adding third element, 'b' should be evicted (since 'a' was moved to head)
        cache.set("c", 3);
        expect(cache.get("a")).toBe(10);
        expect(cache.get("b")).toBeUndefined();
        expect(cache.get("c")).toBe(3);

        // Repeated getting of same key
        expect(cache.get("a")).toBe(10);
        expect(cache.get("a")).toBe(10);
        expect(cache.get("a")).toBe(10);
    });

    it("should return correct values when removing", () => {
        cache.set("a", 1);
        cache.set("b", 2);

        // remove should return the deleted value
        expect(cache.remove("a")).toBe(1);
        expect(cache.remove("b")).toBe(2);

        // remove non-existent key should return undefined
        expect(cache.remove("nonexistent")).toBeUndefined();
        expect(cache.remove("a")).toBeUndefined(); // already deleted

        expect(cache.size).toBe(0);
    });

    it("should evict the least recently used key when capacity is exceeded", () => {
        cache.set("a", 1);
        cache.set("b", 2);
        cache.set("c", 3);

        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("b")).toBe(2);
        expect(cache.get("c")).toBe(3);

        expect(cache.size).toBe(2);
    });

    it("should bring the most recently used key to the front", () => {
        cache.set("a", 1);
        cache.set("b", 2);

        cache.get("a");
        cache.set("c", 3);

        expect(cache.get("a")).toBe(1);
        expect(cache.get("b")).toBeUndefined();
        expect(cache.get("c")).toBe(3);
    });

    it("should remove values correctly", () => {
        cache.set("a", 1);
        cache.set("b", 2);

        cache.remove("a");
        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("b")).toBe(2);

        cache.remove("b");
        expect(cache.get("b")).toBeUndefined();
        expect(cache.size).toBe(0);

        cache.set("c", 0);
        cache.set("d", 1);
        cache.removeAll();

        expect(cache.size).toBe(0);
        expect(cache.get("c")).toBeUndefined();
        expect(cache.get("d")).toBeUndefined();
    });

    it("should trim the cache to the specified size", () => {
        cache.set("a", 1);
        cache.set("b", 2);

        cache.trimTo(-1);
        expect(cache.size).toBe(2);

        cache.trimTo(3);
        expect(cache.size).toBe(2);

        cache.trimTo(2);
        expect(cache.size).toBe(2);

        cache.trimTo(1);
        expect(cache.size).toBe(1);
        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("b")).toBe(2);

        cache.trimTo(0);
        expect(cache.size).toBe(0);
        expect(cache.get("b")).toBeUndefined();
    });

    it("should handle operations on empty cache", () => {
        // Various operations on empty cache
        expect(cache.size).toBe(0);
        expect(cache.get("nonexistent")).toBeUndefined();
        expect(cache.remove("nonexistent")).toBeUndefined();

        // removeAll should be safe on empty cache
        cache.removeAll();
        expect(cache.size).toBe(0);

        // trimTo should be safe on empty cache
        cache.trimTo(0);
        cache.trimTo(5);
        cache.trimTo(-1);
        expect(cache.size).toBe(0);

        // Add element then clear
        cache.set("a", 1);
        expect(cache.size).toBe(1);
        cache.removeAll();
        expect(cache.size).toBe(0);
        expect(cache.get("a")).toBeUndefined();
    });

    it("should handle stress test with many operations", () => {
        const stressCache = new LRUCache<number, string>(100);

        // Add large amount of data
        for (let i = 0; i < 200; i++) {
            stressCache.set(i, `value${i}`);
        }

        // Should only keep the last 100
        expect(stressCache.size).toBe(100);
        expect(stressCache.get(0)).toBeUndefined(); // Earliest should be evicted
        expect(stressCache.get(199)).toBe("value199"); // Latest should exist

        // Random access to some elements
        for (let i = 150; i < 200; i += 5) {
            expect(stressCache.get(i)).toBe(`value${i}`);
        }

        // Batch deletion
        for (let i = 150; i < 160; i++) {
            expect(stressCache.remove(i)).toBe(`value${i}`);
        }

        expect(stressCache.size).toBe(90);

        // trimTo test
        stressCache.trimTo(50);
        expect(stressCache.size).toBe(50);

        stressCache.trimTo(0);
        expect(stressCache.size).toBe(0);
    });
});
