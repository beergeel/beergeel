const $ = (sel, root=document) => root.querySelector(sel);

function mount(){
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="index.html">
          <div class="logo">✦</div>
          <span>DreamScape</span>
        </a>
        <nav class="nav-links">
          <a class="active" href="#">Home</a>
          <a href="create.html">Create Dream</a>
          <a href="gallery.html">Gallery</a>
          <a href="community.html">Community</a>
        </nav>
        <div class="nav-cta">
          <a class="btn ghost" href="gallery.html">Explore</a>
          <button class="btn primary">Sign In</button>
        </div>
      </div>
    </header>

    <main>
      <section class="hero container">
        <div class="kicker">AI-Powered Dream Worlds</div>
        <h1 class="title">Navigate Your <span class="muted">Dream Universe</span></h1>
        <p class="subtitle">Transform your dreams into interactive, explorable worlds. Create, share, and immerse yourself in infinite AI-generated dreamscapes.</p>
        <div class="hero-cta">
          <a class="btn primary" href="create.html">Create Your Dream →</a>
          <a class="btn ghost" href="gallery.html">Explore Dreams ▶</a>
        </div>

        <div class="feature">
          <div class="media">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" alt="Cosmic Mountain"/>
            <div class="sub">Explore ethereal peaks floating in an endless starlit sky...</div>
            <div class="caption">Cosmic Mountain Voyage</div>
          </div>
        </div>
      </section>

      <section class="features-section" style="padding: 80px 0; background: linear-gradient(180deg, rgba(134,239,172,.05), rgba(134,239,172,.02))">
        <div class="container">
          <div style="text-align: center; margin-bottom: 60px">
            <h2 style="font-size: clamp(32px, 5vw, 56px); font-weight: 900; margin: 0 0 16px; color: var(--text)">Infinite Possibilities</h2>
            <p style="font-size: 18px; color: var(--muted); max-width: 600px; margin: 0 auto; line-height: 1.6">Unlock the full potential of your imagination with our groundbreaking features</p>
          </div>
          
          <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto">
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">⚡</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">AI Dream Generation</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Transform your thoughts into stunning visual dreamscapes with advanced AI</p>
            </div>
            
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">🗺️</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Interactive Dream Maps</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Navigate through your dreams with explorable, interactive 3D maps</p>
            </div>
            
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">🧠</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Dream Analysis</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Discover patterns, themes, and hidden meanings in your dream worlds</p>
            </div>
            
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">👥</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Dream Fusion</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Collaborate with others to create shared, merged dream universes</p>
            </div>
            
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">👁️</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Immersive Exploration</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Walk through your dreams with interactive elements and NPCs</p>
            </div>
            
            <div class="feature-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; padding: 24px; transition: transform .2s ease, box-shadow .2s ease">
              <div class="feature-icon" style="width: 48px; height: 48px; background: linear-gradient(135deg, #a855f7, #9333ea); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px">🎵</div>
              <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Dynamic Soundscapes</h3>
              <p style="color: var(--muted); margin: 0; line-height: 1.5">Experience ambient audio that adapts to your dream's mood</p>
            </div>
          </div>
        </div>
      </section>

      <section class="featured-section" style="padding: 80px 0; background: linear-gradient(180deg, rgba(134,239,172,.02), rgba(134,239,172,.05))">
        <div class="container">
          <div style="text-align: center; margin-bottom: 60px">
            <h2 style="font-size: clamp(32px, 5vw, 56px); font-weight: 900; margin: 0 0 16px; color: var(--text)">Featured Dreamscapes</h2>
            <p style="font-size: 18px; color: var(--muted); max-width: 600px; margin: 0 auto; line-height: 1.6">Explore the most captivating dreams created by our community</p>
          </div>
          
          <div class="dreamscapes-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto">
            <div class="dreamscape-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease">
              <div style="position: relative; height: 200px; overflow: hidden">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop" alt="Floating City" style="width: 100%; height: 100%; object-fit: cover"/>
                <div style="position: absolute; top: 12px; left: 12px; background: rgba(134,239,172,.2); color: var(--text); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600">serene</div>
              </div>
              <div style="padding: 20px">
                <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Floating City at Sunset</h3>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: var(--muted)">
                  <span>👁️ 892</span>
                  <span>❤️ 203</span>
                </div>
                <p style="color: var(--muted); margin: 0 0 12px; font-size: 14px; line-height: 1.4">Soaring through clouds at golden hour, discovering a city built on floating islands...</p>
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="font-size: 12px; color: var(--muted)">👤 khalidandsacad</span>
                  <a href="#" style="color: var(--brand); text-decoration: none; font-weight: 600; font-size: 14px">Explore →</a>
                </div>
              </div>
            </div>

            <div class="dreamscape-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease">
              <div style="position: relative; height: 200px; overflow: hidden">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop" alt="Neon Forest" style="width: 100%; height: 100%; object-fit: cover"/>
                <div style="position: absolute; top: 12px; left: 12px; background: rgba(134,239,172,.2); color: var(--text); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600">mysterious</div>
              </div>
              <div style="padding: 20px">
                <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Neon Forest of Whispers</h3>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: var(--muted)">
                  <span>👁️ 543</span>
                  <span>❤️ 127</span>
                </div>
                <p style="color: var(--muted); margin: 0 0 12px; font-size: 14px; line-height: 1.4">Walking through an enchanted forest where trees glow in neon blues and purples, their leaves...</p>
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="font-size: 12px; color: var(--muted)">👤 khalidandsacad</span>
                  <a href="#" style="color: var(--brand); text-decoration: none; font-weight: 600; font-size: 14px">Explore →</a>
                </div>
              </div>
            </div>

            <div class="dreamscape-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease">
              <div style="position: relative; height: 200px; overflow: hidden">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop" alt="Underwater Carnival" style="width: 100%; height: 100%; object-fit: cover"/>
                <div style="position: absolute; top: 12px; left: 12px; background: rgba(134,239,172,.2); color: var(--text); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600">whimsical</div>
              </div>
              <div style="padding: 20px">
                <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Underwater Carnival of Dreams</h3>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: var(--muted)">
                  <span>👁️ 412</span>
                  <span>❤️ 89</span>
                </div>
                <p style="color: var(--muted); margin: 0 0 12px; font-size: 14px; line-height: 1.4">An abandoned carnival that exists beneath the ocean waves, where fish swim through roller...</p>
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="font-size: 12px; color: var(--muted)">👤 khalidandsacad</span>
                  <a href="#" style="color: var(--brand); text-decoration: none; font-weight: 600; font-size: 14px">Explore →</a>
                </div>
              </div>
            </div>

            <div class="dreamscape-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 16px; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease">
              <div style="position: relative; height: 200px; overflow: hidden">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop" alt="Mountain" style="width: 100%; height: 100%; object-fit: cover"/>
                <div style="position: absolute; top: 12px; left: 12px; background: rgba(134,239,172,.2); color: var(--text); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600">adventurous</div>
              </div>
              <div style="padding: 20px">
                <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--text)">Mountain</h3>
                <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px; color: var(--muted)">
                  <span>👁️ 1</span>
                  <span>❤️ 0</span>
                </div>
                <p style="color: var(--muted); margin: 0 0 12px; font-size: 14px; line-height: 1.4">To travel all world</p>
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span style="font-size: 12px; color: var(--muted)">👤 khalidandsacad</span>
                  <a href="#" style="color: var(--brand); text-decoration: none; font-weight: 600; font-size: 14px">Explore →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section" style="padding: 80px 0; background: linear-gradient(180deg, rgba(134,239,172,.05), rgba(134,239,172,.02))">
        <div class="container">
          <div class="stats-card" style="background: var(--card); border: 1px solid rgba(134,239,172,.15); border-radius: 20px; padding: 40px; max-width: 1000px; margin: 0 auto">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center">
              <div class="stat-item">
                <div class="stat-icon" style="width: 64px; height: 64px; background: linear-gradient(135deg, #ec4899, #be185d); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px">✨</div>
                <div class="stat-number" style="font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 4px">10,000+</div>
                <div class="stat-label" style="color: var(--muted); font-size: 14px">Dreams Created</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon" style="width: 64px; height: 64px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px">👥</div>
                <div class="stat-number" style="font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 4px">5,000+</div>
                <div class="stat-label" style="color: var(--muted); font-size: 14px">Active Dreamers</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon" style="width: 64px; height: 64px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px">👁️</div>
                <div class="stat-number" style="font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 4px">1M+</div>
                <div class="stat-label" style="color: var(--muted); font-size: 14px">Dream Views</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon" style="width: 64px; height: 64px; background: linear-gradient(135deg, #ec4899, #be185d); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px">❤️</div>
                <div class="stat-number" style="font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 4px">500K+</div>
                <div class="stat-label" style="color: var(--muted); font-size: 14px">Likes Given</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section" style="padding: 80px 0; background: linear-gradient(180deg, rgba(134,239,172,.02), rgba(134,239,172,.05))">
        <div class="container">
          <div class="cta-card" style="background: linear-gradient(180deg, var(--card), rgba(134,239,172,.08)); border: 1px solid rgba(134,239,172,.15); border-radius: 24px; padding: 60px 40px; max-width: 800px; margin: 0 auto; text-align: center; position: relative; overflow: hidden">
            <div class="kicker" style="display: inline-flex; gap: 8px; align-items: center; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1a1a1a; padding: 8px 16px; border-radius: 999px; font-weight: 600; margin-bottom: 24px; font-size: 14px">
              ⚡ Start Free Today
            </div>
            
            <h2 style="font-size: clamp(36px, 5vw, 56px); font-weight: 900; margin: 0 0 20px; color: var(--text)">Ready to Dream?</h2>
            
            <p style="font-size: 18px; color: var(--muted); margin: 0 0 32px; line-height: 1.6; max-width: 500px; margin-left: auto; margin-right: auto">Join thousands of dreamers creating extraordinary worlds. Your next adventure is just one dream away.</p>
            
            <a href="create.html" class="btn primary" style="display: inline-flex; align-items: center; gap: 8px; font-size: 16px; padding: 16px 24px">Create Your First Dream →</a>
          </div>
        </div>
      </section>
    </main>

    <footer style="background: linear-gradient(90deg, var(--bg-2), rgba(134,239,172,.08)); border-top: 1px solid rgba(134,239,172,.15); padding: 60px 0 20px; margin-top: 80px">
      <div class="container">
        <div class="footer-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px">
          
          <div class="footer-brand">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
              <div class="logo" style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--brand), var(--accent)); display: grid; place-items: center; color: #001b0c; font-weight: 800">✦</div>
              <span style="font-weight: 700; font-size: 18px; color: var(--text)">DreamScape Navigator</span>
            </div>
            <p style="color: var(--muted); line-height: 1.6; margin: 0">Explore infinite dreamworlds powered by AI. Create, share, and immerse yourself in extraordinary experiences.</p>
          </div>

          <div class="footer-links">
            <h3 style="color: var(--text); font-weight: 700; margin: 0 0 16px; font-size: 16px">Quick Links</h3>
            <nav style="display: flex; flex-direction: column; gap: 8px">
              <a href="index.html" style="color: var(--muted); text-decoration: none; transition: color .2s ease">Home</a>
              <a href="create.html" style="color: var(--muted); text-decoration: none; transition: color .2s ease">Create Dream</a>
              <a href="gallery.html" style="color: var(--muted); text-decoration: none; transition: color .2s ease">Gallery</a>
              <a href="community.html" style="color: var(--muted); text-decoration: none; transition: color .2s ease">Community</a>
            </nav>
          </div>

          <div class="footer-connect">
            <h3 style="color: var(--text); font-weight: 700; margin: 0 0 16px; font-size: 16px">Connect</h3>
            <p style="color: var(--muted); margin: 0 0 16px; font-size: 14px">Join our community of dreamers</p>
            <div class="social-links" style="display: flex; gap: 12px">
              <a href="#" style="width: 40px; height: 40px; border: 1px solid rgba(134,239,172,.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text); text-decoration: none; transition: all .2s ease; font-weight: 600">X</a>
              <a href="#" style="width: 40px; height: 40px; border: 1px solid rgba(134,239,172,.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text); text-decoration: none; transition: all .2s ease; font-weight: 600">IG</a>
              <a href="#" style="width: 40px; height: 40px; border: 1px solid rgba(134,239,172,.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text); text-decoration: none; transition: all .2s ease; font-weight: 600">DC</a>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(134,239,172,.2); padding-top: 20px; text-align: center">
          <p style="color: var(--muted); margin: 0; font-size: 14px">© ${new Date().getFullYear()} DreamScape Navigator. All dreams reserved.</p>
        </div>
      </div>
    </footer>

    <div class="starfield"><canvas id="stars"></canvas></div>
  `;

  drawStars();
}

function drawStars(){
  const canvas = document.getElementById('stars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const resize = () => {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    render();
  };
  const stars = Array.from({length: 160}, () => ({
    x: Math.random(), y: Math.random(), r: Math.random()*1.6 + .2, a: Math.random()*0.6 + 0.2
  }));
  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const s of stars){
      ctx.beginPath();
      ctx.arc(s.x*canvas.width, s.y*canvas.height, s.r*dpr, 0, Math.PI*2);
      ctx.fillStyle = `rgba(134,239,172,${s.a})`;
      ctx.fill();
    }
  }
  window.addEventListener('resize', resize);
  resize();
}

document.addEventListener('DOMContentLoaded', mount);


