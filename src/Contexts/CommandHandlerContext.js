import { createContext, useState } from "react";

// Supported Key Words
const SUPPORTED_ENTITY_TYPES = {
    classType: "classe"
};

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([]);

    const commandHandler = (handledCommand) => {
        switch(handledCommand.type) {
            case "add":
                delete handledCommand.type;
                
                switch(handledCommand.entityType.toLowerCase()) {
                    case SUPPORTED_ENTITY_TYPES.classType:
                    setClassEntities(prevClassEntities => {
                        return [
                            ...prevClassEntities,
                            handledCommand
                        ];
                    });
                    break;

                    default:
                }
                break;

            default:
        }
    };

    return (
        <CommandHandlerContext.Provider value={{ classEntities, commandHandler }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;