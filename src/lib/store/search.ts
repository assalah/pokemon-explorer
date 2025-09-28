import { writable } from "svelte/store";

export type Item = {
    name: string;
    url: string;
    id?: string;
    types?: string[];
    searchTerms?: string;
};

export const createSearchStore = (initial: Item[] = []) => {
    const { subscribe, set, update } = writable({
        data: initial,
        filtered: initial,
        search: "",
        selectedTypes: [] as string[]
    });

    function applyFilters(state: {
        data: Item[];
        search: string;
        selectedTypes: string[];
    }) {
        const lower = (state.search || "").toLowerCase();
        return state.data.filter((item: Item) => {
            const matchName =
                (item.searchTerms || item.name).toLowerCase().includes(lower);
            const matchType =
                state.selectedTypes.length === 0 ||
                item.types?.some((t) => state.selectedTypes.includes(t));
            return matchName && matchType;
        });
    }

    return {
        subscribe,
        search: (term: string) => {
            update((state: any) => {
                const newState = { ...state, search: term };
                return { ...newState, filtered: applyFilters(newState) };
            });
        },
        toggleType: (type: string) => {
            update((state: any) => {
                const already = state.selectedTypes.includes(type);
                const newTypes = already
                    ? state.selectedTypes.filter((t: string) => t !== type)
                    : [...state.selectedTypes, type];
                const newState = { ...state, selectedTypes: newTypes };
                return { ...newState, filtered: applyFilters(newState) };
            });
        },
        setData: (newData: Item[]) => {
            set({
                data: newData,
                filtered: newData,
                search: "",
                selectedTypes: []
            });
        },
        reset: () =>
            set({ data: initial, filtered: initial, search: "", selectedTypes: [] })
    };
};