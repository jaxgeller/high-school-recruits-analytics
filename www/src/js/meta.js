export default class Meta {
  constructor() {
    this.box         = document.getElementById('meta');
    this.container   = document.querySelector('.chart');
    this.spacing     = 0
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
    if (data.stats) {
      if (data.stats.pts)
        this.stats.ppg.textContent = data.stats.pts.toFixed(1);
      else
        this.stats.ppg.textContent = 'N/A';

      if (data.stats.ast)
        this.stats.apg.textContent = data.stats.ast.toFixed(1);
      else
        this.stats.apg.textContent = 'N/A';

      if (data.stats.reb)
        this.stats.rpg.textContent = data.stats.reb.toFixed(1);
      else
        this.stats.rpg.textContent = 'N/A';
    } else {
      this.stats.ppg.textContent = 'N/A';
      this.stats.apg.textContent = 'N/A';
      this.stats.rpg.textContent = 'N/A';
    }
  }

  set(data) {
    if (data) {
      this.headshot.style.backgroundImage = `url("${data.img || '/images/blank.png'}")`;

      this.name.innerHTML          = data.source.name.replace(' ', '<br/>') || 'N/A';
      this.rank.textContent        = data.source.node - 60;

      this.origin.textContent      = data.origin || 'N/A';
      this.destination.textContent = data.destination || 'N/A';

      if (data.picked > 0)
        this.drafted.textContent     = data.picked ;
      else
        this.drafted.textContent = 'Undrafted'

      if (data.pos)
        this.position.textContent    = data.pos.replace(' ','   / ') || data.pos;
      else
        this.position.textContent    = 'N/A';

      this._setStats(data)
    }
  }
}
