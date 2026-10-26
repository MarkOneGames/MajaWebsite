const quoteForm = document.querySelector('#quote-form');
const quoteSummary = document.querySelector('#quote-summary');
const serviceInputs = [...quoteForm.querySelectorAll('[name="services"]')];
let reviewedData = null;
const chosenServices = () => serviceInputs.filter(input => input.checked).map(input => input.value);
function updateQuoteFields() {
  const chosen = chosenServices();
  for (const [field, show] of Object.entries({ area: chosen.some(value => value !== 'windows'), windows: chosen.includes('windows'), floors: chosen.includes('building') })) {
    const wrapper = quoteForm.querySelector(`[data-quote-field="${field}"]`);
    wrapper.hidden = !show;
    const input = wrapper.querySelector('input');
    input.disabled = !show;
    input.required = show;
  }
  document.querySelector('#quote-error').textContent = '';
}
serviceInputs.forEach(input => input.addEventListener('change', updateQuoteFields));
function renderQuoteSummary() {
  if (!reviewedData) return;
  const rows = [[tr('quote.services'), reviewedData.services.map(value => tr(`services.${value}.title`)).join(', ')]];
  const labels = ['property','location','area','windows','floors','frequency','date','notes','name','email','phone'];
  labels.forEach(key => {
    let value = reviewedData[key];
    if (!value) return;
    if (key === 'property' || key === 'frequency') value = tr(`quote.${value}`);
    if (key === 'area') value += ' m²';
    rows.push([tr(`quote.${key}`), value]);
  });
  const list = document.querySelector('#quote-summary-list');
  list.replaceChildren();
  rows.forEach(([label, value]) => { const term = document.createElement('dt'); term.textContent = label; const detail = document.createElement('dd'); detail.textContent = value; list.append(term, detail); });
  const body = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  document.querySelector('#quote-email').href = `mailto:majagebnet@gmail.com?subject=${encodeURIComponent(tr('quote.emailSubject'))}&body=${encodeURIComponent(body)}`;
}
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  const services = chosenServices();
  if (!services.length) { document.querySelector('#quote-error').textContent = tr('quote.choose'); serviceInputs[0].focus(); return; }
  reviewedData = { ...Object.fromEntries(new FormData(quoteForm)), services };
  renderQuoteSummary();
  quoteForm.hidden = true;
  quoteSummary.hidden = false;
  quoteSummary.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.querySelector('#quote-email').focus({ preventScroll: true });
});
document.querySelector('#quote-edit').addEventListener('click', () => { quoteSummary.hidden = true; quoteForm.hidden = false; serviceInputs[0].focus(); });
updateQuoteFields();

document.addEventListener('languagechange', renderQuoteSummary);
