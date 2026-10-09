/* Orienta IF — versão HTML puro (sem React, sem build).
   Abra vanilla/index.html com duplo clique.
   Se o backend estiver rodando (http://localhost:3001), grava e lê do SQLite.
   Sem backend, funciona em modo demonstrativo local. */
(function () {
  'use strict';

  // ---------- Dados (mesmos do mockData.ts) ----------
  var CRITERIA = [
    { id: 'clarity', label: 'Clareza nas explicações', shortLabel: 'Clareza' },
    { id: 'organization', label: 'Organização das aulas', shortLabel: 'Organização' },
    { id: 'knowledge', label: 'Domínio do conteúdo', shortLabel: 'Conteúdo' },
    { id: 'assessment', label: 'Clareza dos critérios de avaliação', shortLabel: 'Critérios' },
    { id: 'feedback', label: 'Qualidade do feedback', shortLabel: 'Feedback' },
    { id: 'communication', label: 'Comunicação com os estudantes', shortLabel: 'Comunicação' },
    { id: 'participation', label: 'Estímulo à participação', shortLabel: 'Participação' }
  ];
  var FIELDS = [
    { id: 'studentName', label: 'Nome do estudante' },
    { id: 'course', label: 'Curso' },
    { id: 'classGroup', label: 'Turma' },
    { id: 'teacher', label: 'Professor avaliado' },
    { id: 'subject', label: 'Disciplina' }
  ];
  var RATING_LABELS = ['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'];
  var MOCK_MEDIAS = [
    { label: 'Clareza', value: 3.1 }, { label: 'Organização', value: 3.4 },
    { label: 'Conteúdo', value: 4.2 }, { label: 'Critérios', value: 2.8 },
    { label: 'Feedback', value: 3.0 }, { label: 'Comunicação', value: 3.2 },
    { label: 'Participação', value: 3.7 }
  ];
  var MOCK_DIST = [
    { rating: '1', label: 'Muito ruim', value: 6 }, { rating: '2', label: 'Ruim', value: 13 },
    { rating: '3', label: 'Regular', value: 30 }, { rating: '4', label: 'Bom', value: 34 },
    { rating: '5', label: 'Excelente', value: 17 }
  ];
  var NEEDS = [
    { title: 'Clareza dos critérios de avaliação', description: 'Parte das respostas fictícias aponta dificuldade para compreender como as atividades são avaliadas.', responses: 31, priority: 'Alta' },
    { title: 'Organização das atividades', description: 'Os dados demonstrativos sugerem oportunidade de tornar a sequência de tarefas mais previsível.', responses: 24, priority: 'Média' },
    { title: 'Comunicação com os estudantes', description: 'Há sinais agregados fictícios de que canais, prazos e devolutivas podem ficar mais claros.', responses: 18, priority: 'Em acompanhamento' }
  ];
  var RECS = [
    { id: 1, need: 'Melhorar a clareza dos critérios de avaliação', evidence: 'Parte das respostas demonstrativas indica dificuldades para compreender os critérios utilizados nas atividades.', recommendation: 'Avaliar a adoção de rubricas com critérios explícitos e exemplos de diferentes níveis de desempenho.', rationale: 'Uma referência compartilhada pode apoiar a transparência do processo e orientar a preparação dos estudantes.', indicator: 'Percentual de estudantes que afirmam compreender os critérios de avaliação.', review: 'Aguardando revisão humana', tone: 'pending' },
    { id: 2, need: 'Tornar a organização das atividades mais previsível', evidence: 'As respostas agregadas simuladas indicam variação na percepção sobre a sequência e os prazos das atividades.', recommendation: 'Testar uma visão semanal com objetivos, entregas e materiais necessários para cada encontro.', rationale: 'Uma cadência visível facilita o acompanhamento e cria um ponto de partida para ajustes pedagógicos.', indicator: 'Percentual de estudantes que relatam conhecer as próximas atividades da disciplina.', review: 'Em revisão pedagógica', tone: 'review' },
    { id: 3, need: 'Fortalecer a qualidade das devolutivas', evidence: 'Há uma oportunidade demonstrativa de tornar os retornos sobre atividades mais acionáveis para os estudantes.', recommendation: 'Definir momentos de feedback com indicação de avanços, próximos passos e espaço para dúvidas.', rationale: 'Devolutivas estruturadas podem apoiar a aprendizagem contínua sem reduzir a autonomia docente.', indicator: 'Percentual de estudantes que consideram o feedback útil para melhorar.', review: 'Acompanhamento sugerido', tone: 'followup' }
  ];
  var MEDIA_LABEL = { clarity: 'Clareza', organization: 'Organização', knowledge: 'Conteúdo', assessment: 'Critérios', feedback: 'Feedback', communication: 'Comunicação', participation: 'Participação' };
  var DIST_LABEL = { 1: 'Muito ruim', 2: 'Ruim', 3: 'Regular', 4: 'Bom', 5: 'Excelente' };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- Tema ----------
  var themeBtn = $('#theme-toggle');
  function currentTheme() { return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'; }
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
    try { window.localStorage.setItem('orienta-theme', t); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#090B09' : '#F5F7F0');
    $('#theme-icon').textContent = t === 'dark' ? '☀' : '☾';
    $('#theme-label').textContent = t === 'dark' ? 'Claro' : 'Escuro';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  }
  applyTheme(currentTheme());
  themeBtn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  // ---------- Menu mobile ----------
  var menuBtn = $('#menu-toggle'), mobileNav = $('#mobile-menu');
  menuBtn.addEventListener('click', function () {
    var open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileNav.hidden) { mobileNav.hidden = true; menuBtn.focus(); }
  });

  // ---------- Rotas (hash, funciona em file://) ----------
  var ROUTES = ['home', 'evaluation', 'about', 'dashboard', 'recommendations'];
  function routeFromHash() {
    var h = (location.hash || '#/').replace('#/', '').replace('#', '');
    return ROUTES.indexOf(h) !== -1 ? h : 'home';
  }
  function render(route) {
    $all('[data-view]').forEach(function (v) { v.hidden = v.getAttribute('data-view') !== route; });
    $all('[data-route]').forEach(function (b) {
      var on = b.getAttribute('data-route') === route;
      b.classList.toggle('is-active', on);
      if (b.classList.contains('nav-link') && on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    mobileNav.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
    if (route === 'dashboard') carregarDashboard();
    if (route === 'evaluation') resetEvalParaFormulario();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-route]');
    if (!b) return;
    location.hash = '#/' + b.getAttribute('data-route');
  });
  window.addEventListener('hashchange', function () { render(routeFromHash()); });
  if (!location.hash) location.hash = '#/';

  // ---------- API com fallback ----------
  function apiBase() {
    if (location.protocol.indexOf('http') === 0) return ''; // mesma origem (dev :3000 ou portátil :3001)
    return 'http://localhost:3001'; // file:// -> tenta backend local
  }
  function apiGet(path, cb) {
    fetch(apiBase() + path).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) { cb(null, d); }).catch(function (err) {
      if (!apiBase()) { // mesma origem falhou (ex.: preview estático), tenta localhost direto
        fetch('http://localhost:3001' + path).then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.json();
        }).then(function (d) { cb(null, d); }).catch(function (e2) { cb(e2); });
      } else cb(err);
    });
  }
  function apiPost(path, body, cb) {
    var triedLocal = false;
    function attempt(base) {
      fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.json();
        }).then(function (d) { cb(null, d); }).catch(function (err) {
          if (!triedLocal && !base) { triedLocal = true; attempt('http://localhost:3001'); }
          else cb(err);
        });
    }
    attempt(apiBase());
  }

  // ---------- Avaliação (3 etapas) ----------
  var evalState = { step: 1, maxStep: 1, ratings: {}, submitted: false, sending: false, offline: false };
  var form = $('#eval-form'), ratingList = $('#rating-list');
  var TITLES = { 1: 'Vamos começar.', 2: 'Sua experiência importa.', 3: 'Revise sua avaliação.' };

  CRITERIA.forEach(function (c) {
    var fs = document.createElement('fieldset');
    fs.className = 'rating-row';
    fs.dataset.criterion = c.id;
    var legend = document.createElement('legend');
    legend.textContent = c.label;
    fs.appendChild(legend);
    var ctrls = document.createElement('div');
    ctrls.className = 'rating-controls';
    ctrls.setAttribute('role', 'radiogroup');
    ctrls.setAttribute('aria-label', c.label);
    for (var v = 1; v <= 5; v++) {
      (function (val) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rating-button';
        b.dataset.rating = String(val);
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', 'false');
        b.setAttribute('aria-label', val + ' — ' + RATING_LABELS[val]);
        b.tabIndex = val === 1 ? 0 : -1;
        b.innerHTML = '<strong>' + val + '</strong><span>' + RATING_LABELS[val] + '</span>';
        b.addEventListener('click', function () { selectRating(c.id, val); });
        b.addEventListener('keydown', function (e) {
          var cur = val, next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = cur === 5 ? 1 : cur + 1;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = cur === 1 ? 5 : cur - 1;
          else if (e.key === 'Home') next = 1;
          else if (e.key === 'End') next = 5;
          if (next) {
            e.preventDefault();
            selectRating(c.id, next);
            var nb = ctrls.querySelector('button[data-rating="' + next + '"]');
            if (nb) nb.focus();
          }
        });
        ctrls.appendChild(b);
      })(v);
    }
    var sel = document.createElement('div');
    sel.className = 'rating-selection';
    sel.setAttribute('aria-live', 'polite');
    sel.textContent = 'Selecione uma nota';
    var err = document.createElement('p');
    err.className = 'field-error';
    err.hidden = true;
    fs.appendChild(ctrls); fs.appendChild(sel); fs.appendChild(err);
    ratingList.appendChild(fs);
  });

  function fieldVal(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; }
  function showFieldError(inputId, msg) {
    var p = document.querySelector('[data-error-for="' + inputId + '"]');
    var input = document.getElementById(inputId);
    if (!p) return;
    if (msg) { p.textContent = '⚠ ' + msg; p.hidden = false; if (input) input.setAttribute('aria-invalid', 'true'); }
    else { p.hidden = true; if (input) input.removeAttribute('aria-invalid'); }
  }
  function selectRating(id, val) {
    evalState.ratings[id] = val;
    var fs = ratingList.querySelector('fieldset[data-criterion="' + id + '"]');
    $all('.rating-button', fs).forEach(function (b) {
      var on = Number(b.dataset.rating) === val;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $('.rating-selection', fs).innerHTML = '✓ Selecionado: <strong>' + val + ' — ' + RATING_LABELS[val] + '</strong>';
    var err = $('.field-error', fs);
    if (err) err.hidden = true;
    fs.classList.remove('has-error');
  }

  function validateStep(n) {
    var ok = true;
    if (n === 1) {
      [['f-studentName', 'nome do estudante'], ['f-course', 'curso'], ['f-classGroup', 'turma'], ['f-teacher', 'professor avaliado'], ['f-subject', 'disciplina']].forEach(function (pair) {
        var el = document.getElementById(pair[0]);
        if (!el.value.trim()) { showFieldError(pair[0], 'Informe ' + pair[1] + '.'); ok = false; }
        else showFieldError(pair[0], '');
      });
    }
    if (n === 2) {
      CRITERIA.forEach(function (c) {
        var fs = ratingList.querySelector('fieldset[data-criterion="' + c.id + '"]');
        var err = $('.field-error', fs);
        if (!evalState.ratings[c.id]) {
          fs.classList.add('has-error');
          if (err) { err.textContent = '⚠ Selecione uma nota de 1 a 5.'; err.hidden = false; }
          ok = false;
        }
      });
    }
    if (n === 3 && !$('#f-privacy').checked) {
      var pe = $('#privacy-error');
      pe.textContent = '⚠ Confirme que leu o aviso de privacidade para enviar a demonstração.';
      pe.hidden = false;
      ok = false;
    } else { $('#privacy-error').hidden = true; }
    return ok;
  }

  function goStep(n) {
    evalState.step = n;
    evalState.maxStep = Math.max(evalState.maxStep, n);
    $all('.step-content').forEach(function (s) { s.hidden = Number(s.dataset.step) !== n; });
    $('#eval-title').textContent = TITLES[n];
    $('#progress-steps').setAttribute('aria-label', 'Etapa ' + n + ' de 3');
    $all('#progress-steps li').forEach(function (li) {
      var num = Number(li.dataset.progress);
      li.className = num === n ? 'is-current' : (num < n ? 'is-complete' : '');
      var btn = $('button', li);
      btn.disabled = num > evalState.maxStep;
      $('span', btn).textContent = num < n ? '✓' : String(num);
    });
    var back = $('#back-slot');
    back.innerHTML = '';
    if (n > 1) {
      var bb = document.createElement('button');
      bb.className = 'button button-quiet'; bb.type = 'button'; bb.textContent = '← Voltar';
      bb.addEventListener('click', function () { goStep(n - 1); });
      back.appendChild(bb);
    }
    $('#eval-next').textContent = n < 3 ? 'Continuar →' : 'Enviar avaliação ✓';
    if (n === 3) renderReview();
  }

  function renderReview() {
    var ctx = $('#review-context');
    ctx.innerHTML = '';
    FIELDS.forEach(function (f) {
      var row = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = f.label;
      var dd = document.createElement('dd'); dd.textContent = fieldVal(f.id);
      row.appendChild(dt); row.appendChild(dd); ctx.appendChild(row);
    });
    var rr = $('#review-ratings');
    rr.innerHTML = '';
    CRITERIA.forEach(function (c) {
      var v = evalState.ratings[c.id];
      var row = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = c.shortLabel;
      var dd = document.createElement('dd'); dd.textContent = v + ' — ' + RATING_LABELS[v];
      row.appendChild(dt); row.appendChild(dd); rr.appendChild(row);
    });
    var comment = $('#f-comment').value.trim();
    $('#review-comment-wrap').hidden = !comment;
    $('#review-comment').textContent = comment;
  }

  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto-step]');
    if (g) goStep(Number(g.getAttribute('data-goto-step')));
  });
  $('#f-comment').addEventListener('input', function (e) { $('#comment-count').textContent = String(e.target.value.length); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (evalState.step < 3) { if (validateStep(evalState.step)) goStep(evalState.step + 1); return; }
    if (!validateStep(3) || evalState.sending) return;
    evalState.sending = true;
    $('#eval-next').textContent = 'Enviando…';
    $('#eval-next').disabled = true;
    apiPost('/api/avaliacoes', {
      studentName: fieldVal('studentName'), course: fieldVal('course'),
      classGroup: fieldVal('classGroup'), teacher: fieldVal('teacher'),
      subject: fieldVal('subject'), comment: $('#f-comment').value, ratings: evalState.ratings
    }, function (err) {
      evalState.sending = false;
      $('#eval-next').disabled = false;
      $('#eval-next').textContent = 'Enviar avaliação ✓';
      if (err) {
        var se = $('#submit-error');
        // Sem backend: mantém fluxo demonstrativo local
        evalState.offline = true;
        finishSubmit();
        return;
      }
      evalState.offline = false;
      finishSubmit();
    });
  });

  function finishSubmit() {
    evalState.submitted = true;
    $('#eval-form-section').hidden = true;
    var s = $('#eval-success');
    s.hidden = false;
    $('#success-text').textContent = 'Obrigado por contribuir com uma educação melhor. ' +
      (evalState.offline ? 'Backend desligado: registro apenas visual neste navegador.' : 'Registro gravado no banco SQLite local.') +
      ' Nenhuma análise por IA foi realizada.';
  }
  function resetEvalParaFormulario() {
    if (!evalState.submitted) return;
    // Volta ao formulário limpo ao sair da tela de sucesso e retornar
    evalState.submitted = false;
    $('#eval-success').hidden = true;
    $('#eval-form-section').hidden = false;
  }

  // ---------- Painel ----------
  function renderMedias(medias) {
    var el = $('#chart-medias');
    el.innerHTML = '';
    medias.forEach(function (m) {
      var row = document.createElement('div');
      row.className = 'bar-line';
      row.innerHTML = '<span></span><div class="bar-track"><i></i></div><strong></strong>';
      row.querySelector('span').textContent = m.label;
      row.querySelector('i').style.width = ((m.value / 5) * 100) + '%';
      row.querySelector('strong').textContent = Number(m.value).toFixed(1);
      el.appendChild(row);
    });
  }
  function renderDist(dist) {
    var el = $('#chart-dist');
    el.innerHTML = '';
    dist.forEach(function (d) {
      var col = document.createElement('div');
      col.className = 'distribution-column';
      col.innerHTML = '<div class="distribution-track"><i><b></b></i></div><strong></strong><span></span>';
      col.querySelector('i').style.height = (d.value * 2) + '%';
      col.querySelector('b').textContent = d.value + '%';
      col.querySelector('strong').textContent = d.rating;
      col.querySelector('span').textContent = d.label;
      el.appendChild(col);
    });
  }
  function carregarDashboard() {
    apiGet('/api/dashboard', function (err, data) {
      var demo = true, total = 148, medias = MOCK_MEDIAS, dist = MOCK_DIST;
      if (!err && data && !data.demonstrativo) {
        demo = false;
        total = data.total;
        medias = (data.medias || []).map(function (m) { return { label: MEDIA_LABEL[m.criterio] || m.criterio, value: Number(m.media) }; });
        var soma = (data.distribuicao || []).reduce(function (a, d) { return a + d.qtd; }, 0) || 1;
        dist = (data.distribuicao || []).map(function (d) {
          return { rating: String(d.valor), label: DIST_LABEL[d.valor] || '', value: Math.round((d.qtd / soma) * 100) };
        });
      }
      $('#dashboard-badge').textContent = demo ? 'Dados fictícios · demonstração' : (total + ' registro(s) no SQLite local');
      $('#m-total').textContent = demo ? '148' : String(total);
      $('#m-total-sub').textContent = demo ? 'fictícias, para demonstração' : 'gravadas no banco local';
      var menor = medias.slice().sort(function (a, b) { return a.value - b.value; })[0];
      $('#m-menor').textContent = menor.value.toFixed(1).replace('.', ',');
      $('#m-menor-sub').textContent = menor.label.toLowerCase();
      $('#m-menor-label').textContent = demo ? 'Menor média fictícia' : 'Menor média real';
      $('#average-chart-title').textContent = demo ? 'Percepção agregada simulada' : 'Percepção agregada do banco local';
      $('#distribution-chart-title').textContent = demo ? 'Composição simulada' : 'Composição real do banco';
      $('#cap-medias').textContent = demo ? 'Médias locais e fictícias. Não representam resultados oficiais do IFTO.' : 'Médias calculadas via AVG no SQLite a partir das avaliações enviadas.';
      $('#cap-dist').textContent = demo ? 'Percentuais fictícios para demonstrar leitura de tendências.' : 'Percentuais calculados com COUNT/GROUP BY no SQLite.';
      renderMedias(medias);
      renderDist(dist);
    });
  }

  // ---------- Listas estáticas ----------
  (function renderNeeds() {
    var el = $('#needs-list');
    NEEDS.forEach(function (n, i) {
      var a = document.createElement('article');
      a.className = 'need-row';
      a.innerHTML = '<span class="need-index"></span><div><h3></h3><p></p></div><div class="need-meta"><span></span><strong></strong></div>';
      a.querySelector('.need-index').textContent = '0' + (i + 1);
      a.querySelector('h3').textContent = n.title;
      a.querySelector('p').textContent = n.description;
      a.querySelector('.need-meta span').textContent = n.responses + ' respostas fictícias';
      var st = a.querySelector('strong');
      st.textContent = n.priority;
      st.className = 'priority priority-' + n.priority.toLowerCase().replaceAll(' ', '-');
      el.appendChild(a);
    });
  })();
  (function renderRecs() {
    var el = $('#rec-list');
    RECS.forEach(function (r) {
      var a = document.createElement('article');
      a.className = 'recommendation-card';
      a.innerHTML = '<div class="recommendation-number"></div><div class="recommendation-body"><div class="recommendation-topline"><span>NECESSIDADE IDENTIFICADA</span><div class="review-status"></div></div><h2></h2><div class="recommendation-detail-grid"><div><span>EVIDÊNCIA AGREGADA</span><p></p></div><div><span>RECOMENDAÇÃO SUGERIDA</span><p></p></div><div><span>JUSTIFICATIVA</span><p></p></div><div><span>INDICADOR DE ACOMPANHAMENTO</span><p></p></div></div><div class="source-row"><span><strong>Fontes documentais:</strong> não disponíveis nesta demonstração.</span></div></div>';
      a.querySelector('.recommendation-number').textContent = '0' + r.id;
      var rs = a.querySelector('.review-status');
      rs.classList.add(r.tone);
      rs.textContent = '◉ ' + r.review;
      a.querySelector('h2').textContent = r.need;
      var ps = a.querySelectorAll('.recommendation-detail-grid p');
      ps[0].textContent = r.evidence; ps[1].textContent = r.recommendation;
      ps[2].textContent = r.rationale; ps[3].textContent = r.indicator;
      el.appendChild(a);
    });
  })();

  goStep(1);
  render(routeFromHash());
})();
