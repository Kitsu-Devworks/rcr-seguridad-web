(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = matchMedia('(max-width:700px)').matches;
  root.classList.add('js');

  /* Correos armados aquí para que Cloudflare no los oculte en el HTML */
  var P = { rcr: ['rcr.seguridad', 'gmail.com'], dev: ['kitsu.devworks', 'gmail.com'] };
  d.querySelectorAll('a[data-mail]').forEach(function (a) {
    var p = P[a.dataset.mail]; if (!p) return;
    var ad = p.join('@');
    a.href = 'mailto:' + ad + '?subject=' + encodeURIComponent(a.dataset.subject || '');
    var o = a.querySelector('[data-addr]'); if (o) o.textContent = ad;
  });

  /* Cabecera y menú */
  var header = d.getElementById('top');
  var sc = function () { header.classList.toggle('scrolled', window.scrollY > 20); };
  addEventListener('scroll', sc, { passive: true }); sc();
  var burger = d.getElementById('burger'), panel = d.getElementById('panel');
  function menu(o) {
    panel.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', String(o));
    burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu(false); burger.focus(); } });

  /* Videos: versión liviana en celular; el del dron solo corre a la vista */
  var pick = function (v) { return small && v.dataset.m ? v.dataset.m : v.dataset.src; };
  var hero = d.getElementById('vhero'), dron = d.getElementById('vdron');
  if (!reduce) {
    if (hero) { hero.src = pick(hero); hero.play().catch(function () {}); }
    if (dron && 'IntersectionObserver' in window) {
      var loaded = false;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            if (!loaded) { dron.src = pick(dron); loaded = true; }
            dron.play().catch(function () {});
          } else dron.pause();
        });
      }, { threshold: 0.2 }).observe(dron);
    }
  }

  /* Cinta de servicios */
  var tr = d.querySelector('.tr');
  if (tr && !reduce) {
    var c = tr.firstElementChild.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    tr.appendChild(c); tr.classList.add('run');
  }

  /* Revelado al hacer scroll */
  var items = d.querySelectorAll('[data-r]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Carrusel: cambia cada 3 segundos */
  var slides = d.querySelectorAll('#shot img');
  var dots = d.getElementById('dots'), cap = d.getElementById('cap');
  if (slides.length) {
    var cur = 0, timer = null, btns = [];
    var go = function (n) {
      slides[cur].classList.remove('on'); btns[cur].removeAttribute('aria-current');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('on'); btns[cur].setAttribute('aria-current', 'true');
      cap.textContent = (cur + 1) + ' / ' + slides.length;
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var play = function () { stop(); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 3000); };
    slides.forEach(function (_, i) {
      var b = d.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ver imagen ' + (i + 1) + ' de ' + slides.length);
      b.addEventListener('click', function () { go(i); play(); });
      dots.insertBefore(b, cap); btns.push(b);
    });
    btns[0].setAttribute('aria-current', 'true');
    cap.textContent = '1 / ' + slides.length;
    play();
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : play(); });
  }
})();
