export const SUPPORTED_COMMANDS = {
    create: "create",
    read: "read",
    remove: "remove",
    alter: "alter",
    import: "import",
    load: "load",
    save: "save"
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
        name: "private",
        symbol: "-"
    },
    {
        name: "public",
        symbol: "+"
    },
    {
        name: "protected",
        symbol: "#"
    },
];

export const SUPPORTED_RELATIONSHIP_TYPES = [
    {
        name: "associative",
        code: "as"
    },
    {
        name: "directed_association",
        code: "da"
    },
    {
        name: "reflexive_association",
        code: "ra"
    },
    {
        name: "aggregation",
        code: "ag"
    },
    {
        name: "composition",
        code: "co"
    },
    {
        name: "inheritance",
        code: "in"
    },
    {
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