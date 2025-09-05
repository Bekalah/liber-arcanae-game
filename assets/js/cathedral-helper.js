// DOM helper utilities
window.Q = q => document.querySelector(q);
window.T = (q,v) => { const el = Q(q); if (el) el.textContent = v || ''; };
