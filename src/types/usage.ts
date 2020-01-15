/*
 Please note:
 Linked interfaces have the parent interface followed by there name
*/

// Usage interface
export interface USAGE{
    menu: [Menu];
}

interface Menu{
    header: string;
    optionList: [List];
    content?: string | [Content];
}

interface Content{
    header: string;
    content: [ContentObj]
}

interface ContentObj{
    name: string;
    summary: string;
}

interface List{
    name: string;
    description: string;
}
