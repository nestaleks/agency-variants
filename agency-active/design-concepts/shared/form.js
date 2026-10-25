/*
 * Accessible enquiry form for all concepts (static hosting — no backend).
 * Markup contract:
 *   <form data-tid-form novalidate> … <input id="x" required> <p id="x-error" class="…" hidden></p> …
 *   <p data-form-status role="status" aria-live="polite"></p>
 * Optional <select data-project-select> is filled with project names.
 * On valid submit, opens a pre-filled email to office@tidgroup.es (DECISIONS.md D5).
 */
(function () {
  var MESSAGES = {
    valueMissing: 'Please fill in this field.',
    typeMismatch: 'Please enter a valid email address.',
    patternMismatch: 'Please use digits, spaces and an optional leading +.',
    consent: 'Please confirm so that we can reply to you.'
  };

  function errorFor(field) {
    if (field.validity.valid) return '';
    if (field.type === 'checkbox') return MESSAGES.consent;
    if (field.validity.valueMissing) return MESSAGES.valueMissing;
    if (field.validity.typeMismatch) return MESSAGES.typeMismatch;
    if (field.validity.patternMismatch) return MESSAGES.patternMismatch;
    return MESSAGES.valueMissing;
  }

  function show(field) {
    var msg = errorFor(field);
    var el = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (!el) return !msg;
    el.textContent = msg;
    el.hidden = !msg;
    if (msg) field.setAttribute('aria-describedby', el.id);
    else field.removeAttribute('aria-describedby');
    return !msg;
  }

  function init(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea')).filter(function (f) { return f.id; });
    var status = form.querySelector('[data-form-status]');

    var select = form.querySelector('[data-project-select]');
    if (select && window.TID) {
      TID.projects.filter(function (p) { return p.status !== 'sold'; }).forEach(function (p) {
        var o = document.createElement('option');
        o.value = p.name; o.textContent = p.name + ' — ' + p.area;
        select.appendChild(o);
      });
    }

    fields.forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value || f.getAttribute('aria-invalid')) show(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') show(f); });
      f.addEventListener('change', function () { if (f.type === 'checkbox') show(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      fields.forEach(function (f) { if (!show(f) && !firstInvalid) firstInvalid = f; });
      if (firstInvalid) {
        firstInvalid.focus();
        if (status) status.textContent = 'Please check the highlighted fields.';
        form.classList.add('is-invalid');
        return;
      }
      form.classList.remove('is-invalid');
      var data = {};
      fields.forEach(function (f) { data[f.name || f.id] = f.type === 'checkbox' ? (f.checked ? 'yes' : 'no') : f.value.trim(); });
      var subject = 'Website enquiry' + (data.interest ? ' — ' + data.interest : '');
      var body = [
        'Name: ' + (data.name || ''),
        'Email: ' + (data.email || ''),
        'Phone: ' + (data.phone || ''),
        'Interest: ' + (data.interest || ''),
        '',
        data.message || ''
      ].join('\n');
      var to = form.getAttribute('data-to') || 'office@tidgroup.es';
      if (status) status.textContent = 'Thank you, ' + (data.name || '') + '. Your email app will open with the message ready to send to ' + to + '.';
      form.classList.add('is-sent');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tid-form]'), init);
  });
})();
