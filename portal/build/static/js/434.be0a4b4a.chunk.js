"use strict";(self.webpackChunkAmtech=self.webpackChunkAmtech||[]).push([[434],{9434:(e,t,n)=>{n.r(t),n.d(t,{Geolocation:()=>i,GeolocationWeb:()=>a});var o=n(6653);class a extends o.Uw{async getCurrentPosition(e){return new Promise(((t,n)=>{navigator.geolocation.getCurrentPosition((e=>{t(e)}),(e=>{n(e)}),Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},e))}))}async watchPosition(e,t){const n=navigator.geolocation.watchPosition((e=>{t(e)}),(e=>{t(null,e)}),Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},e));return"".concat(n)}async clearWatch(e){window.navigator.geolocation.clearWatch(parseInt(e.id,10))}async checkPermissions(){if("undefined"===typeof navigator||!navigator.permissions)throw this.unavailable("Permissions API not available in this browser");const e=await window.navigator.permissions.query({name:"geolocation"});return{location:e.state,coarseLocation:e.state}}async requestPermissions(){throw this.unimplemented("Not implemented on web.")}}const i=new a}}]);
//# sourceMappingURL=434.be0a4b4a.chunk.js.map