(function(d,e){typeof exports=="object"&&typeof module<"u"?e(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],e):(d=typeof globalThis<"u"?globalThis:d||self,e(d.LaravelVuePagination={},d.Vue))})(this,function(d,e){"use strict";const h={emits:["pagination-change-page"],props:{data:{type:Object,default:()=>{}},limit:{type:Number,default:0},keepLength:{type:Boolean,default:!1}},computed:{isApiResource(){return!!this.data.meta},currentPage(){var t;return this.isApiResource?this.data.meta.current_page:(t=this.data.current_page)!=null?t:null},firstPageUrl(){var t,i,a,r,s;return(s=(r=(i=this.data.first_page_url)!=null?i:(t=this.data.meta)==null?void 0:t.first_page_url)!=null?r:(a=this.data.links)==null?void 0:a.first)!=null?s:null},from(){var t;return this.isApiResource?this.data.meta.from:(t=this.data.from)!=null?t:null},lastPage(){var t;return this.isApiResource?this.data.meta.last_page:(t=this.data.last_page)!=null?t:null},lastPageUrl(){var t,i,a,r,s;return(s=(r=(i=this.data.last_page_url)!=null?i:(t=this.data.meta)==null?void 0:t.last_page_url)!=null?r:(a=this.data.links)==null?void 0:a.last)!=null?s:null},nextPageUrl(){var t,i,a,r,s;return(s=(r=(i=this.data.next_page_url)!=null?i:(t=this.data.meta)==null?void 0:t.next_page_url)!=null?r:(a=this.data.links)==null?void 0:a.next)!=null?s:null},perPage(){var t;return this.isApiResource?this.data.meta.per_page:(t=this.data.per_page)!=null?t:null},prevPageUrl(){var t,i,a,r,s;return(s=(r=(i=this.data.prev_page_url)!=null?i:(t=this.data.meta)==null?void 0:t.prev_page_url)!=null?r:(a=this.data.links)==null?void 0:a.prev)!=null?s:null},to(){var t;return this.isApiResource?this.data.meta.to:(t=this.data.to)!=null?t:null},total(){var t;return this.isApiResource?this.data.meta.total:(t=this.data.total)!=null?t:null},pageRange(){if(this.limit===-1)return 0;if(this.limit===0)return this.lastPage;for(var t=this.currentPage,i=this.keepLength,a=this.lastPage,r=this.limit,s=t-r,m=t+r,g=(r+2)*2,n=(r+2)*2-1,l=[],c=[],p,o=1;o<=a;o++)(o===1||o===a||o>=s&&o<=m||i&&o<g&&t<g-2||i&&o>a-n&&t>a-n+2)&&l.push(o);return l.forEach(function(u){p&&(u-p===2?c.push(p+1):u-p!==1&&c.push("...")),c.push(u),p=u}),c}},methods:{previousPage(){this.selectPage(this.currentPage-1)},nextPage(){this.selectPage(this.currentPage+1)},selectPage(t){t==="..."||t===this.currentPage||this.$emit("pagination-change-page",t)}},render(){return this.$slots.default({data:this.data,limit:this.limit,computed:{isApiResource:this.isApiResource,currentPage:this.currentPage,firstPageUrl:this.firstPageUrl,from:this.from,lastPage:this.lastPage,lastPageUrl:this.lastPageUrl,nextPageUrl:this.nextPageUrl,perPage:this.perPage,prevPageUrl:this.prevPageUrl,to:this.to,total:this.total,pageRange:this.pageRange},prevButtonEvents:{click:t=>{t.preventDefault(),this.previousPage()}},nextButtonEvents:{click:t=>{t.preventDefault(),this.nextPage()}},pageButtonEvents:t=>({click:i=>{i.preventDefault(),this.selectPage(t)}})})}},f=(t,i)=>{const a=t.__vccOpts||t;for(const[r,s]of i)a[r]=s;return a},_={compatConfig:{MODE:3},inheritAttrs:!1,emits:["pagination-change-page"],components:{RenderlessPagination:h},props:{data:{type:Object,default:()=>{}},limit:{type:Number,default:0},keepLength:{type:Boolean,default:!1},showDisabled:{type:Boolean,default:!1},size:{type:String,default:"default",validator:t=>["small","default","large"].indexOf(t)!==-1},align:{type:String,default:"left",validator:t=>["left","center","right"].indexOf(t)!==-1}},methods:{onPaginationChangePage(t){this.$emit("pagination-change-page",t)}}},P=["tabindex"],k=e.createElementVNode("span",{"aria-hidden":"true"},"\xAB",-1),x=e.createElementVNode("span",{class:"sr-only"},"Previous",-1),B={key:0,class:"sr-only"},y=["tabindex"],b=e.createElementVNode("span",{"aria-hidden":"true"},"\xBB",-1),E=e.createElementVNode("span",{class:"sr-only"},"Next",-1);function C(t,i,a,r,s,m){const g=e.resolveComponent("RenderlessPagination");return e.openBlock(),e.createBlock(g,{data:a.data,limit:a.limit,"keep-length":a.keepLength,onPaginationChangePage:m.onPaginationChangePage},{default:e.withCtx(n=>[n.computed.total>n.computed.perPage?(e.openBlock(),e.createElementBlock("ul",e.mergeProps({key:0},t.$attrs,{class:["pagination",{"pagination-sm":a.size=="small","pagination-lg":a.size=="large","justify-content-center":a.align=="center","justify-content-end":a.align=="right"}]}),[n.computed.prevPageUrl||a.showDisabled?(e.openBlock(),e.createElementBlock("li",{key:0,class:e.normalizeClass(["page-item pagination-prev-nav",{disabled:!n.computed.prevPageUrl}])},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#","aria-label":"Previous",tabindex:!n.computed.prevPageUrl&&-1},e.toHandlers(n.prevButtonEvents,!0)),[e.renderSlot(t.$slots,"prev-nav",{},()=>[k,x])],16,P)],2)):e.createCommentVNode("",!0),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(n.computed.pageRange,(l,c)=>(e.openBlock(),e.createElementBlock("li",{class:e.normalizeClass(["page-item pagination-page-nav",{active:l==n.computed.currentPage}]),key:c},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#"},e.toHandlers(n.pageButtonEvents(l),!0)),[e.createTextVNode(e.toDisplayString(l)+" ",1),l==n.computed.currentPage?(e.openBlock(),e.createElementBlock("span",B,"(current)")):e.createCommentVNode("",!0)],16)],2))),128)),n.computed.nextPageUrl||a.showDisabled?(e.openBlock(),e.createElementBlock("li",{key:1,class:e.normalizeClass(["page-item pagination-next-nav",{disabled:!n.computed.nextPageUrl}])},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#","aria-label":"Next",tabindex:!n.computed.nextPageUrl&&-1},e.toHandlers(n.nextButtonEvents,!0)),[e.renderSlot(t.$slots,"next-nav",{},()=>[b,E])],16,y)],2)):e.createCommentVNode("",!0)],16)):e.createCommentVNode("",!0)]),_:3},8,["data","limit","keep-length","onPaginationChangePage"])}const N=f(_,[["render",C]]),V={compatConfig:{MODE:3},inheritAttrs:!1,emits:["pagination-change-page"],components:{RenderlessPagination:h},props:{data:{type:Object,default:()=>{}},limit:{type:Number,default:0},showDisabled:{type:Boolean,default:!1},keepLength:{type:Boolean,default:!1},size:{type:String,default:"default",validator:t=>["small","default","large"].indexOf(t)!==-1},align:{type:String,default:"left",validator:t=>["left","center","right"].indexOf(t)!==-1}},methods:{onPaginationChangePage(t){this.$emit("pagination-change-page",t)}}},w=["tabindex"],U=e.createElementVNode("span",{"aria-hidden":"true"},"\xAB",-1),R=["aria-current"],z=["tabindex"],D=e.createElementVNode("span",{"aria-hidden":"true"},"\xBB",-1);function S(t,i,a,r,s,m){const g=e.resolveComponent("RenderlessPagination");return e.openBlock(),e.createBlock(g,{data:a.data,limit:a.limit,"keep-length":a.keepLength,onPaginationChangePage:m.onPaginationChangePage},{default:e.withCtx(n=>[n.computed.total>n.computed.perPage?(e.openBlock(),e.createElementBlock("ul",e.mergeProps({key:0},t.$attrs,{class:["pagination",{"pagination-sm":a.size=="small","pagination-lg":a.size=="large","justify-content-center":a.align=="center","justify-content-end":a.align=="right"}]}),[n.computed.prevPageUrl||a.showDisabled?(e.openBlock(),e.createElementBlock("li",{key:0,class:e.normalizeClass(["page-item pagination-prev-nav",{disabled:!n.computed.prevPageUrl}])},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#","aria-label":"Previous",tabindex:!n.computed.prevPageUrl&&-1},e.toHandlers(n.prevButtonEvents,!0)),[e.renderSlot(t.$slots,"prev-nav",{},()=>[U])],16,w)],2)):e.createCommentVNode("",!0),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(n.computed.pageRange,(l,c)=>(e.openBlock(),e.createElementBlock("li",{class:e.normalizeClass(["page-item pagination-page-nav",{active:l==n.computed.currentPage}]),key:c},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#"},e.toHandlers(n.pageButtonEvents(l),!0),{"aria-current":l==n.computed.currentPage?"page":null}),e.toDisplayString(l),17,R)],2))),128)),n.computed.nextPageUrl||a.showDisabled?(e.openBlock(),e.createElementBlock("li",{key:1,class:e.normalizeClass(["page-item pagination-next-nav",{disabled:!n.computed.nextPageUrl}])},[e.createElementVNode("a",e.mergeProps({class:"page-link",href:"#","aria-label":"Next",tabindex:!n.computed.nextPageUrl&&-1},e.toHandlers(n.nextButtonEvents,!0)),[e.renderSlot(t.$slots,"next-nav",{},()=>[D])],16,z)],2)):e.createCommentVNode("",!0)],16)):e.createCommentVNode("",!0)]),_:3},8,["data","limit","keep-length","onPaginationChangePage"])}const $=f(V,[["render",S]]),A={compatConfig:{MODE:3},inheritAttrs:!1,emits:["pagination-change-page"],components:{RenderlessPagination:h},props:{data:{type:Object,default:()=>{}},limit:{type:Number,default:0},keepLength:{type:Boolean,default:!1},itemClasses:{type:Array,default:()=>["bg-white","text-gray-500","border-gray-300","hover:bg-gray-50"]},activeClasses:{type:Array,default:()=>["bg-blue-50","border-blue-500","text-blue-600"]}},methods:{onPaginationChangePage(t){this.$emit("pagination-change-page",t)}}},L=["disabled"],O=e.createElementVNode("span",{class:"sr-only"},"Previous",-1),j=e.createElementVNode("svg",{class:"w-5 h-5","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor"},[e.createElementVNode("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.75 19.5L8.25 12l7.5-7.5"})],-1),H=["aria-current","disabled"],M=["disabled"],T=e.createElementVNode("span",{class:"sr-only"},"Next",-1),F=e.createElementVNode("svg",{class:"w-5 h-5","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor"},[e.createElementVNode("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 4.5l7.5 7.5-7.5 7.5"})],-1);function q(t,i,a,r,s,m){const g=e.resolveComponent("RenderlessPagination");return e.openBlock(),e.createBlock(g,{data:a.data,limit:a.limit,"keep-length":a.keepLength,onPaginationChangePage:m.onPaginationChangePage},{default:e.withCtx(n=>[n.computed.total>n.computed.perPage?(e.openBlock(),e.createElementBlock("nav",e.mergeProps({key:0},t.$attrs,{class:"inline-flex -space-x-px rounded-md shadow-sm isolate ltr:flex-row rtl:flex-row-reverse","aria-label":"Pagination"}),[e.createElementVNode("button",e.mergeProps({class:["relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-l-md focus:z-20 disabled:opacity-50",a.itemClasses],disabled:!n.computed.prevPageUrl},e.toHandlers(n.prevButtonEvents,!0)),[e.renderSlot(t.$slots,"prev-nav",{},()=>[O,j])],16,L),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(n.computed.pageRange,(l,c)=>(e.openBlock(),e.createElementBlock("button",e.mergeProps({class:["relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20",[l==n.computed.currentPage?a.activeClasses:a.itemClasses,l==n.computed.currentPage?"z-30":""]],"aria-current":n.computed.currentPage?"page":null,key:c},e.toHandlers(n.pageButtonEvents(l),!0),{disabled:l===n.computed.currentPage}),e.toDisplayString(l),17,H))),128)),e.createElementVNode("button",e.mergeProps({class:["relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-r-md focus:z-20 disabled:opacity-50",a.itemClasses],disabled:!n.computed.nextPageUrl},e.toHandlers(n.nextButtonEvents,!0)),[e.renderSlot(t.$slots,"next-nav",{},()=>[T,F])],16,M)],16)):e.createCommentVNode("",!0)]),_:3},8,["data","limit","keep-length","onPaginationChangePage"])}const G=f(A,[["render",q]]);d.Bootstrap4Pagination=N,d.Bootstrap5Pagination=$,d.RenderlessPagination=h,d.TailwindPagination=G,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
