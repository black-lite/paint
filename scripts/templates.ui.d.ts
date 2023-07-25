/// <reference types="jquery" />
declare namespace Templates {
    function createElement(tagName: string, props: {
        [key: string]: any;
    }, ...subNodes: any[]): JQuery;
}
