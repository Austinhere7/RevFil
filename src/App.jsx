import React, { useState } from 'react';

const sampleProducts = [
  {
    id: 'headphones',
    name: 'Aural Pulse X2',
    category: 'Audio',
    source: 'Amazon',
    trust: 92,
    sentiment: 'Mostly positive',
    risk: 'Low bot risk',
    summary:
      'Strong praise for sound clarity and battery life. Review cadence looks natural with a few isolated concerns.',
    tags: ['battery', 'build quality', 'comfort'],
    reviewCount: '2.1K',
    signal: 'Balanced',
  },
  {
    id: 'smartwatch',
    name: 'Nova Watch S',
    category: 'Wearables',
    source: 'Flipkart',
    trust: 78,
    sentiment: 'Mixed',
    risk: 'Moderate spam risk',
    summary:
      'Positive feedback on display and tracking, but repeated praise bursts and duplicate wording reduce confidence.',
    tags: ['display', 'fitness', 'delivery'],
    reviewCount: '1.4K',
    signal: 'Watch closely',
  },
  {
    id: 'speaker',
    name: 'EchoStone Mini',
    category: 'Home Audio',
    source: 'Amazon',
    trust: 64,
    sentiment: 'Neutral leaning negative',
    risk: 'High bot risk',
    summary:
      'Review language is repetitive and clustered around promotion-style phrases. Product worth deeper verification.',
    tags: ['repetition', 'rating spike', 'trust alert'],
    reviewCount: '860',
    signal: 'Needs caution',
  },
];

const featureItems = [
  {
    index: '01',
    title: 'Authentic sentiment',
    text: 'Identify whether a product is genuinely appreciated by real customers or simply boosted by noise.',
  },
  {
    index: '02',
    title: 'Fake review detection',
    text: 'Spot suspicious, spammy, repetitive, or bot-like review behavior before it misleads buyers.',
  },
  {
    index: '03',
    title: 'Clear buying guidance',
    text: 'Convert long review streams into a trust summary that helps shoppers decide quickly and confidently.',
  },
];

const workflowSteps = [
  ['Collect reviews', 'Reviews are pulled from e-commerce sources such as Amazon and Flipkart.'],
  ['Analyze sentiment', 'The system understands customer emotions, opinions, and overall product perception.'],
  ['Detect anomalies', 'Unusual repetition, spam-like language, and clustered behavior are marked as suspicious.'],
  ['Generate a trust view', 'An overall sentiment and reliability assessment is produced for the product.'],
  ['Guide the shopper', 'Buyers receive a compact summary to help them continue, compare, or avoid the product.'],
];

const futureScope = [
  'Multiple e-commerce platforms',
  'More accurate fake review detection',
  'Personalized product recommendations',
  'Real-time review analysis',
  'Enhanced trust scoring',
];

const knownPlatforms = [
  { match: 'amazon', label: 'Amazon' },
  { match: 'flipkart', label: 'Flipkart' },
  { match: 'walmart', label: 'Walmart' },
  { match: 'bestbuy', label: 'Best Buy' },
  { match: 'target', label: 'Target' },
  { match: 'ebay', label: 'eBay' },
  { match: 'myntra', label: 'Myntra' },
  { match: 'meesho', label: 'Meesho' },
  { match: 'ajio', label: 'AJIO' },
];

const reviewSeed =
  'Great battery life, authentic build quality, and the reviews feel real. A few comments mention slower delivery, but the overall experience seems genuine and useful.';
const urlSeed = 'https://www.amazon.com/dp/example-product';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const detectPlatform = (input) => {
  if (!input) {
    return { label: 'Any e-commerce site', host: 'Paste a valid product URL' };
  }

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '');
    const platform = knownPlatforms.find(({ match }) => host.includes(match)) || {
      label: host.split('.')[0] || 'Website',
    };

    return {
      label: platform.label,
      host,
    };
  } catch {
    return { label: 'Invalid URL', host: 'Enter a full product page link' };
  }
};

