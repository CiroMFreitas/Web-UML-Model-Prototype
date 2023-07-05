export default function ReadDiagramCommandHandler(classEntities) {
    const classAmount = classEntities.length;
    const feedback = [];

    if(classAmount < 1) {
        return [{
            type: "locale",
            content: "command.read.diagram.empty"
        }];
    } else if(classAmount === 1) {
        feedback.push({
            type: "locale",
            content: "command.read.diagram.singular"
        });
        feedback.push({
            type: "string",
            content: classEntities[0].name
        });
    } else {
        feedback.push({
            type: "locale",
            content: "command.read.diagram.plural"
        });
        feedback.push({
            type: "string",
            content: classEntities[0].name
        });

        for(let i = 1; i < classAmount - 1; i++) {
            feedback.push({
                type: "string",
                content: "; " + classEntities[i].name
            });
        }

        feedback.push({
            type: "locale",
            content: "command.read.diagram.last"
        });
        feedback.push({
            type: "string",
            content: classEntities[classAmount - 1].name
        });
    }

    return feedback;
}