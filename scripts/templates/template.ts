namespace Templates
{
	export function createElement(tagName: string, props: {[key:string]: any}, ...subNodes) : JQuery { return $(`<${tagName}/>`, props).append(subNodes); }
}
