import { Observable } from 'rxjs';

type CacheOptions = {
  resolver: (...args: unknown[]) => object | string | number;
  shouldUseWeakMap?: boolean;
  clearCacheTime?: number;
};

export function Cache(
  args: Omit<CacheOptions, 'shouldUseWeakMap'>
): MethodDecorator;
export function Cache(
  args: Omit<CacheOptions, 'clearCacheTime'>
): MethodDecorator;
export function Cache({
  resolver,
  shouldUseWeakMap,
  clearCacheTime
}: CacheOptions): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;
    let clearCacheTimer: ReturnType<typeof setTimeout>;
    let cache: Map<unknown, unknown> | WeakMap<object, unknown> = initCache(
      !!shouldUseWeakMap
    );

    const startClearCacheTimer = !clearCacheTime
      ? () => {
        /**/
      }
      : () => {
        if (clearCacheTimer) clearTimeout(clearCacheTimer);

        clearCacheTimer = setTimeout(() => {
          cache = initCache(!!shouldUseWeakMap);
        }, clearCacheTime);
      };

    descriptor.value = async function (...args: unknown[]) {
      startClearCacheTimer();

      const key = resolver(...args) as typeof cache extends Map<
          string | number | object,
          unknown
        >
        ? string
        : object;
      const cachedValue = cache.get(key);

      if (cachedValue) return cachedValue;

      let result = originalMethod.apply(this, args);

      if (result instanceof Observable) {
        result = await originalMethod.apply(this, args).toPromise();
      }

      cache.set(key, result);

      return result;
    };
  };
}

function initCache(
  shouldUseWeakMap: boolean
): Map<unknown, unknown> | WeakMap<object, unknown> {
  return shouldUseWeakMap ? new WeakMap() : new Map();
}
