import { createContext, useState } from "react";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classes, setClasses] = useState([]);

    const commandHandler = (handledCommand) => {
        switch(handledCommand.type) {
            case "add":
                delete handledCommand.type;
                setClasses(prevClasses => {
                    return [
                        ...prevClasses,
                        handledCommand
                    ];
                })
                break;

            default:
        }
    };

    return (
        <CommandHandlerContext.Provider value={{ classes, commandHandler }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;