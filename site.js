'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-links');
document.documentElement.classList.add('menu-ready');
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开菜单');
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.nav-bar')) closeMenu(); });
let toastTimer;
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.querySelector('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('3536689119@qq.com'); notify('邮箱已复制，期待你的来信。'); }
  catch { notify('请长按或选中邮箱复制：3536689119@qq.com'); }
});

// Keep the mascot in the visible window while it is being moved.
const mascot = document.querySelector('.hero-mascot');
let mascotX = 0;
let mascotY = 0;
let drag = null;
let suppressWaveUntil = 0;
let lastTouchTap = null;
let waveTimer = null;

function waveHello() {
  if (mascot.classList.contains('is-waving')) return;
  mascot.classList.add('is-waving');
  clearTimeout(waveTimer);
  waveTimer = setTimeout(() => mascot.classList.remove('is-waving'), 1200);
}

mascot.addEventListener('dblclick', event => {
  event.preventDefault();
  if (performance.now() >= suppressWaveUntil) waveHello();
});

function setMascotPosition(x, y) {
  mascotX = x;
  mascotY = y;
  mascot.style.setProperty('--mascot-x', `${x}px`);
  mascot.style.setProperty('--mascot-y', `${y}px`);
}

function boundedMovement(dx, dy, rect) {
  return {
    x: Math.max(-rect.left, Math.min(dx, window.innerWidth - rect.right)),
    y: Math.max(-rect.top, Math.min(dy, window.innerHeight - rect.bottom))
  };
}

mascot.addEventListener('pointerdown', event => {
  if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
  event.preventDefault();
  drag = {
    id: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: mascotX,
    originY: mascotY,
    moved: false,
    rect: mascot.getBoundingClientRect()
  };
  mascot.setPointerCapture(event.pointerId);
  mascot.classList.add('dragging');
});

mascot.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6) drag.moved = true;
  const movement = boundedMovement(event.clientX - drag.startX, event.clientY - drag.startY, drag.rect);
  setMascotPosition(drag.originX + movement.x, drag.originY + movement.y);
});

function stopDragging(event) {
  if (!drag || event.pointerId !== drag.id) return;
  if (drag.moved) {
    suppressWaveUntil = performance.now() + 400;
    lastTouchTap = null;
  } else if (event.type === 'pointerup' && event.pointerType !== 'mouse') {
    const now = performance.now();
    if (lastTouchTap && now - lastTouchTap.time <= 400 &&
        Math.hypot(event.clientX - lastTouchTap.x, event.clientY - lastTouchTap.y) <= 30) {
      waveHello();
      lastTouchTap = null;
    } else {
      lastTouchTap = { time: now, x: event.clientX, y: event.clientY };
    }
  }
  drag = null;
  mascot.classList.remove('dragging');
}
mascot.addEventListener('pointerup', stopDragging);
mascot.addEventListener('pointercancel', stopDragging);
mascot.addEventListener('lostpointercapture', stopDragging);

mascot.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    waveHello();
    return;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    setMascotPosition(0, 0);
    return;
  }
  const step = event.shiftKey ? 30 : 10;
  const keys = {
    ArrowLeft: [-step, 0], ArrowRight: [step, 0],
    ArrowUp: [0, -step], ArrowDown: [0, step]
  };
  const direction = keys[event.key];
  if (!direction) return;
  event.preventDefault();
  const movement = boundedMovement(direction[0], direction[1], mascot.getBoundingClientRect());
  setMascotPosition(mascotX + movement.x, mascotY + movement.y);
});
