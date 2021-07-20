(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{175:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return o})),a.d(t,"rightToc",(function(){return b})),a.d(t,"default",(function(){return f}));var n=a(1),r=a(9),c=(a(0),a(225)),i={last_modified_on:"2021-07-11",$schema:"/.meta/.schemas/highlights.json",title:"Released gnet v1.5.0",description:"Released the official stable version of v1.5.0",author_github:"https://github.com/panjf2000",pr_numbers:["75f87e"],release:"1.5.0",hide_on_release_notes:!1,tags:["type: release","domain: v1.5.0"]},o={date:"2021-07-11T00:00:00.000Z",description:"Released the official stable version of v1.5.0",permalink:"/highlights/2021-07-11-released-1-5-0",readingTime:"1 min read",source:"@site/highlights/2021-07-11-released-1-5-0.md",tags:[{label:"type: release",permalink:"/highlights/tags/type-release"},{label:"domain: v1.5.0",permalink:"/highlights/tags/domain-v-1-5-0"}],title:"Released gnet v1.5.0",truncated:!1,prevItem:{title:"Released gnet v1.5.2",permalink:"/highlights/2021-07-20-released-1-5-2"},nextItem:{title:"Released gnet v1.4.0",permalink:"/highlights/2021-02-17-released-1-4-0"}},b=[{value:"Features",id:"features",children:[]},{value:"Enhancements",id:"enhancements",children:[]},{value:"Docs",id:"docs",children:[]},{value:"Misc",id:"misc",children:[]}],l={rightToc:b};function f(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h2",{id:"features"},"Features"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Move the logging module out of the internal package and refactor to make it serviceable for users ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/d566061586adfda7efbf58feec0bd8ebf7534479"}),"d56606")," ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/b6b1cfb53400540000efb0f858d001437bc3d4f9"}),"b6b1cf")," ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/8837a92308f41805d38a2377da32530c6c79646d"}),"8837a9"))),Object(c.b)("h2",{id:"enhancements"},"Enhancements"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Support writev and readv in eventloop ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/f299a8e39a1d5601afc3ddca6eec149e6aa3cf7b"}),"f299a8")),Object(c.b)("li",{parentName:"ul"},"Reduce GC pause frequency for Conn.AsyncWrite (#218) ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/477bb4fe46c38accf993fb11a9ba816bfa9fdc0b"}),"477bb4")),Object(c.b)("li",{parentName:"ul"},"Improve logging module ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/8837a92308f41805d38a2377da32530c6c79646d"}),"8837a9")," ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/b6b1cfb53400540000efb0f858d001437bc3d4f9"}),"b6b1cf")),Object(c.b)("li",{parentName:"ul"},"Refactor the inside AsyncTaskQueue to make it more generic ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/2d1a4639d18dbd8faeb43649a3e4859378cc95e6"}),"2d1a46")),Object(c.b)("li",{parentName:"ul"},"Reduce GC pause frequency for accepting connections ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/2d1a4639d18dbd8faeb43649a3e4859378cc95e6"}),"2d1a46"))),Object(c.b)("h2",{id:"docs"},"Docs"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Add a new user case: Tencent Games ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/b7ea839d959face861aca90ea493e5d3f8dfb205"}),"b7ea83")),Object(c.b)("li",{parentName:"ul"},"Add a new donor ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/ee965a1453d07300bf14749ea874a5d06ffc660e"}),"ee965a"))),Object(c.b)("h2",{id:"misc"},"Misc"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Add debugging log when error occurs in Accept() ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/pull/222"}),"#222")),Object(c.b)("li",{parentName:"ul"},"Make some trivial changes to ring-buffer ",Object(c.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/panjf2000/gnet/commit/1bdd3aa77da3827268e1145a07443460e1f01bd5"}),"1bdd3a"))))}f.isMDXComponent=!0},225:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return s}));var n=a(0),r=a.n(n);function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function b(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=r.a.createContext({}),f=function(e){var t=r.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o({},t,{},e)),a},p=function(e){var t=f(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=Object(n.forwardRef)((function(e,t){var a=e.components,n=e.mdxType,c=e.originalType,i=e.parentName,l=b(e,["components","mdxType","originalType","parentName"]),p=f(a),u=n,s=p["".concat(i,".").concat(u)]||p[u]||m[u]||c;return a?r.a.createElement(s,o({ref:t},l,{components:a})):r.a.createElement(s,o({ref:t},l))}));function s(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=a.length,i=new Array(c);i[0]=u;var o={};for(var b in t)hasOwnProperty.call(t,b)&&(o[b]=t[b]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var l=2;l<c;l++)i[l]=a[l];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);