export const SUPPORTED_COMMANDS = {
    create: "create",
    read: [
        "read",
        "ler"
    ],
    remove: [
        "remove",
        "remover"
    ],
    alter: [
        "alter",
        "alterar"
    ]
}

export const SUPPORTED_ENTITY_TYPES = {
    diagram: "diagram",
    class: "class",
    relationship: "relationship"
};

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

export const SUPPORTED_VISIBILITY = {
    public: "public",
    protected: "protected",
    private: "private"
};

export const SUPPORTED_ALTER_ARGUMENTS = {
    add: [
        "add",
        "adicionar"
    ],
    remove: [
        "remove",
        "remover"
    ],
    alter: [
        "alter",
        "alterar"
    ]
}
