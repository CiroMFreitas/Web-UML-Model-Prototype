export const SUPPORTED_COMMANDS = {
    create: "create",
    read: "read",
    remove: "remove",
    alter: "alter",
    export: "export",
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
    {
        name: "associative",
        code: "as",
        ascii: "----"
    },
    {
        name: "directed_association",
        code: "da",
        ascii: "--->"
    },
    {
        name: "reflexive_association",
        code: "ra",
        ascii: "<-->"
    },
    {
        name: "aggregation",
        code: "ag",
        ascii: "o-->"
    },
    {
        name: "composition",
        code: "co",
        ascii: "*-->"
    },
    {
        name: "inheritance",
        code: "in",
        ascii: "---|>"
    },
    {
        name: "realization",
        code: "re",
        ascii: "...|>"
    }
]   
/*
export const SUPPORTED_ALTER_ARGUMENTS = {
    add: "add",
    remove: "remove",
    alter: "alter"
}
*/