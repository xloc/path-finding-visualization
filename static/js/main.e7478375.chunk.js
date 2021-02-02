(this.webpackJsonpa1=this.webpackJsonpa1||[]).push([[0],{113:function(e,t,n){"use strict";n.r(t);var c=n(3),r=n(0),a=n.n(r),i=n(11),s=n.n(i),o=n(42),u=n(14),l=n(5),f=n(15),d=n(144),j=n(158),b=n(143),v=n(157),O=n(145),h=n(146),p=n(147),g=n(148),m=n(115),y=n(155),x=n(149),w=n(152),k=n(150),N=n(156),I=n(138),S=Object(I.a)({palette:{primary:{main:"#203040"},secondary:{main:"#abc"}}}),D=(n(90),n(18)),E=(n(91),["#ff6347","#92da26","#4682b4","#F4A460","#dda0dd","#6a5acd","#06D6A0","#106b3c"]);function z(e){var t=Array(e.size.row).fill(null).map((function(t,n){return Array(e.size.col).fill(null).map((function(e,t){return{isWall:!1,isPin:!1,netID:-1}}))}));return e.walls.forEach((function(e){var n=Object(l.a)(e,2),c=n[0],r=n[1];t[c][r].isWall=!0})),e.nets.forEach((function(e){e.pins.forEach((function(n){var c=Object(l.a)(n,2),r=c[0],a=c[1];t[r][a].isPin=!0,t[r][a].netID=e.netID}))})),t}function H(e){var t=e.circuit,n=e.segments,a=e.progress,i=Object(r.useState)((function(){return z(t)})),s=Object(l.a)(i,2),o=s[0],u=s[1];return Object(r.useEffect)((function(){u(z(t))}),[t]),Object(c.jsx)("div",{children:o.map((function(e,t){return Object(c.jsx)("div",{className:"grid-row",children:e.map((function(e,r){return Object(c.jsx)(C,{mapCell:e,segment:null===n||void 0===n?void 0:n.grid[t][r],progress:null===a||void 0===a?void 0:a.grid[t][r]},"grid-cell ".concat(t," ").concat(r))}))},"grid-row ".concat(t))}))})}function C(e){var t=e.mapCell,n=e.segment,r=e.progress,a="#ccc";t.isWall?a="black":t.isPin&&(a=E[t.netID]),n&&-1!==n.netId&&(a=E[n.netId]);var i=-1===(null===n||void 0===n?void 0:n.netId)&&!t.isPin&&r&&r.visited>=0;return Object(c.jsxs)("div",{className:"grid-cell",style:{backgroundColor:a},children:[Object(c.jsx)("div",{className:t.isPin?"pin cell-overlap":""}),Object(c.jsx)("div",{className:i?"visited cell-overlap":""})]})}var F=n(139),A=n(141),P=n(142),q=n(151),G=(n(92),n(153));function M(e){var t=e.result,n=Object(G.a)();return Object(c.jsxs)("div",{className:"entry-row",children:[Object(c.jsx)(q.a,{color:"success.main",className:"icon-alignment",children:Object(c.jsx)(F.a,{fontSize:"small"})}),Object(c.jsxs)("div",{className:"history-list",children:[t.connectionHistory.map((function(e,t){return Object(c.jsx)("div",{className:"history-cell",style:{backgroundColor:E[e.netID]}},"".concat(n," ").concat(t))})),Object(c.jsx)("div",{className:"history-cell",style:{backgroundColor:E[t.newConnection.netID]}})]})]})}function W(e){var t=e.result,n=Object(G.a)();return Object(c.jsxs)("div",{className:"entry-row",children:[Object(c.jsx)(q.a,{color:"error.main",className:"icon-alignment",children:Object(c.jsx)(A.a,{fontSize:"small"})}),Object(c.jsxs)("div",{className:"history-list",children:[t.connectionHistory.map((function(e,t){return Object(c.jsx)("div",{className:"history-cell",style:{backgroundColor:E[e.netID]}},"".concat(n," ").concat(t))})),Object(c.jsx)("div",{className:"history-cell",style:{backgroundColor:E[t.failedNet.netID]}})]})]})}function B(e){var t=e.result,n=Object(G.a)();return Object(c.jsxs)("div",{className:"entry-row",children:[Object(c.jsx)(q.a,{color:"error.main",className:"icon-alignment",children:Object(c.jsx)(P.a,{fontSize:"small"})}),Object(c.jsx)("div",{className:"history-list",children:t.connectionHistory.map((function(e,t){return Object(c.jsx)("div",{className:"history-cell",style:{backgroundColor:E[e.netID]}},"".concat(n," ").concat(t))}))})]})}var R,J=n(73),L=function(){function e(t,n){Object(D.a)(this,e),this.grid=void 0,this.size=void 0,this.size=t,this.grid=Array(t.row).fill(null).map((function(e,c){return Array(t.col).fill(null).map((function(e,t){return n(c,t)}))}))}return Object(J.a)(e,[{key:"map",value:function(e){return{size:Object(o.a)({},this.size),grid:this.grid.map((function(t,n){return t.map((function(t,c){return e(t,n,c)}))}))}}},{key:"copyNumber",value:function(){return{size:Object(o.a)({},this.size),grid:this.grid.map((function(e){return Object(u.a)(e)}))}}}]),e}(),K=n(30);function Q(e,t){return[[e+1,t],[e-1,t],[e,t+1],[e,t-1]]}function T(e,t,n){var c=t.netID,r=new L(e.size,(function(e,t){return!1}));return e.walls.forEach((function(e){var t=Object(l.a)(e,2),n=t[0],c=t[1];r.grid[n][c]=!0})),e.nets.filter((function(e){return e.netID!==c})).forEach((function(e){e.pins.forEach((function(e){var t=Object(l.a)(e,2),n=t[0],c=t[1];r.grid[n][c]=!0}))})),n.forEach((function(e){e.segments.forEach((function(e){var t=Object(l.a)(e,2),n=t[0],c=t[1];r.grid[n][c]=!0}))})),r}function U(e,t){var n=new L(e,(function(e,t){return{netId:-1}}));return t.forEach((function(e){e.segments.forEach((function(t){var c=Object(l.a)(t,2),r=c[0],a=c[1];n.grid[r][a].netId=e.netID}))})),n}!function(e){e[e.Succeed=0]="Succeed",e[e.FailNet=1]="FailNet",e[e.FailAll=2]="FailAll"}(R||(R={}));var V=function e(t,n){Object(D.a)(this,e),this.visited=t,this.active=n},X=function e(t,n,c){Object(D.a)(this,e),this.visited=t,this.segHistory=n,this.newSegment=c},Y=function(e){return new V(e.copyNumber(),e.map((function(e){return-2===e})))},Z=function e(t,n){Object(D.a)(this,e),this.progress=t,this.sources=n};function $(e,t,n,c){for(var r=e.size,a=r.col,i=r.row,s=new L(e.size,(function(e,t){return-1})),o=function(e,t){return e>=0&&e<i&&t>=0&&t<a},u=function(t,n){return o(t,n)&&!e.grid[t][n]&&-1===s.grid[t][n]},d=t,j=0,b=null;d.length>0;){var v,O=[],h=Object(f.a)(d);try{for(h.s();!(v=h.n()).done;){var p=Object(l.a)(v.value,2),g=p[0],m=p[1];s.grid[g][m]=j}}catch(W){h.e(W)}finally{h.f()}var y,x=Object(f.a)(d);try{for(x.s();!(y=x.n()).done;){var w,k=Object(l.a)(y.value,2),N=k[0],I=k[1],S=Object(f.a)(Q(N,I));try{for(S.s();!(w=S.n()).done;){var D=Object(l.a)(w.value,2),E=D[0],z=D[1];u(E,z)&&(O.push([E,z]),s.grid[E][z]=-2,n.grid[E][z]&&(b=[E,z]))}}catch(W){S.e(W)}finally{S.f()}}}catch(W){x.e(W)}finally{x.f()}b?d=[]:(d=O,j++),c&&c.progress.push({type:"expand",progress:Y(s)})}if(!b)return{succeed:!1};for(var H=j,C=b,F=Object(l.a)(C,2),A=F[0],P=F[1],q=H,G=[];;){var M=Object(l.a)(Q(A,P).filter((function(e){var t=Object(l.a)(e,2),n=t[0],c=t[1];return o(n,c)&&s.grid[n][c]===q}))[0],2);if(A=M[0],P=M[1],c&&c.progress.push({type:"backtrack",progress:new X(s,[].concat(G),[A,P])}),0===s.grid[A][P])break;G.push([A,P]),q--}return{succeed:!0,segments:G,connectedPin:b}}var _=function e(t,n,c){Object(D.a)(this,e),this.net=t,this.segmentGrid=n,this.connectionHistories=c};function ee(e,t,n,c){for(var r=Object(K.a)(t.pins),a=r[0],i=r.slice(1),s=[a],o=function(e,t){var n=new L(e,(function(e,t){return!1}));return t.forEach((function(e){var t=Object(l.a)(e,2),c=t[0],r=t[1];n.grid[c][r]=!0})),n}(e.size,i),f=i.length,d=function(){if(c){var e=new Z([],Object(u.a)(s));return c.connectionHistories.push(e),e}};f>0;){var j=d(),b=n(e,s,o,j);if(!b.succeed)break;var v=b;f-=1,s=[].concat(Object(u.a)(s),Object(u.a)(v.segments),[v.connectedPin]);var O=Object(l.a)(v.connectedPin,2),h=O[0],p=O[1];o.grid[h][p]=!1}return f>0?{succeed:!1}:{succeed:!0,connection:{netID:t.netID,segments:s}}}var te=function e(t){Object(D.a)(this,e),this.netHistories=t},ne=function(e,t,n,c){var r,a=[],i=Object(f.a)(t);try{for(i.s();!(r=i.n()).done;){var s=r.value,o=U(e.size,a),u=new _(s,o,[]);n.netHistories.push(u);var l=ee(T(e,s,a),s,c,u);if(!l.succeed)break;var d=l;a.push(d.connection)}}catch(j){i.e(j)}finally{i.f()}};var ce,re=n(57),ae=n.n(re);function ie(e){var t=Object(r.useState)(),n=Object(l.a)(t,2),a=n[0],i=n[1];Object(r.useEffect)((function(){return ae.a.get("benchmarks/infiles.json").then((function(e){i(e.data)})),function(){}}),[]);var s=Object(r.useState)("rusty.infile"),o=Object(l.a)(s,2),u=o[0],f=o[1];return Object(r.useEffect)((function(){""!==u&&ae.a.get("benchmarks/".concat(u)).then((function(t){e(function(e){var t=e.split("\n"),n=t[0].split(" ").map((function(e){return parseInt(e)})),c=Object(l.a)(n,2),r=c[0],a=c[1],i=1,s=parseInt(t[i++]),o=t.slice(i,i+s).map((function(e){var t=e.split(" ").map((function(e){return parseInt(e)})),n=Object(l.a)(t,2),c=n[0];return[n[1],c]}));i+=s;var u=[],f=parseInt(t[i++]);return t.slice(i,i+f).forEach((function(e,t){for(var n=e.trim().split(" ").map((function(e){return parseInt(e)})),c=Object(K.a)(n).slice(1),r={netID:t,pins:[]},a=0;a<c.length;a+=2){var i=c[a],s=c[a+1];r.pins.push([s,i])}u.push(r)})),{size:{col:r,row:a},walls:o,nets:u}}(t.data))}))}),[u,e]),{routeMapSelector:Object(c.jsx)(b.a,{children:null===a||void 0===a?void 0:a.map((function(e){return Object(c.jsx)(v.a,{button:!0,onClick:function(){return f(e)},selected:e===u,children:e.split(".")[0]},e)}))}),mapName:u}}!function(e){e[e.void=0]="void",e[e.wall=1]="wall",e[e.pin=2]="pin"}(ce||(ce={}));var se=n(74),oe=n.n(se),ue=function(e,t){return e[0]-t[0]+(e[1]-t[1])},le=function e(t,n,c){Object(D.a)(this,e),this.coors=t,this.dist=void 0;var r,a=Object(K.a)(n),i=a[0],s=a.slice(1),o=ue(i,t),u=Object(f.a)(s);try{for(u.s();!(r=u.n()).done;){var l=r.value,d=ue(l,t);o>d&&(o=d,i=l)}}catch(j){u.e(j)}finally{u.f()}this.dist=o+c},fe=function(e,t){var n=new L(e.size,(function(e,t){return!1}));return{type:"expand",progress:new V(e.map((function(e){return e})),n)}},de=function(e,t){return e.dist-t.dist},je=function(e){var t=[];if(0===e.length)return t;for(var n=e.peek().dist;e.length>0&&e.peek().dist===n;)t.push(e.dequeue().coors);return t};function be(e,t,n,c){for(var r=e.size,a=r.col,i=r.row,s=new L(e.size,(function(e,t){return-1})),o=new L(e.size,(function(e,t){return null})),u=function(t,n){return function(e,t){return e>=0&&e<i&&t>=0&&t<a}(t,n)&&!e.grid[t][n]&&-1===s.grid[t][n]},d=function(e){var t=[];return e.grid.forEach((function(e,n){e.forEach((function(e,c){e&&t.push([n,c])}))})),t}(n),j=!0,b=function(e,t){var n,c=new oe.a({comparator:de}),r=Object(f.a)(e);try{for(r.s();!(n=r.n()).done;){var a=n.value;c.queue(new le(a,t,0))}}catch(i){r.e(i)}finally{r.f()}return c}(t,d),v=1,O=null;b.length>0;){var h,p=je(b),g=Object(f.a)(p);try{for(g.s();!(h=g.n()).done;){var m=Object(l.a)(h.value,2),y=m[0],x=m[1];s.grid[y][x]=j?0:1,j=!1}}catch(B){g.e(B)}finally{g.f()}var w,k=Object(f.a)(p);try{for(k.s();!(w=k.n()).done;){var N,I=Object(l.a)(w.value,2),S=I[0],D=I[1],E=Object(f.a)(Q(S,D));try{for(E.s();!(N=E.n()).done;){var z=Object(l.a)(N.value,2),H=z[0],C=z[1];u(H,C)&&(b.queue(new le([H,C],d,v)),o.grid[H][C]=[S,D],s.grid[H][C]=-2,n.grid[H][C]&&(O=[H,C]))}}catch(B){E.e(B)}finally{E.f()}}}catch(B){k.e(B)}finally{k.f()}O?b.clear():v++,c&&c.progress.push(fe(s))}if(!O)return{succeed:!1};for(var F=O,A=Object(l.a)(F,2),P=A[0],q=A[1],G=[];;){try{var M=o.grid[P][q],W=Object(l.a)(M,2);P=W[0],q=W[1]}catch(R){break}if(c&&c.progress.push({type:"backtrack",progress:new X(s,[].concat(G),[P,q])}),0===s.grid[P][q])break;G.push([P,q])}return{succeed:!0,segments:G,connectedPin:O}}var ve=150,Oe=Object(d.a)((function(e){return Object(j.a)({root:{display:"flex"},appBar:{width:"calc(100% - ".concat(ve,"px - ").concat(200,"px)"),left:ve},circuitDrawer:{width:ve,flexShrink:0},circuitDrawerPaper:{width:ve},historyDrawer:{width:200},historyDrawerPaper:{width:200,flexShrink:0},toolbar:e.mixins.toolbar,content:{flexGrow:1,backgroundColor:e.palette.background.default}})})),he=function(e){var t,n=[],c=Object(f.a)(e.netHistories);try{for(c.s();!(t=c.n()).done;){var r,a=t.value,i=Object(f.a)(a.connectionHistories);try{for(i.s();!(r=i.n()).done;){var s,o=r.value,u=Object(f.a)(o.progress);try{for(u.s();!(s=u.n()).done;){var l=s.value;n.push([a,o,l])}}catch(d){u.e(d)}finally{u.f()}}}catch(d){i.e(d)}finally{i.f()}}}catch(d){c.e(d)}finally{c.f()}return n};var pe=function(){var e=Object(r.useState)(),t=Object(l.a)(e,2),n=t[0],a=t[1],i=Object(r.useState)(),s=Object(l.a)(i,2),f=s[0],d=s[1],j=Object(r.useState)(),I=Object(l.a)(j,2),D=I[0],E=I[1],z=Object(r.useState)("dijkstra"),C=Object(l.a)(z,2),F=C[0],A=C[1],P=Oe(),q=ie(d),G=q.routeMapSelector,J=q.mapName,K=Object(r.useState)([]),Q=Object(l.a)(K,2),V=Q[0],X=Q[1],Y=[0],Z=function(e){X((function(t){if(t.length>100)return t;if(e.type===R.Succeed){var n=e.connectionHistory.length+1;n>Y[0]&&(Y[0]=n)}return[].concat(Object(u.a)(t),[e])}))},_=Object(r.useState)(),ce=Object(l.a)(_,2),re=ce[0],ae=ce[1];Object(r.useEffect)((function(){if(f){ae(void 0),X([]),E(void 0),Y[0]=0;var e=function(e,t,n){return function c(r,a){if(0===r.length)return{succeed:!0,netRouteSequence:[],connections:[]};for(var i=0;i<r.length;i++){var s=r[i],o=ee(T(e,s,a),s,n);if(o.succeed){var l=o;t({type:R.Succeed,connectionHistory:a,newConnection:l.connection});var f=c([].concat(Object(u.a)(r.slice(0,i)),Object(u.a)(r.slice(i+1))),[].concat(Object(u.a)(a),[l.connection]));if(f.succeed){var d=f;return{succeed:!0,netRouteSequence:[s].concat(Object(u.a)(d.netRouteSequence)),connections:[l.connection].concat(Object(u.a)(d.connections))}}}else t({type:R.FailNet,connectionHistory:a,failedNet:s})}return t({type:R.FailAll,connectionHistory:a}),{succeed:!1}}(e.nets,[])}(f,Z,"dijkstra"!==F?be:$);if(console.log({maxNetConnections:Y}),e.succeed){var t=e,n=U(f.size,t.connections);a(n)}else a(void 0)}}),[f,F]),Object(r.useEffect)((function(){if(f&&re)switch(re.type){case R.Succeed:var e=re,t=U(f.size,[].concat(Object(u.a)(e.connectionHistory),[e.newConnection]));a(t);break;case R.FailNet:var n=re,c=U(f.size,n.connectionHistory);a(c);break;case R.FailAll:break;default:console.error("should not reach here")}}),[re]);var se=Object(r.useState)(),oe=Object(l.a)(se,2),ue=oe[0],le=oe[1];Object(r.useEffect)((function(){if(f&&re)switch(re.type){case R.Succeed:var e=re,t=new te([]);ne(f,[].concat(Object(u.a)(e.connectionHistory),[e.newConnection]).map((function(e){return e.netID})).map((function(e){return f.nets[e]})),t,"dijkstra"!==F?be:$),le(he(t));break;case R.FailNet:var n=re,c=new te([]);ne(f,[].concat(Object(u.a)(n.connectionHistory.map((function(e){return e.netID})).map((function(e){return f.nets[e]}))),[n.failedNet]),c,"dijkstra"!==F?be:$),le(he(c));break;case R.FailAll:break;default:console.error("should not reach here")}}),[re,F]),Object(r.useEffect)((function(){}),[ue]);var fe=Object(r.useState)(0),de=Object(l.a)(fe,2),je=de[0],ve=de[1];Object(r.useEffect)((function(){if(f&&ue&&void 0!==je){var e=Object(l.a)(ue[je],3),t=e[0],n=e[1],c=e[2],r=t.segmentGrid.map((function(e){return Object(o.a)({},e)}));if(n.sources.forEach((function(e){var n=Object(l.a)(e,2),c=n[0],a=n[1];r.grid[c][a].netId=t.net.netID})),"backtrack"===c.type){var i=c.progress,s=i.segHistory,d=i.newSegment;[].concat(Object(u.a)(s),[d]).forEach((function(e){var n=Object(l.a)(e,2),c=n[0],a=n[1];r.grid[c][a].netId=t.net.netID}))}a(r),"expand"===c.type&&E(new L(f.size,(function(e,t){return{visited:c.progress.visited.grid[e][t],active:c.progress.active.grid[e][t]}})))}}),[je]),Object(r.useEffect)((function(){}),[D]);var pe=ue?Object(c.jsx)(N.a,{onChange:function(e,t){return ve(t)},min:0,max:ue.length-1,marks:!0}):Object(c.jsx)(N.a,{disabled:!0}),ge=Object(c.jsx)(b.a,{children:V.map((function(e,t){return Object(c.jsx)(v.a,{button:!0,onClick:function(){return ae(e)},selected:e===re,children:function(){switch(e.type){case R.Succeed:return Object(c.jsx)(M,{result:e});case R.FailNet:return Object(c.jsx)(W,{result:e});case R.FailAll:return Object(c.jsx)(B,{result:e});default:return"0"}}()},"history ".concat(t))}))});return Object(c.jsxs)("div",{className:P.root,children:[Object(c.jsx)(O.a,{}),Object(c.jsxs)(h.a,{theme:S,children:[Object(c.jsx)(p.a,{position:"fixed",className:P.appBar,children:Object(c.jsxs)(g.a,{children:[Object(c.jsx)(m.a,{variant:"h6",noWrap:!0,children:J}),Object(c.jsx)("div",{style:{flexGrow:1}}),Object(c.jsxs)(y.a,{row:!0,"aria-label":"gender",name:"gender1",value:F,onChange:function(e){return A(e.target.value)},children:[Object(c.jsx)(x.a,{value:"dijkstra",control:Object(c.jsx)(w.a,{}),label:"Lee-Moore"}),Object(c.jsx)(x.a,{value:"aStar",control:Object(c.jsx)(w.a,{}),label:"A*"})]})]})}),Object(c.jsx)(k.a,{open:!0,variant:"permanent",className:P.circuitDrawer,classes:{paper:P.circuitDrawerPaper},children:G}),Object(c.jsxs)("main",{className:P.content,children:[Object(c.jsx)("div",{className:P.toolbar}),Object(c.jsx)("div",{style:{padding:20},children:f?Object(c.jsx)(H,{circuit:f,segments:n,progress:D}):Object(c.jsx)(c.Fragment,{})}),Object(c.jsx)("div",{style:{padding:"0 20px"},children:pe})]}),Object(c.jsx)(k.a,{open:!0,variant:"permanent",className:P.historyDrawer,classes:{paper:P.historyDrawerPaper},anchor:"right",children:ge})]})]})};s.a.render(Object(c.jsx)(a.a.StrictMode,{children:Object(c.jsx)(pe,{})}),document.getElementById("root"))},90:function(e,t,n){},91:function(e,t,n){},92:function(e,t,n){}},[[113,1,2]]]);
//# sourceMappingURL=main.e7478375.chunk.js.map