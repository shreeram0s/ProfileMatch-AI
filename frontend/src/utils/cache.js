/**
 * Simple cache manager for API responses
 */

const CACHE_PREFIX = 'profilematch_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

class CacheManager {
  /**
   * Set item in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = DEFAULT_TTL) {
    const cacheKey = CACHE_PREFIX + key;
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if expired/not found
   */
  get(key) {
    const cacheKey = CACHE_PREFIX + key;
    try {
      const itemStr = localStorage.getItem(cacheKey);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   * @param {string} key - Cache key
   */
  remove(key) {
    const cacheKey = CACHE_PREFIX + key;
    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  /**
   * Clear all cache items
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get or set pattern - fetch from cache or execute function
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to execute if not in cache
   * @param {number} ttl - Time to live in milliseconds
   * @returns {Promise<any>}
   */
  async getOrFetch(key, fetchFn, ttl = DEFAULT_TTL) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }
}

// Create singleton instance
const cache = new CacheManager();

export default cache;

// Export convenience functions
export const setCache = (key, value, ttl) => cache.set(key, value, ttl);
export const getCache = (key) => cache.get(key);
export const removeCache = (key) => cache.remove(key);
export const clearCache = () => cache.clear();
export const hasCache = (key) => cache.has(key);
export const getOrFetch = (key, fetchFn, ttl) => cache.getOrFetch(key, fetchFn, ttl);
