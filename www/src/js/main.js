import Jumper from './jumper';
import Chart from './chart';

// Draw init chart
let chart = new Chart();
chart.draw(2010);

// Add jump handler
let jumper = new Jumper();
document.querySelector('.down-button').addEventListener('click', ()=> {
  jumper.jump(document.querySelector('.content'));
});

// Add button clicks to redraw chart
[].slice.call(document.querySelectorAll('button')).forEach(button=> {
  button.addEventListener('click', function() {
    document.getElementById('chart-wrapper').innerHTML = ''
    chart.draw(this.textContent)
  });
});
