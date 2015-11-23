import Jumper from './jumper';
import Chart from './chart';

let initDraw = 2010;

// Draw init chart
let chart = new Chart();
chart.draw(initDraw);

// Add jump handler
let jumper = new Jumper();
document.querySelector('.down-button').addEventListener('click', ()=> {
  jumper.jump(document.querySelector('.content'));
});

// Add button clicks to redraw chart
let buttons = Array.prototype.slice.call(document.querySelectorAll('.toggle-year'));
buttons.forEach(button=> {
  button.addEventListener('click', function() {

    if (this.textContent != initDraw) {
      buttons.forEach(b=>b.classList.remove('active'))
      document.getElementById('chart-wrapper').innerHTML = '';
      button.classList.add('active');
      chart.draw(this.textContent)
      initDraw = this.textContent;
    }
  });
});
