export type ScrollRestoration = {
  getKey: () => string;
  addScrollRestoration: (key: string, offset: number) => void;
  popScrollRestoration: (key: string) => number;
  preventScrollRestoration: (key: string) => void;
  scrollRestorationPrevented: (key: string) => boolean;
};

export const NOOP_STORE: ScrollRestoration = {
  getKey: () => "",
  addScrollRestoration: () => null,
  popScrollRestoration: () => 0,
  preventScrollRestoration: () => null,
  scrollRestorationPrevented: () => false,
};

const STORAGE_KEY = "tw:scrollY";
const getKey = () => location.pathname;
const getSkipKey = (key: string) => `${key}:skip`;

export const SESSION_STORE: ScrollRestoration = {
  getKey,
  addScrollRestoration: (key: string, offset: number) => {
    const json = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    json[key] = offset;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  },
  popScrollRestoration: (key: string) => {
    const storage = window.sessionStorage.getItem(STORAGE_KEY);
    if (!storage) {
      return 0;
    }

    const json = JSON.parse(storage);
    const offset = json[key];
    if (offset == null) {
      return 0;
    }

    delete json[key];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));

    return offset;
  },
  preventScrollRestoration: (key: string) => {
    const storage = window.sessionStorage.getItem(STORAGE_KEY);

    if (!storage) {
      return;
    }

    const json = JSON.parse(storage);

    if (key in json) {
      delete json[key];
    }

    json[getSkipKey(key)] = true;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  },
  scrollRestorationPrevented: (key: string) => {
    const storage = window.sessionStorage.getItem(STORAGE_KEY);

    if (!storage) {
      return false;
    }

    const skipKey = getSkipKey(key);
    const json = JSON.parse(storage);
    const skip = json[`${key}:skip`];

    if (skip == null) {
      return false;
    }

    delete json[skipKey];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));

    return skip === true;
  },
};
