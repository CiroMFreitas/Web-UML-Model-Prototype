export const SUPPORTED_COMMANDS = {
    create: "create",
    read: "read",
    remove: "remove",
    alter: "alter"
}

export const SUPPORTED_ENTITY_TYPES = {
    diagram: "diagram",
    classifier: [
        "classifier",
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

export const SUPPORTED_RELATIONSHIP_TYPES = [
    associative = {
        name: "associative",
        code: "as"
    },
    directed_association = {
        name: "directed_association",
        code: "da"
    },
    reflexive_association = {
        name: "reflexive_association",
        code: "ra"
    },
    multiplicity = {
        name: "multiplicity",
        code: "mu"
    },
    aggregation = {
        name: "aggregation",
        code: "ag"
    },
    composition = {
        name: "composition",
        code: "co"
    },
    associative = {
        name: "inheritance",
        code: "in"
    },
    associative = {
        name: "realization",
        code: "re"
    }
]
/*
export const SUPPORTED_ALTER_ARGUMENTS = {
    add: "add",
    remove: "remove",
    alter: "alter"
}
*/