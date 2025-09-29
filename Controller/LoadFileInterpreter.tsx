import INewDiagramDTO from "../public/DTO/INewDiagramDTO";
import ILoadDiagramDTO from "../public/DTO/ILoadDiagramDTO";
import CommandInterpreter from "./CommandInterpreter";

/**
 * Class responsible for handling user's loaded files into DTOs.
 */
export default class LoadFileInterpreter extends CommandInterpreter {
    /**
     * Turns a loaded JSON file string into a DTO.
     * 
     * @param jsonLoad Loaded diagram json object.
     * @returns All classifiers and relationship loaded from a JSON file.
     */
    public static interpretImportXML(jsonLoad: ILoadDiagramDTO): INewDiagramDTO {
        // Turn all JSON classifiers into classifier creation DTOs
        const interpretedClassifiers = jsonLoad.classifiers.map((loadedClassifier) => {
            // Turn all JSON attributes into attribute creation DTOs
            const interpretedAttributes = loadedClassifier.attributes.map((loadedAttribute) => {
                return {
                    id: loadedAttribute.id,
                    name: loadedAttribute.name,
                    type: loadedAttribute.type,
                    visibility: loadedAttribute.visibilityname
                };
            })

            // Turn all JSON methods into method creation DTOs
            const interpretedMethods = loadedClassifier.methods.map((loadedMathod) => {
                return {
                    id: loadedMathod.id,
                    name: loadedMathod.name,
                    type: loadedMathod.type,
                    visibility: loadedMathod.visibilityname,
                    parameters: loadedMathod.parameters
                };
            })

            return {
                id: loadedClassifier.id,
                classifierType: loadedClassifier.classifierType,
                name: loadedClassifier.name,
                attributes: interpretedAttributes,
                methods: interpretedMethods
            };
        })

        // Turn all JSON relationships into relationship creation DTOs
        const interpretedRelationships = jsonLoad.relationships.map((loadedRelationship) => {
            return {
                id: loadedRelationship.id,
                relationshipName: loadedRelationship.name,
                sourceClassifierId: loadedRelationship.sourceClassifierId,
                targetClassifierId: loadedRelationship.targetClassifierId,
                relationshipType: loadedRelationship.relatioshipType,
                multiplicity: loadedRelationship.multiplicity,
                attribute: loadedRelationship.attribute ? {
                    id: loadedRelationship.attribute.id,
                    name: loadedRelationship.attribute.name,
                    type: loadedRelationship.attribute.type,
                    visibility: loadedRelationship.attribute.visibilityname
                } : undefined
            }
        })

        return {
            classifiersData: interpretedClassifiers,
            relationshipsData: interpretedRelationships,
        }
    }
}