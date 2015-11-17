let meta = document.getElementById('meta');
let viz = document.querySelector('.visualization');

window.addEventListener('scroll', function() {
  let top = window.scrollY;
  let rect = viz.getBoundingClientRect();

  if (rect.top < 0)
    meta.style.position = 'fixed'
  if (rect.top > 0 )
    meta.style.position = 'absolute'
});
