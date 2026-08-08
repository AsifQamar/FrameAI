// frontend/src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!videoUrl) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/generate-thumbnail', { videoUrl });
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || 'Failed to generate thumbnail.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}><Sparkles style={{ marginRight: '8px' }} /> FrameAI</h1>
        <p style={styles.subtitle}>Automated AI YouTube Thumbnail Generator</p>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleGenerate} style={styles.form}>
          <input
            type="text"
            placeholder="Paste YouTube Video URL here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? <Loader2 className="animate-spin" /> : 'Generate Free Thumbnails'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {loading && (
          <div style={styles.loadingState}>
            <p>Extracting video context & generating high-CTR thumbnails...</p>
          </div>
        )}

        {result && (
          <div style={styles.resultsContainer}>
            <h2 style={styles.resultsTitle}>Your thumbnails are ready!</h2>
            <div style={styles.grid}>
              {result.images.map((imgSrc, idx) => (
                <div key={idx} style={styles.card}>
                  <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} style={styles.image} />
                  <a href={imgSrc} download={`thumbnail_${idx + 1}.jpg`} style={styles.downloadBtn}>
                    Download HD
                  </a>
                </div>
              ))}
            </div>
            {result.prompt && (
              <div style={styles.promptBox}>
                <strong>AI Visual Prompt Used:</strong>
                <p>{result.prompt}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0d12',
    color: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    margin: '40px 0',
  },
  title: {
    fontSize: '2.8rem',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: '8px',
    fontSize: '1.1rem',
  },
  main: {
    maxWidth: '850px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
  },
  input: {
    flex: 1,
    padding: '16px 20px',
    borderRadius: '10px',
    border: '1px solid #1f2937',
    backgroundColor: '#111827',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '16px 28px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#000',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    backgroundColor: '#451a1a',
    color: '#f87171',
    padding: '14px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  loadingState: {
    textAlign: 'center',
    padding: '50px',
    color: '#10b981',
    fontSize: '1.1rem',
  },
  resultsContainer: {
    marginTop: '20px',
  },
  resultsTitle: {
    fontSize: '1.8rem',
    marginBottom: '24px',
    color: '#10b981',
    textAlign: 'center',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: '14px',
    overflow: 'hidden',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    border: '1px solid #1f2937',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    aspectRatio: '16/9',
    objectFit: 'cover',
  },
  downloadBtn: {
    display: 'block',
    textAlign: 'center',
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
  },
  promptBox: {
    marginTop: '32px',
    backgroundColor: '#111827',
    padding: '20px',
    borderRadius: '10px',
    borderLeft: '4px solid #10b981',
    fontSize: '0.95rem',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
};