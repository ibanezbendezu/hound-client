import {create} from 'zustand'
import {persist} from "zustand/middleware";

type State = {
    value: number,
}

type Actions = {
    setValue: (params: { newValue: number }) => void
}

const useThreshold = create(persist<State & Actions>(
    (set) => ({
        value: 0.75,
        setValue: ({newValue}) => set({value: newValue}),
    }),
    {
        name: 'threshold',
    }
));

export default useThreshold;

