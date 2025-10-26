// Small site JS for accessible mobile nav toggle
(function(){
  'use strict';
  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return (ctx||document).querySelectorAll(sel); }

  var body = document.body;
  var toggles = qsa('.nav-toggle');

  function setOpen(open){
    body.classList.toggle('menu-open', open);
    toggles.forEach(function(t){ t.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  }

  toggles.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      setOpen(!expanded);
    });
  });

  // Close menu on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && body.classList.contains('menu-open')){
      setOpen(false);
    }
  });

  // Close when clicking a nav link (mobile)
  document.addEventListener('click', function(e){
    var target = e.target;
    if(target && target.closest && (target.closest('.nav-links') || target.closest('#primary-nav')) && body.classList.contains('menu-open')){
      setOpen(false);
    }
  });

  // Smooth scroll for "Voir mes projets"
  var viewProjectsBtn = qs('#viewProjectsBtn');
  if(viewProjectsBtn){
    viewProjectsBtn.addEventListener('click', function(e){
      e.preventDefault();
      var target = document.querySelector('#projects');
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  // Scroll reveal using IntersectionObserver
  var revealEls = qsa('.reveal');
  var io = null;
  function onIntersect(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('show');
      }
    });
  }
  if('IntersectionObserver' in window){
    io = new IntersectionObserver(onIntersect,{threshold:0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    // fallback: show all
    revealEls.forEach(function(el){ el.classList.add('show'); });
  }

  // Back to top
  var backToTop = qs('#backToTop');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 320) backToTop.classList.add('show'); else backToTop.classList.remove('show');
  });
  if(backToTop){
    backToTop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }

  // Contact form basic validation
  var form = qs('#contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = qs('#name').value.trim();
      var email = qs('#email').value.trim();
      var msg = qs('#message').value.trim();
      if(!name || !email || !msg){
        alert('Veuillez remplir tous les champs.');
        return;
      }
      // Very basic email check
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        alert('Veuillez entrer une adresse email valide.');
        return;
      }
      // Here you would send using fetch to an endpoint; for now, show success
      alert('Merci — message envoyé (simulation).');
      form.reset();
    });
  }

  // Animate skill bars when visible
  var skillBars = qsa('.skill .bar > span');
  if(skillBars.length && io){
    var skillObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var span = entry.target.querySelector('.bar > span');
          if(span){ span.style.width = span.getAttribute('data-width') || span.style.width || '80%'; }
          skillObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.2});
    qsa('.skill').forEach(function(el){ skillObserver.observe(el); });
  } else {
    // fallback: set widths
    qsa('.skill .bar > span').forEach(function(s){ if(!s.style.width) s.style.width = s.getAttribute('data-width') || '75%'; });
  }

  // Simple hero particles (lightweight)
  function startParticles(){
    try{
      var c = document.getElementById('heroParticles');
      if(!c) return;
      var ctx = c.getContext('2d');
      var dpr = window.devicePixelRatio || 1;
      function resize(){ c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; ctx.scale(dpr,dpr); }
      resize(); window.addEventListener('resize', resize);
      var particles = [];
      for(var i=0;i<28;i++) particles.push({x:Math.random()*c.clientWidth,y:Math.random()*c.clientHeight, r:1+Math.random()*2, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, alpha:0.2+Math.random()*0.4});
      function tick(){ ctx.clearRect(0,0,c.clientWidth, c.clientHeight); particles.forEach(function(p){ p.x += p.vx; p.y += p.vy; if(p.x< -10) p.x=c.clientWidth+10; if(p.x>c.clientWidth+10) p.x=-10; if(p.y< -10) p.y=c.clientHeight+10; if(p.y>c.clientHeight+10) p.y=-10; ctx.beginPath(); ctx.fillStyle = 'rgba(0,122,204,'+p.alpha+')'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }); requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    } catch(e){ /* fail silently */ }
  }
  startParticles();

})();
