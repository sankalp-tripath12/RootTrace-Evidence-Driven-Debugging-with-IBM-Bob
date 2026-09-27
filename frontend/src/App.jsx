import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const hypotheses = [
  {
    id: "A",
    title: "Missing /100 conversion",
    description:
      "calculateFinalPrice passes the integer percentage directly to applyDiscount, which expects a decimal.",
    status: "SUPPORTED",
  },
  {
    id: "B",
    title: "Caller should pass decimal",
    description:
      "The caller could pass 0.20 instead of 20, but that conflicts with the existing calculateFinalPrice test contract.",
    status: "REJECTED",
  },
];

const timeline = [
  ["01", "Reproduce", "Failure reproduced with npm test and npm start."],
  ["02", "Evidence", "Runtime output, stack trace, source contracts and tests collected."],
  ["03", "Hypotheses", "Two competing explanations generated."],
  ["04", "Verify", "Hypotheses tested against repository evidence."],
  ["05", "Root Cause", "Percentage-to-decimal mismatch confirmed."],
  ["06", "Fix", "Minimal one-line conversion applied."],
  ["07", "Validate", "3/3 tests pass and application returns $120."],
];

function App() {
  const [reproducing, setReproducing] = useState(false);
  const [reproduction, setReproduction] = useState(null);
  const [reproductionError, setReproductionError] = useState("");
  const [showCaseFile, setShowCaseFile] = useState(false);
  const [caseFile, setCaseFile] = useState(null);

  async function runReproduction() {
    setReproducing(true);
    setReproduction(null);
    setReproductionError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/reproduce",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setReproduction(data);
    } catch (error) {
      setReproductionError(error.message);
    } finally {
      setReproducing(false);
    }
  }

  async function viewCaseFile() {
    try {
      const response = await fetch("http://localhost:3001/api/case");

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }

      const data = await response.json();

      setCaseFile(data);
      setShowCaseFile(true);
    } catch (error) {
      setReproductionError(error.message);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div>
            <div className="brand-name">ROOTTRACE</div>
            <div className="brand-subtitle">
              Evidence-Driven Debugging
            </div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="bob-status">
            <span className="status-dot" />
            IBM BOB
          </div>

          <div className="resolved-badge">✓ RESOLVED</div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div>
            <div className="eyebrow">DEBUGGING CASE · RT-001</div>

            <h1>Checkout Pricing Failure</h1>

            <p className="hero-description">
              RootTrace investigated a reproducible checkout failure,
              tested competing hypotheses, and verified the minimal fix.
            </p>
          </div>

          <div className="incident-card">
            <div className="incident-label">INCIDENT</div>

            <div className="error-message">
              Error: Discount rate must be between 0 and 1
            </div>

            <div className="incident-meta">
              <div>
                <span>EXPECTED</span>
                <strong>$120.00</strong>
              </div>

              <div>
                <span>ACTUAL</span>
                <strong className="danger">
                  APPLICATION CRASHED
                </strong>
              </div>

              <div>
                <span>SEVERITY</span>
                <strong>HIGH</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">INVESTIGATION</div>
              <h2>Evidence trail</h2>
            </div>

            <div className="investigation-actions">
              <button
                className="reproduce-button"
                onClick={runReproduction}
                disabled={reproducing}
              >
                {reproducing
                  ? "RUNNING..."
                  : "▶ RUN LIVE REPRODUCTION"}
              </button>

              <div className="live-label">
                <span className="status-dot" />
                VERIFIED CASE
              </div>
            </div>
          </div>

          <div className="timeline">
            {timeline.map(([number, title, description], index) => (
              <div className="timeline-item" key={number}>
                <div className="timeline-marker">✓</div>

                {index !== timeline.length - 1 && (
                  <div className="timeline-line" />
                )}

                <div className="timeline-content">
                  <div className="timeline-number">{number}</div>

                  <h3>{title}</h3>

                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>

          {reproducing && (
            <div className="loading-state">
              Running the real RootTrace demo repository...
            </div>
          )}

          {reproductionError && (
            <div className="error-state">
              <strong>Backend error:</strong>{" "}
              {reproductionError}
            </div>
          )}

          {reproduction && (
            <div className="live-reproduction">
              <div className="live-reproduction-header">
                <div>
                  <div className="section-kicker">
                    LIVE RUNTIME EVIDENCE
                  </div>

                  <h2>
                    Reproduction confirmed
                  </h2>
                </div>

                <div className="failure-pill">
                  EXIT CODE {reproduction.test.exitCode}
                </div>
              </div>

              <div className="runtime-evidence">
                <div className="runtime-block">
                  <div className="runtime-title">
                    <span>npm test</span>
                    <span>2 PASS · 1 FAIL</span>
                  </div>

                  <pre>
                    {reproduction.test.stdout}
                  </pre>
                </div>

                <div className="runtime-block">
                  <div className="runtime-title">
                    <span>npm start</span>
                    <span>CRASHED</span>
                  </div>

                  <pre>
                    {reproduction.application.stderr}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="grid-two">
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="section-kicker">
                  COMPETING EXPLANATIONS
                </div>

                <h2>Hypotheses</h2>
              </div>

              <div className="count-badge">2 TESTED</div>
            </div>

            <div className="hypothesis-list">
              {hypotheses.map((hypothesis) => (
                <div
                  className="hypothesis"
                  key={hypothesis.id}
                >
                  <div className="hypothesis-id">
                    {hypothesis.id}
                  </div>

                  <div className="hypothesis-body">
                    <div className="hypothesis-title">
                      <h3>{hypothesis.title}</h3>

                      <span
                        className={
                          hypothesis.status === "SUPPORTED"
                            ? "supported"
                            : "rejected"
                        }
                      >
                        {hypothesis.status === "SUPPORTED"
                          ? "✓"
                          : "×"}{" "}
                        {hypothesis.status}
                      </span>
                    </div>

                    <p>{hypothesis.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-kicker">
              CONFIRMED ROOT CAUSE
            </div>

            <h2>Unit mismatch at function boundary</h2>

            <div className="trace">
              <div className="trace-box">
                <span>INPUT</span>
                <strong>20</strong>
                <small>discountPercent</small>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-box highlight">
                <span>CONVERSION</span>
                <strong>/ 100</strong>
                <small>percentage → decimal</small>
              </div>

              <div className="trace-arrow">→</div>

              <div className="trace-box">
                <span>EXPECTED</span>
                <strong>0.20</strong>
                <small>discountRate</small>
              </div>
            </div>

            <div className="root-cause-note">
              <span>WHY</span>

              <p>
                <code>applyDiscount()</code> requires a
                decimal between 0 and 1, while{" "}
                <code>calculateFinalPrice()</code> receives
                an integer percentage.
              </p>
            </div>
          </div>
        </section>

        <section className="panel fix-panel">
          <div className="panel-header">
            <div>
              <div className="section-kicker">
                MINIMAL FIX
              </div>

              <h2>One boundary conversion</h2>
            </div>

            <div className="file-label">
              <span>FILE</span> src/pricing.js:16
            </div>
          </div>

          <div className="diff">
            <div className="diff-line removed">
              <span>−</span>

              <code>
                return applyDiscount(subtotal, discountPercent);
              </code>
            </div>

            <div className="diff-line added">
              <span>+</span>

              <code>
                return applyDiscount(subtotal, discountPercent / 100);
              </code>
            </div>
          </div>

          <div className="fix-footer">
            <span>WHY THIS FIX?</span>

            <p>
              Preserves the existing public API and changes
              only the incorrect unit conversion.
            </p>
          </div>
        </section>

        <section className="validation">
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                REGRESSION VERIFICATION
              </div>

              <h2>Proof, not prediction</h2>
            </div>
          </div>

          <div className="validation-grid">
            <div className="validation-card">
              <div className="validation-title">
                <span>BEFORE FIX</span>
                <span className="failure-pill">
                  FAILED
                </span>
              </div>

              <div className="test-result">
                <strong>2</strong>
                <span>passed</span>
              </div>

              <div className="test-result">
                <strong className="danger-text">1</strong>
                <span>failed</span>
              </div>

              <div className="validation-output">
                Error: Discount rate must be between 0 and 1
              </div>
            </div>

            <div className="validation-card">
              <div className="validation-title">
                <span>AFTER FIX</span>

                <span className="success-pill">
                  VERIFIED
                </span>
              </div>

              <div className="test-result">
                <strong>3</strong>
                <span>passed</span>
              </div>

              <div className="test-result">
                <strong>0</strong>
                <span>failed</span>
              </div>

              <div className="validation-output success-output">
                Final price: $120
              </div>
            </div>
          </div>
        </section>

        <section className="case-file">
          <div className="case-file-icon">✓</div>

          <div className="case-file-content">
            <div className="section-kicker">
              CASE FILE GENERATED
            </div>

            <h2>Investigation complete</h2>

            <p>
              Investigation, evidence, hypotheses, root cause,
              fix and validation have been recorded as a
              persistent debugging case.
            </p>
          </div>

          <button
            className="case-button"
            onClick={viewCaseFile}
          >
            VIEW CASE FILE →
          </button>
        </section>

        {showCaseFile && caseFile && (
          <section className="case-file-viewer">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <div className="section-kicker">
                    PERSISTENT CASE FILE
                  </div>

                  <h2>{caseFile.title}</h2>
                </div>

                <button
                  className="case-button"
                  onClick={() => setShowCaseFile(false)}
                >
                  CLOSE
                </button>
              </div>

              <pre className="case-file-content-raw">
                <div className="case-file-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {caseFile.caseFile}
                  </ReactMarkdown>
                </div>
              </pre>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>ROOTTRACE</span>
        <span>
          IBM BOB · EVIDENCE-DRIVEN DEBUGGING
        </span>
      </footer>
    </div>
  );
}

export default App;