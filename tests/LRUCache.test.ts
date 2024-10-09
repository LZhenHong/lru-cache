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
});
