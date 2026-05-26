async function loadPartials() {
  const headerSlot = document.querySelector('#header-slot');
  const footerSlot = document.querySelector('#footer-slot');

  if (headerSlot) {
    const header = await fetch('/components/header.html').then((res) => res.text());
    headerSlot.innerHTML = header;
  }

  if (footerSlot) {
    const footer = await fetch('/components/footer.html').then((res) => res.text());
    footerSlot.innerHTML = footer;
  }

  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new Event('layoutLoaded'));
}

loadPartials();
