function App() {
  return (
    <div className="container">
      <main className="hero">
        <h1 className="title">Aphrodite</h1>
        <p className="tagline">Transform your content. Become anyone.</p>

        <div className="coming-soon">
          <span className="badge">Coming Soon</span>
          <p className="launch-date">Summer 2026</p>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎭</div>
            <h3>Face Swap Technology</h3>
            <p>Create deepfake videos of yourself as your favorite personas</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎬</div>
            <h3>Built for Creators</h3>
            <p>Designed specifically for streamers and content creators</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Fast Processing</h3>
            <p>Upload your video and get results in minutes, not hours</p>
          </div>
        </div>

        <div className="cta">
          <p>Be the first to know when we launch</p>
          <form className="email-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
            />
            <button type="submit" className="notify-btn">Notify Me</button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Aphrodite. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
