import { get, writable } from "svelte/store";
import { persisted } from "svelte-persisted-store";

const createPersistedStore = (key = 'localStoreKey', defaultValues: Record<string,any>) => {
  const internalStore = persisted(key, {...defaultValues});
  let resetConfirm = writable(false);
  let resetTimeout: NodeJS.Timeout;
  const reset = (key?: keyof typeof defaultValues) => {
    clearTimeout(resetTimeout);
    if(key) {
      resetSpecific(key);
    } else {
      if ( get(resetConfirm) ) {
        internalStore.set({...defaultValues});
        resetConfirm.set(false);
      } else {
        resetTimeout = setTimeout(() => {
          resetConfirm.set(false);
        }, 3000);
        resetConfirm.set(true);
      }
    }
  }
  const resetSpecific = (key: keyof typeof defaultValues) => {
    internalStore.update(state => ({...state, [key]: defaultValues[key]}));
  }
  return {
    subscribe: internalStore.subscribe,
    set: internalStore.set,
    update: internalStore.update,
    reset: reset,
    isConfirmingReset: resetConfirm.subscribe
  }
}

export default createPersistedStore;