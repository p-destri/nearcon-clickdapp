import React, { createContext, useReducer, useContext, useState } from 'react';

export type StateType = Record<string, any>

export interface EventInterface {
  name: string
  handler: () => void
}

interface VMContextValue {
  global: StateType;
  events: EventInterface[];
  dispatchState: (value: StateType) => void;
  registerEvent: (event: EventInterface) => void;
  dispatchEvent: (name: string) => void | undefined;
}

const initialState = {};

const VMContext = createContext<VMContextValue>({
  global: {},
  events: [],
  dispatchState: () => {},
  dispatchEvent: () => {},
  registerEvent: () => {},
});

const reducer = (state: StateType, updated: StateType ) => {
  return {
    ...state,
    ...updated,
  };
}

const VMContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [events, setEvents] = useState<EventInterface[]>([]);

  const registerEvent = (event: EventInterface) => {
    setEvents([...events, event]);
  }

  const dispatchEvent = (name: string) => {
    const eventIndex = events.findIndex((e) => e.name === name);

    if (eventIndex !== -1) {
      events[eventIndex].handler();
    }
  }

  const dispatchState = (value: StateType) => dispatch(value)

  return (
    <VMContext.Provider value={{ global: state, events, dispatchEvent, registerEvent, dispatchState }}>
      {children}
    </VMContext.Provider>
  );
};

const useVMContext = () => {
  return useContext(VMContext);
};

export { VMContextProvider, useVMContext };
