// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

$(document).ready(function() {
  AOS.init( {
    // uncomment below for on-scroll animations to played only once
    // once: true  
  }); // initialize animate on scroll library

  runApiPreviewAnimation();
  runSkillGraphInteraction();
  runExperienceTimelineAnimation();
  runProjectFlipCards();
});

function runProjectFlipCards() {
  var projectLinks = document.querySelectorAll('.project-flip-link');

  if (!projectLinks.length) {
    return;
  }

  var touchMode = window.matchMedia('(hover: none)').matches;

  if (!touchMode) {
    return;
  }

  projectLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      var card = link.querySelector('.project-flip-card');

      if (!card) {
        return;
      }

      if (!card.classList.contains('is-flipped')) {
        event.preventDefault();
        card.classList.add('is-flipped');

        setTimeout(function() {
          card.classList.remove('is-flipped');
        }, 3600);
      }
    });
  });
}

function runSkillGraphInteraction() {
  var nodes = document.querySelectorAll('.skill-node');
  var items = document.querySelectorAll('.skill-detail-item');
  var titleEl = document.getElementById('skillDetailTitle');

  if (!nodes.length || !items.length || !titleEl) {
    return;
  }

  function setActive(group, label) {
    nodes.forEach(function(node) {
      node.classList.toggle('active', node.getAttribute('data-skill-group') === group);
    });

    items.forEach(function(item) {
      item.classList.toggle('active', item.getAttribute('data-skill-group') === group);
    });

    titleEl.textContent = label;
  }

  nodes.forEach(function(node) {
    node.addEventListener('mouseenter', function() {
      setActive(node.getAttribute('data-skill-group'), node.textContent.trim());
    });

    node.addEventListener('click', function() {
      setActive(node.getAttribute('data-skill-group'), node.textContent.trim());
    });
  });
}

function runExperienceTimelineAnimation() {
  var cards = document.querySelectorAll('.experience-card');

  if (!cards.length || typeof IntersectionObserver === 'undefined') {
    return;
  }

  function animateCounter(counterEl) {
    var target = parseFloat(counterEl.getAttribute('data-target'));
    var duration = 1100;
    var start = null;

    function tick(timestamp) {
      if (!start) {
        start = timestamp;
      }

      var progress = Math.min((timestamp - start) / duration, 1);
      var value = target * progress;
      counterEl.textContent = value.toFixed(target % 1 === 0 ? 0 : 1);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) {
        return;
      }

      var card = entry.target;
      card.classList.add('timeline-visible');

      var counter = card.querySelector('.year-counter');
      if (counter && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        animateCounter(counter);
      }

      observer.unobserve(card);
    });
  }, {
    threshold: 0.25
  });

  cards.forEach(function(card, index) {
    card.style.transitionDelay = (index * 90) + 'ms';
    observer.observe(card);
  });
}

function runApiPreviewAnimation() {
  var requestEl = document.getElementById('apiRequestLine');
  var statusEl = document.getElementById('apiStatusBadge');
  var responseEl = document.getElementById('apiResponseLine');
  var uiEl = document.getElementById('apiUiResult');
  var panelEl = document.getElementById('apiPreviewPanel');

  if (!requestEl || !statusEl || !responseEl || !uiEl || !panelEl) {
    return;
  }

  var frames = [
    {
      request: 'GET /api/v1/customer/profile?channel=web',
      status: '200 OK',
      tone: 'status-ok',
      response: '{ "tier": "Premium", "addons": ["55+ Discount"], "region": "FL" }',
      ui: 'Rendered banner: Florida 55+ Discount'
    },
    {
      request: 'POST /api/v1/feature-flags/evaluate',
      status: '202 Accepted',
      tone: 'status-cool',
      response: '{ "evergreen": true, "perfMode": "enabled" }',
      ui: 'Feature flags applied for this session'
    },
    {
      request: 'GET /api/v1/layout/config?viewport=kiosk-39',
      status: '200 OK',
      tone: 'status-ok',
      response: '{ "mode": "kiosk", "columns": 2, "attractLoop": true }',
      ui: 'Responsive kiosk layout rendered'
    },
    {
      request: 'GET /api/v1/orders/summary?user=active',
      status: '304 Cached',
      tone: 'status-warm',
      response: '{ "cache": true, "payload": "reused" }',
      ui: 'Fast paint using cached response'
    }
  ];

  var frameIndex = 0;

  function paintFrame(frame) {
    requestEl.textContent = frame.request;
    statusEl.textContent = frame.status;
    statusEl.className = 'api-status-badge ' + frame.tone;
    responseEl.textContent = frame.response;
    uiEl.textContent = frame.ui;

    panelEl.classList.remove('api-sim-pulse');
    void panelEl.offsetWidth;
    panelEl.classList.add('api-sim-pulse');
  }

  paintFrame(frames[frameIndex]);

  setInterval(function() {
    frameIndex = (frameIndex + 1) % frames.length;
    paintFrame(frames[frameIndex]);
  }, 3200);
}

// Smooth scroll for links with hashes
$('a.smooth-scroll')
.click(function(event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
    && 
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function() {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});
