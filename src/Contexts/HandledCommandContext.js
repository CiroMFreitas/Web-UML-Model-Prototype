import { createContext, useState } from "react";

const HandledCommandsContext = createContext();

export function HandledCommandsProvider({ children }) {
    const [handledCommands, setHandledCommands] = useState([]);

     const newHandledCommand = (handledCommandLine) => {
        setHandledCommands(handledCommandLine);
     };

    return (
        <HandledCommandsContext.Provider value={{ handledCommands, newHandledCommand }}>
            { children }
        </HandledCommandsContext.Provider>
    );
}

export default HandledCommandsContext;