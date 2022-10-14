import { createContext, useState } from "react";
import { SUPPORTED_COMMANDS, SUPPORTED_ENTITY_TYPES } from "../Utils/SupportedKeyWords";

const CommandHandlerContext = createContext();

export function CommandHandlerProvider({ children }) {
    const [classEntities, setClassEntities] = useState([]);

    const commandHandler = (handledCommand) => {
        switch(handledCommand.command) {
            case SUPPORTED_COMMANDS.create[0]:
                const newEntity = handledCommand;
                delete newEntity.command;

                createEntityHandler(newEntity);

                break;

            default:
        }
        
        return handledCommand;
    };

    function createEntityHandler(newEntity) {
        console.log(newEntity);
        switch(true) {
            case SUPPORTED_ENTITY_TYPES.class.includes(newEntity.entityType.toLowerCase()):
                console.log(newEntity)
                setClassEntities(prevClassEntities => {
                return [
                    ...prevClassEntities,
                    newEntity
                ];
            });
            break;
    
            default:
        }
    }

    return (
        <CommandHandlerContext.Provider value={{ classEntities, commandHandler }}>
            { children }
        </CommandHandlerContext.Provider>
    );
}

export default CommandHandlerContext;