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
