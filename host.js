/* Serin detail page - Artmug host helper (loaded from GitHub Pages by the Artmug snippet) */
(function(){
  /* optional extras: the Artmug snippet itself handles sizing/messages; this file only adds helpers it calls if present */
  if (window.serinHostX) return;
  var f = document.getElementById('serin-frame'); if (!f) return;
  var MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || (window.innerWidth || 1000) < 768;

  function imp(el, p, v){ try { el.style.setProperty(p, v, 'important'); } catch (e) {} }
  function stop(el){ return !el || el === document.body || el === document.documentElement; }
  /* the iframe always gets exactly the page height (some mobile skins cap iframe heights) */
  imp(f, 'display', 'block'); imp(f, 'width', '100%'); imp(f, 'max-width', '100%');
  imp(f, 'max-height', 'none'); imp(f, 'min-height', '0'); imp(f, 'border', '0');
  try { f.setAttribute('scrolling', 'no'); } catch (e) {}

  /* a small scroll box around the detail traps finger scrolling on phones: let the whole page scroll instead */
  function unbox(){
    var vh = window.innerHeight || 800;
    var docScrolls = document.documentElement.scrollHeight > vh + 2;
    for (var el = f.parentElement; !stop(el); el = el.parentElement){
      var cs = getComputedStyle(el);
      var mainScroller = el.clientHeight >= vh * 0.95 && !docScrolls;
      if (/(auto|scroll)/.test(cs.overflowY + ' ' + cs.overflowX) && el.clientHeight > 0 && !mainScroller && el.scrollHeight > el.clientHeight + 4){
        imp(el, 'overflow', 'visible'); imp(el, 'max-height', 'none'); imp(el, 'height', 'auto');
      }
    }
  }
  function scroller(){
    for (var el = f.parentElement; !stop(el); el = el.parentElement){
      var cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
    }
    return null;
  }
  function scrollToY(top){
    var d = f.getBoundingClientRect().top + (top || 0) - (MOBILE ? 64 : 20);
    var sc = scroller();
    try { (sc || window).scrollBy({ top: d, behavior: 'smooth' }); }
    catch (e) { if (sc) sc.scrollTop += d; else window.scrollBy(0, d); }
  }

  /* inquiry: find the site's own "ask the artist" button (PC: onclick qna_write / mobile: link or other markup) */
  var T_ASK = '작가에게', T_INQ = '문의';       /* (artist) (inquiry) */
  var T_INQ_DO = '문의하기';                            /* (make an inquiry) */
  function txt(el){ return (el.innerText || el.textContent || el.value || '').replace(/\s+/g, '').trim(); }
  function vis(el){ return !!(el.offsetWidth || el.offsetHeight || (el.getClientRects && el.getClientRects().length)); }
  function findAsk(){
    var all = document.querySelectorAll('a, button, input[type=button], input[type=submit], [onclick], [role=button], p, li, span, div');
    var best = null, bs = 0;
    for (var i = 0; i < all.length; i++){
      var el = all[i];
      if (el === f || el.contains(f) || el.closest('#serin-frame')) continue;
      var act = (el.getAttribute('onclick') || '') + ' ' + (el.getAttribute('href') || '');
      if (/qna_(view|read|del|modify|reply|list)/i.test(act)) continue;
      var t = txt(el); if (t.length > 30) t = '';
      var s = 0;
      if (/qna_?write|qnawrite|qna_form/i.test(act)) s += 100;
      else if (/qna|inquiry/i.test(act)) s += 45;
      if (t.indexOf(T_ASK + T_INQ) >= 0) s += 50;
      else if (t.indexOf(T_INQ_DO) >= 0) s += 30;
      if (!s) continue;
      if (!act.trim() && el.tagName !== 'BUTTON') s -= 25;
      if (vis(el)) s += 15;
      if (s > bs){ bs = s; best = el; }
    }
    return bs >= 40 ? best : null;
  }
  function ask(){
    var b = findAsk();
    if (b){ try { b.click(); return; } catch (e) {} }
    var q = document.getElementById('cont_qna') || document.getElementById('ankerQ');
    if (q){ try { q.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { q.scrollIntoView(); } }
  }
  window.serinHostX = { unbox: unbox, ask: ask, scrollTo: scrollToY };
  window.addEventListener('resize', unbox);
  unbox(); setTimeout(unbox, 1500); setTimeout(unbox, 4000);
})();
