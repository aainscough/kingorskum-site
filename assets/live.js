(function(){
  var fmt=function(n){return Math.round(n).toLocaleString('en-US')};
  function show(d){
    if(!d)return;
    var lim=d.like1000Limit||1000,left=Math.max(0,d.like1000Left==null?lim:d.like1000Left);
    document.getElementById('likeLeft').textContent=fmt(left);
    document.getElementById('likeBar').style.width=(left/lim*100)+'%';
    if(left<=0){document.getElementById('likeLive').textContent='all claimed';}
    var v=d.visits||0,ms=d.milestones||[100000,500000,1000000],next=null,prev=0;
    for(var i=0;i<ms.length;i++){if(v<ms[i]){next=ms[i];break}prev=ms[i]}
    document.getElementById('visits').textContent=fmt(v);
    document.getElementById('visitBar').style.width=(next?Math.max(1,(v-prev)/(next-prev)*100):100)+'%';
    document.getElementById('visitNext').textContent=next?(fmt(next-v)+' visits to go until the next reward unlocks at '+fmt(next)):'Every milestone reward is unlocked!';
    if(d.updated){var m=Math.max(0,Math.round((Date.now()/1000-d.updated)/60));document.getElementById('likeLive').textContent=left<=0?'all claimed':('live · updated '+(m<1?'just now':m+' min ago'));}
  }
  function load(){
    fetch('https://api.github.com/repos/aainscough/kos-live/contents/live.json',{headers:{Accept:'application/vnd.github.raw+json'}})
      .then(function(r){if(!r.ok)throw 0;return r.json()})
      .catch(function(){return fetch('https://raw.githubusercontent.com/aainscough/kos-live/main/live.json').then(function(r){return r.json()})})
      .then(show).catch(function(){});
  }
  load();setInterval(load,120000);
})();
