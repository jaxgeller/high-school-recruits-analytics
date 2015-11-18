let meta = document.getElementById('meta');
let viz = document.querySelector('.visualization');

window.addEventListener('scroll', function() {
  let top = window.scrollY;
  let rect = viz.getBoundingClientRect();

  if (rect.top < 20)
    meta.style.position = 'fixed'
  if (rect.top > 20 )
    meta.style.position = 'absolute'
});




// class Meta() {
//   constructor() {
//     this.headshot = document.querySelector('.meta-headshot');
//     this.name = document.querySelector('.meta-player-name');
//     this.ppg = document.getElementById('ppg');
//     this.apg = document.getElementById('apg');
//     this.rpg = document.getElementById('rpg');
//   }
// }

// document.querySelector('.meta-headshot').style.backgroundImage = `url("${data.img}")`;
// document.querySelector('.meta-player-name').innerHTML = data.source.name.replace(' ', '<br/>');
// document.getElementById('ppg').textContent = data.stats.pts || 'N/A';
// document.getElementById('rpg').textContent = data.stats.reb || 'N/A';
// document.getElementById('apg').textContent = data.stats.ast || 'N/A';
// document.getElementById('rank').textContent = data.source.node - 60;
// document.getElementById('drafted').textContent = data.picked || '';
// document.getElementById('origin').textContent = data.origin || '';
// document.getElementById('destination').textContent = data.destination || '';
// document.getElementById('pos').textContent = data.pos || '';

// export default function setData(data) {

// }
