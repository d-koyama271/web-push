import{_ as s,v as c,x as i,t as a}from"./Ct8AHRs6.js";const r={class:"container"},l={__name:"index",setup(d){const o=async()=>{if(!("Notification"in window)){alert("このブラウザは通知に対応していません。");return}const t=await Notification.requestPermission();alert(t==="granted"?"通知が許可されました。":"通知が拒否されました。")},e=()=>{if(Notification.permission==="granted"){const t="icons/icon-192x192.png";new Notification("こんにちは！これはテスト通知です。",{body:"これはデモの通知メッセージです。",icon:t})}else alert("通知の許可が必要です。")};return(t,n)=>(a(),c("div",r,[n[0]||(n[0]=i("h1",null,"Web通知デモ",-1)),i("button",{onClick:o},"通知を許可"),i("button",{onClick:e},"通知を送信")]))}},_=s(l,[["__scopeId","data-v-c94c94ee"]]);export{_ as default};
