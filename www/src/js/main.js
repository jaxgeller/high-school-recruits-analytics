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
let buttons = Array.prototype.slice.call(document.querySelectorAll('.toggle-year'))
buttons.forEach(button=> {
  button.addEventListener('click', function() {
    buttons.forEach(b=>b.classList.remove('active'))
    document.getElementById('chart-wrapper').innerHTML = '';
    button.classList.add('active');
    chart.draw(this.textContent)
  });
});
