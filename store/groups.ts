import {create} from 'zustand'
import {persist} from "zustand/middleware";

type StoreItem = {
    id: number;
    sha: string;
    groupDate: string;
    comparisons: Array<any>;
    numberOfRepos: number;
    repositories: Array<any>;
}

type State = {
    store: Array<any>,
    group: any,
}

type Actions = {
    setGroup: (params: { newGroup: any }) => void,
    addGroupToStore: (params: { newGroup: any }) => void,
    removeGroupFromStore: (params: { sha: string }) => void,
    emptyStore: () => void,
    updateGroupInStore: (params: { sha: string, updatedGroup: any }) => void
}

const useStore = create(persist<State & Actions>(
    (set) => ({
        store: [],
        group: {},
        openModal: false,
        setGroup: (params) => {
            const {newGroup} = params
            set((state) => {
                return {
                    ...state,
                    group: newGroup
                }
            })

        },
        addGroupToStore: (params) => {
            set((state) => {
                const newStore = [...state.store, params]
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        removeGroupFromStore: (params) => {
            const {sha} = params
            set((state) => {
                const newStore = state.store.filter((item) => item.sha !== sha)
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        emptyStore: () => {
            set((state) => {
                const newStore: never[] = []
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        updateGroupInStore: ({sha, updatedGroup}) =>
            set((state) => ({
            store: state.store.map((item) => item.sha === sha ? {...item, ...updatedGroup} : item)
        })),
    }), {
        name: 'store'
    }
));

export default useStore;
