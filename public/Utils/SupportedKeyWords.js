export const SUPPORTED_COMMANDS = {
    create: "create",
    read: "read",
    remove: "remove",
    alter: "alter"
}

export const SUPPORTED_ENTITY_TYPES = {
    diagram: "diagram",
    classifier: [
        "class",
        "interface",
        "abstract",
    ],
    relationship: "relationship"
};

export const SUPPORTED_VISIBILITY = [
    {
        name: "public",
        symbol: "+"
    },
    {
        name: "protected",
        symbol: "#"
    },
    {
        name: "private",
        symbol: "-"
    }
];
/*
export const SUPPORTED_RELATIONSHIP_TYPES = {
    as: "associative",
    da: "directed_association",
    ra: "reflexive_association",
    mu: "multiplicity",
    ag: "aggregation",
    co: "composition",
    in: "inheritance",
    re: "realization"
}

export const SUPPORTED_ALTER_ARGUMENTS = {
    add: "add",
    remove: "remove",
    alter: "alter"
}
*/