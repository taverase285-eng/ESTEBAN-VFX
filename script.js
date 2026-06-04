// ===== LUCIDE ICONS =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ===== INTRO ANIMATION =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = document.getElementById('intro');
    if (intro) {
      intro.style.opacity = '0';
      intro.style.visibility = 'hidden';
      intro.style.pointerEvents = 'none';
      setTimeout(() => intro.remove(), 500);
    }
  }, 3200);
});

// ===== PARTICLES =====
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.5 ? '10, 60, 255' : '255, 0, 60'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  // Navbar background
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll progress bar
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = scrollPercent + '%';
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      menuToggle.innerHTML = '';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'x');
      icon.className = 'w-6 h-6';
      menuToggle.appendChild(icon);
      lucide.createIcons();
    } else {
      mobileMenu.classList.add('hidden');
      menuToggle.innerHTML = '';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'menu');
      icon.className = 'w-6 h-6';
      menuToggle.appendChild(icon);
      lucide.createIcons();
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuOpen = false;
    menuToggle.innerHTML = '';
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'menu');
    icon.className = 'w-6 h-6';
    menuToggle.appendChild(icon);
    lucide.createIcons();
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add delay based on animation-delay style if present
      const delay = entry.target.style.animationDelay || '0s';
      const delayMs = parseFloat(delay) * 1000;

      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delayMs);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.style.getPropertyValue('--w');
      entry.target.style.width = width;
      entry.target.classList.add('animated');
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== VIDEO MODAL + HOVER PREVIEW =====
const videoCards = document.querySelectorAll('.video-card');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const videoWrapper = document.getElementById('video-wrapper');

videoCards.forEach(card => {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  const thumb = card.querySelector('.video-thumb');

  // Crear video de preview oculto
  const previewVideo = document.createElement('video');
  previewVideo.src = videoSrc;
  previewVideo.muted = true;
  previewVideo.loop = true;
  previewVideo.playsInline = true;
  previewVideo.preload = 'metadata';
  previewVideo.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    border-radius: 0;
  `;
  thumb.appendChild(previewVideo);

  // Hover: reproducir preview
  card.addEventListener('mouseenter', () => {
    previewVideo.currentTime = 0;
    previewVideo.play().catch(() => {});
    previewVideo.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    previewVideo.pause();
    previewVideo.style.opacity = '0';
  });

  // Click: abrir modal
  card.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    previewVideo.pause();
    previewVideo.style.opacity = '0';

    videoWrapper.innerHTML = `
      <video
        src="${videoSrc}"
        controls
        autoplay
        playsinline
        webkit-playsinline
      ></video>
    `;
  });
});

// ===== TOOL CARDS MODAL =====
const toolCards = document.querySelectorAll('.tool-card');

toolCards.forEach(card => {
  card.addEventListener('click', () => {
    const videoSrc = card.dataset.video;
    if (!videoSrc) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    videoWrapper.innerHTML = `
      <video
        src="${videoSrc}"
        controls
        autoplay
        playsinline
        webkit-playsinline
        style="width:100%; max-height:75vh; border-radius:16px; object-fit:contain;"
      ></video>
    `;
  });
});

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  // Stop video
  const video = videoWrapper.querySelector('video');
  if (video) {
    video.pause();
    video.src = '';
  }
  setTimeout(() => {
    videoWrapper.innerHTML = '';
  }, 400);
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// ===== PARALLAX ON MOUSE MOVE =====
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');

  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x}px, ${-y}px)`;
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#fff';
    }
  });
});

// ===== PRELOADER - Ensure fonts are loaded =====
document.fonts.ready.then(() => {
  document.body.style.opacity = '1';
});

// ===== MINIATURAS AUTOMÁTICAS =====
document.querySelectorAll('.video-card').forEach(card => {
  const videoSrc = card.dataset.video;
  if (!videoSrc) return;

  const thumbBg = card.querySelector('.video-thumb-bg');
  if (!thumbBg) return;

  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';

  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 1; // saca la miniatura del segundo 1
  });

  video.addEventListener('seeked', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imagen = canvas.toDataURL('image/jpeg');
    thumbBg.style.background = `url('${imagen}') center/cover no-repeat`;
    video.remove();
  });
});
