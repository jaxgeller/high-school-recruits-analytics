export default class Meta {
  constructor() {
    this.box         = document.getElementById('meta');
    this.container   = document.querySelector('.visualization');
    this.spacing     = 20
    this.ticking     = false;

    this.headshot    = document.querySelector('.meta-headshot');
    this.name        = document.querySelector('.meta-player-name');
    this.rank        = document.getElementById('rank');
    this.drafted     = document.getElementById('drafted');
    this.origin      = document.getElementById('origin');
    this.destination = document.getElementById('destination');
    this.position    = document.getElementById('pos');
    this.stats       = {
      ppg: document.getElementById('ppg'),
      apg: document.getElementById('apg'),
      rpg: document.getElementById('rpg')
    }

    this._update();
    window.addEventListener('scroll', this.onscroll.bind(this));
  }

  onscroll() {
    if(!this.ticking) {
      requestAnimationFrame(this._update.bind(this));
      this.ticking = true;
    }
  }

  _update() {
    let top = window.scrollY;
    let rect = this.container.getBoundingClientRect();

    if (rect.top < this.spacing) this.box.style.position = 'fixed'
    if (rect.top > this.spacing ) this.box.style.position = 'absolute'

    this.ticking = false;
  }

  _setStats(data) {
    this.stats.ppg.textContent = data.stats.pts.toFixed(1) || 'N/A';
    this.stats.apg.textContent = data.stats.reb.toFixed(1) || 'N/A';
    this.stats.rpg.textContent = data.stats.ast.toFixed(1) || 'N/A';
  }

  set(data) {
    this.headshot.style.backgroundImage = `url("${data.img}")`;
    this._setStats(data)

    this.name.innerHTML          = data.source.name.replace(' ', '<br/>');
    this.rank.textContent        = data.source.node - 60;
    this.drafted.textContent     = data.picked || 'N/A';
    this.origin.textContent      = data.origin || '';
    this.destination.textContent = data.destination || '';
    this.position.textContent    = data.pos.replace(' ','   / ') || '';
  }
}
