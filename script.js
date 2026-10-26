'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const language = document.querySelector('#language');
const status = document.querySelector('#form-status');
const lookup = (object, key) => key.split('.').reduce((value, part) => value?.[part], object);
let translations = {};
let languageRequest = 0;
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
async function loadLanguage(code) {
  const request = ++languageRequest;
  const previous = document.documentElement.lang;
  try {
    if (!['en', 'de'].includes(code)) code = 'de';
    const response = await fetch(`lang/${code}.json`);
    if (!response.ok) throw new Error('Language file unavailable');
    const next = await response.json();
    if (request !== languageRequest) return;
    translations = next;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = lookup(next, element.dataset.i18n);
      if (typeof value === 'string') element.textContent = value;
    });
    document.documentElement.lang = code;
    document.title = document.body.dataset.page === 'quote' ? `${next.nav.quote} — MAJA Gebäudereinigung` : `Maja Gebäudereinigung — ${next.hero.subtitle}`;
    language.value = code;
    if (status) status.textContent = '';
    document.dispatchEvent(new CustomEvent('languagechange'));
  } catch (error) {
    if (request !== languageRequest) return;
    language.value = previous;
    if (status) status.textContent = 'The selected language could not be loaded. Please try again.';
    console.warn(error);
  }
}
language.addEventListener('change', event => loadLanguage(event.target.value));
loadLanguage('de');
function replay() {
  for (const element of document.querySelectorAll('.name-reveal, .hero-art')) {
    element.classList.remove('cleaning');
    void element.offsetWidth;
    element.classList.add('cleaning');
  }
}
document.querySelector('#replay')?.addEventListener('click', replay);
replay();
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service').value = link.dataset.service;
}));
document.querySelector('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const service = document.querySelector('#service');
  const selected = service.value ? service.options[service.selectedIndex].textContent : '';
  const heading = lookup(translations, 'form.preview') || 'Preview only — nothing has been sent.';
  status.textContent = `${heading}\n${data.get('name')} · ${data.get('email')}${selected ? ` · ${selected}` : ''}\n${data.get('message')}`;
});


const tr = key => lookup(translations, key) ?? lookup(defaultSectionCopy, key) ?? key;
const defaultSectionCopy = { gallery: { prev: 'Vorheriges Bild', next: 'Nächstes Bild', position: 'Bild {current} von {total}' } };