const buildReviewAnalysis = (text) => {
  const normalized = text.toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  const positiveHits = ['great', 'good', 'excellent', 'genuine', 'authentic', 'reliable', 'love', 'worth', 'helpful'].filter((word) => normalized.includes(word)).length;
  const negativeHits = ['fake', 'scam', 'bad', 'poor', 'broken', 'refund', 'spam', 'bot', 'duplicate'].filter((word) => normalized.includes(word)).length;
  const suspiciousHits = ['repeated', 'copy', 'same', 'template', 'promo', 'bot', 'fake'].filter((word) => normalized.includes(word)).length;

  const baseScore = 70 + positiveHits * 5 - negativeHits * 10 - suspiciousHits * 8;
  const trust = clamp(Math.round(baseScore), 18, 97);
  let sentiment = 'Balanced sentiment';
  if (positiveHits > negativeHits) {
    sentiment = 'Mostly positive';
  } else if (negativeHits > positiveHits) {
    sentiment = 'Mostly negative';
  }

  let risk = 'Low bot risk';
  if (suspiciousHits > 1) {
    risk = 'Suspicious review patterns detected';
  } else if (negativeHits > 0) {
    risk = 'Mixed reliability signals';
  }

  const platform = 'User review text';
  const evidence = `${words.length} words analyzed • ${positiveHits} positive cues • ${negativeHits} negative cues`;

  let summary = 'The text is useful, but the sentiment is mixed and should be compared with the full review set.';
  if (sentiment === 'Mostly positive') {
    summary = 'The review reads like a real customer experience with practical details and limited spam indicators.';
  } else if (sentiment === 'Mostly negative') {
    summary = 'The text contains strong dissatisfaction markers and should be weighed with care.';
  }

  return {
    title: 'Review text analysis',
    platform,
    trust,
    sentiment,
    risk,
    evidence,
    summary,
    insights: [
      positiveHits ? 'Positive buying signals are present' : 'Few strong positive signals were found',
      suspiciousHits ? 'Watch for repetitive or templated language' : 'No strong repetition markers detected',
      negativeHits ? 'Some caution signals are present' : 'No serious negative warning signs',
    ],
  };
};

const buildUrlAnalysis = (url) => {
  const platform = detectPlatform(url);
  const hostname = platform.host.toLowerCase();
  const knownHost = knownPlatforms.some(({ match }) => hostname.includes(match));
  const trust = knownHost ? 84 : 76;
  const risk = knownHost ? 'Recognized e-commerce source' : 'Unfamiliar storefront detected';

  return {
    title: 'Product URL analysis',
    platform: platform.label,
    trust,
    sentiment: 'Ready for review extraction',
    risk,
    evidence: platform.host,
    summary: knownHost
      ? `RevFil can inspect this product page from ${platform.label} and summarize sentiment, authenticity, and trust signals.`
      : 'RevFil can still process this product page, but the storefront is not one of the known marketplace patterns.',
    insights: [
      'Paste a valid product page for deeper review intelligence',
      knownHost ? `Marketplace detected: ${platform.label}` : 'Platform detected from URL hostname',
      'Ready to summarize review trust and suspicious patterns',
    ],
  };
};

