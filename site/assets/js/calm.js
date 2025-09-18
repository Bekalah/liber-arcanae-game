// Calm Mode toggles reduced motion; ND-safe defaults to the system preference.
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.documentElement.classList.add('reduced-motion');
}

document.getElementById('calmToggle')?.addEventListener('click', () => {
  const active = document.documentElement.classList.toggle('reduced-motion');
  document.getElementById('calmToggle').setAttribute('aria-pressed', String(active));
});
