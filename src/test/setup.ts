import '@testing-library/jest-dom/vitest'

const storage = (() => {
  let entries = new Map<string, string>()

  return {
    get length() {
      return entries.size
    },
    clear: () => {
      entries = new Map()
    },
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => Array.from(entries.keys())[index] ?? null,
    removeItem: (key: string) => {
      entries.delete(key)
    },
    setItem: (key: string, value: string) => {
      entries.set(key, value)
    },
  } satisfies Storage
})()

Object.defineProperty(window, 'localStorage', {
  value: storage,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
})