export default function App() {
  const [expandedStep, setExpandedStep] = useState(0);
  const [inputMode, setInputMode] = useState('review');
  const [reviewText, setReviewText] = useState(reviewSeed);
  const [productUrl, setProductUrl] = useState(urlSeed);
  const [analysis, setAnalysis] = useState(buildReviewAnalysis(reviewSeed));

  const runAnalysis = (event) => {
    event.preventDefault();

    if (inputMode === 'review') {
      const trimmedReview = reviewText.trim();
      if (!trimmedReview) {
        return;
      }

      setAnalysis(buildReviewAnalysis(trimmedReview));
      return;
    }

    const trimmedUrl = productUrl.trim();
    if (!trimmedUrl) {
      return;
    }

    setAnalysis(buildUrlAnalysis(trimmedUrl));
  };

  const fillExample = (type) => {
    if (type === 'review') {
      setInputMode('review');
      setReviewText(reviewSeed);
      setAnalysis(buildReviewAnalysis(reviewSeed));
      return;
    }

    setInputMode('url');
    setProductUrl(urlSeed);
    setAnalysis(buildUrlAnalysis(urlSeed));
  };

  const heroProduct = sampleProducts[0];

  const getTrustLabel = (trust) => {
    if (trust >= 85) {
      return 'High confidence';
    }

    if (trust >= 70) {
      return 'Moderate confidence';
    }

    return 'Needs caution';
  };

  const trustLabel = getTrustLabel(heroProduct.trust);

  return (
    <>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="RevFil home">
          <span className="brand-mark">R</span>
          <span className="brand-text">RevFil</span>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#analyze">Analyze</a>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#future">Future scope</a>
        </nav>

        <a className="button button-ghost" href="#analyze">
          Try live analysis
        </a>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="hero-copy reveal visible">
            <div className="eyebrow">Smart Product Review Sentiment & Authenticity Analyzer</div>
            <h1>See through fake reviews before they shape your purchase.</h1>
            <p>
              RevFil evaluates customer feedback from platforms like Amazon and Flipkart, separates genuine opinions from suspicious patterns, and turns thousands of reviews into a simple trust signal.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#analyze">
                Start analysis
              </a>
              <a className="button button-secondary" href="#workflow">
                See how it works
              </a>
            </div>

            <div className="hero-metrics">
              <article className="metric-card">
                <span className="metric-value">92%</span>
                <span className="metric-label">Sample trust score</span>
              </article>
              <article className="metric-card">
                <span className="metric-value">1.2m</span>
                <span className="metric-label">Review summary speed</span>
              </article>
              <article className="metric-card">
                <span className="metric-value">4</span>
                <span className="metric-label">Signals tracked in one view</span>
              </article>
            </div>
          </div>

          <aside className="hero-panel reveal visible">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Live product insight</p>
                <h2>Interactive review intelligence</h2>
              </div>
              <span className="status-pill status-pill-good">{trustLabel}</span>
            </div>

            <div className="trust-ring" aria-label={`Trust score ${heroProduct.trust} percent`}>
              <div className="trust-ring-inner">
                <span className="trust-score">{heroProduct.trust}%</span>
                <span className="trust-caption">{heroProduct.signal}</span>
              </div>
            </div>

            <div className="signal-grid">
              <article className="signal-card">
                <span className="signal-label">Product</span>
                <strong>{heroProduct.name}</strong>
                <p>
                  {heroProduct.category} • {heroProduct.source} • {heroProduct.reviewCount} reviews
                </p>
              </article>
              <article className="signal-card warning">
                <span className="signal-label">Risk</span>
                <strong>{heroProduct.risk}</strong>
                <p>Trust and authenticity signals are recalculated based on the filters you choose.</p>
              </article>
              <article className="signal-card">
                <span className="signal-label">Summary</span>
                <strong>{heroProduct.sentiment}</strong>
                <p>{heroProduct.summary}</p>
              </article>
            </div>

            <div className="review-badges">
              {heroProduct.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
        </section>

        <section className="section intro reveal visible">
          <div className="section-heading">
            <p className="eyebrow">Why RevFil matters</p>
            <h2>Online ratings are useful only when the signal is real.</h2>
          </div>

          <div className="card-grid three-up">
            {featureItems.map((item) => (
              <article className="feature-card" key={item.index}>
                <span className="card-index">{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="analyze" className="section reveal visible">
          <div className="section-heading narrow">
            <p className="eyebrow">Interactive analysis</p>
            <h2>Paste a review or a product URL from any e-commerce site.</h2>
          </div>

          <div className="analyzer-shell intake-shell">
            <form className="intake-form" onSubmit={runAnalysis}>
              <div className="mode-switch" role="tablist" aria-label="Analysis input mode">
                <button className={`mode-pill ${inputMode === 'review' ? 'active' : ''}`} type="button" onClick={() => setInputMode('review')}>
                  Paste review text
                </button>
                <button className={`mode-pill ${inputMode === 'url' ? 'active' : ''}`} type="button" onClick={() => setInputMode('url')}>
                  Paste product URL
                </button>
              </div>

              <div className="input-grid">
                <label className="field-label">
                  <span>{inputMode === 'review' ? 'Review text' : 'Product URL'}</span>
                  {inputMode === 'review' ? (
                    <textarea
                      className="text-input"
                      rows="9"
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      placeholder="Paste one review or a batch of reviews here. RevFil will extract sentiment, suspicious phrases, and trust cues."
                    />
                  ) : (
                    <input
                      className="text-input"
                      type="url"
                      value={productUrl}
                      onChange={(event) => setProductUrl(event.target.value)}
                      placeholder="https://www.amazon.com/... or any other product page"
                    />
                  )}
                </label>

                <div className="helper-card">
                  <p className="panel-kicker">Works with</p>
                  <h3>Any marketplace, any product page</h3>
                  <p>
                    RevFil is designed to accept shopping URLs or pasted review content from marketplaces such as Amazon, Flipkart, eBay, Myntra, Walmart, and other e-commerce sites.
                  </p>

                  <div className="helper-pills">
                    {['Amazon', 'Flipkart', 'eBay', 'Walmart', 'Myntra', 'Any store'].map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className="example-row">
                    <button type="button" className="example-chip" onClick={() => fillExample('review')}>
                      Use sample review
                    </button>
                    <button type="button" className="example-chip" onClick={() => fillExample('url')}>
                      Use sample URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <div className="input-note">
                  {inputMode === 'review'
                    ? 'Paste a review to evaluate sentiment, authenticity, and suspicious language.'
                    : 'Paste a product URL and RevFil will identify the marketplace before building a trust summary.'}
                </div>
                <button className="button button-primary" type="submit">
                  Analyze now
                </button>
              </div>
            </form>

            <div className="report-shell">
              <div className="analysis-detail-header">
                <div>
                  <p className="panel-kicker">Live report</p>
                  <h3>{analysis.title}</h3>
                </div>
                <span className="status-pill">{analysis.platform}</span>
              </div>

              <div className="report-grid">
                <div className="trust-ring report-ring" aria-label={`Trust score ${analysis.trust} percent`}>
                  <div className="trust-ring-inner">
                    <span className="trust-score">{analysis.trust}%</span>
                    <span className="trust-caption">Trust score</span>
                  </div>
                </div>

                <div className="report-metrics">
                  <article className="signal-card report-card">
                    <span className="signal-label">Sentiment</span>
                    <strong>{analysis.sentiment}</strong>
                    <p>{analysis.summary}</p>
                  </article>
                  <article className="signal-card report-card warning">
                    <span className="signal-label">Authenticity</span>
                    <strong>{analysis.risk}</strong>
                    <p>{analysis.evidence}</p>
                  </article>
                </div>
              </div>

              <div className="analysis-bars compact">
                <div className="bar-row">
                  <span>What RevFil detected</span>
                  <div className="insight-list">
                    {analysis.insights.map((item) => (
                      <div className="insight-item" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analysis-footer report-footer">
                <span>{analysis.platform}</span>
                <span>{inputMode === 'review' ? 'Text mode' : 'URL mode'}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="section reveal visible">
          <div className="section-heading narrow">
            <p className="eyebrow">How it works</p>
            <h2>A simple pipeline from raw reviews to actionable insight.</h2>
          </div>

          <div className="workflow-list">
            {workflowSteps.map(([title, text], index) => (
              <article className="workflow-step" key={title}>
                <button className="step-toggle" type="button" onClick={() => setExpandedStep(index)}>
                  {index + 1}
                </button>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {expandedStep === index && (
                    <div className="workflow-note">
                      <span>Expanded insight</span>
                      <p>RevFil combines sentiment cues, repetition detection, and review consistency checks to produce a more reliable verdict.</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="audience" className="section audience reveal visible">
          <div className="section-heading narrow">
            <p className="eyebrow">Target users and benefits</p>
            <h2>Designed for shoppers who want clarity, speed, and confidence.</h2>
          </div>

          <div className="card-grid two-up">
            <article className="list-card">
              <h3>Who it helps</h3>
              <ul>
                <li>Online shoppers looking for genuine product feedback</li>
                <li>Users confused by mixed or misleading ratings</li>
                <li>People who want fast insights before buying</li>
                <li>Frequent buyers who rely on review quality</li>
              </ul>
            </article>
            <article className="list-card">
              <h3>Benefits to users</h3>
              <ul>
                <li>Saves time by summarizing thousands of reviews</li>
                <li>Reduces the chance of buying low-quality products</li>
                <li>Improves confidence while shopping online</li>
                <li>Limits the influence of fake or manipulated opinions</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="future" className="section future reveal visible">
          <div className="future-card">
            <div>
              <p className="eyebrow">Objective and future scope</p>
              <h2>Building a more trustworthy online shopping experience.</h2>
              <p>
                RevFil’s goal is to help users separate genuine customer feedback from manipulated or fake opinions, and the platform can grow into broader review intelligence over time.
              </p>
            </div>

            <div className="future-points">
              {futureScope.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta reveal visible">
          <div className="cta-card">
            <div>
              <p className="eyebrow">Conclusion</p>
              <h2>Turn large review volumes into a clearer buying decision.</h2>
              <p>
                RevFil works as an intelligent assistant for online buyers by compressing sentiment, authenticity, and reliability into a simple summary that is easier to trust.
              </p>
            </div>
            <a className="button button-primary" href="#home">
              Back to top
            </a>
          </div>
        </section>
      </main>
    </>
  );
}