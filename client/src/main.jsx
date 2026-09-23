import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  useNavigate,
  useParams,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import "./styles.css";
const api = axios.create({ baseURL: "/api" });
function Layout({ children }) {
  return (
    <>
      <header>
        <Link className="brand" to="/">
          LLD<span>Lab</span>
        </Link>
        <nav>
          <Link to="/problems">Problems</Link>
          <Link to="/history">My Attempts</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>LLDLab · Focused practice for object-oriented design</footer>
    </>
  );
}
function Home() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">LOW-LEVEL DESIGN PRACTICE</div>
        <h1>
          Design. Submit.
          <br />
          <em>Understand.</em>
        </h1>
        <p>
          Practice real-world LLD problems and get explainable feedback on
          responsibilities, abstractions, relationships and trade-offs.
        </p>
        <Link className="btn primary" to="/problems">
          Start practicing →
        </Link>
      </div>
      <div className="hero-card">
        <div className="mini-label">PRACTICE LOOP</div>
        {[
          "Choose a problem",
          "Model your design",
          "Submit solution",
          "Review feedback",
          "Try again",
        ].map((x, i) => (
          <div className="loop" key={x}>
            <b>0{i + 1}</b>
            {x}
            <span>→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function Problems() {
  const [ps, setPs] = useState([]);
  useEffect(() => {
    api.get("/problems").then((r) => setPs(r.data));
  }, []);
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">PRACTICE LIBRARY</div>
          <h2>Choose a problem</h2>
          <p>
            Each problem has realistic requirements and multiple valid design
            approaches.
          </p>
        </div>
      </div>
      <div className="grid">
        {ps.map((p) => (
          <article className="problem-card" key={p.id}>
            <div className="card-top">
              <span className="tag">{p.difficulty}</span>
              <span>LLD</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <ul>
              {p.requirements.slice(0, 3).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Link className="text-link" to={`/problems/${p.id}`}>
              View problem →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
function Problem() {
  const { id } = useParams();
  const [p, setP] = useState();
  useEffect(() => {
    api.get("/problems/" + id).then((r) => setP(r.data));
  }, [id]);
  if (!p) return <div className="loading">Loading...</div>;
  return (
    <section className="problem-detail">
      <Link to="/problems" className="back">
        ← Problems
      </Link>
      <div className="detail-grid">
        <div>
          <span className="tag">{p.difficulty}</span>
          <h2>{p.title}</h2>
          <p className="lead">{p.description}</p>
          <h3>Requirements</h3>
          <div className="requirements">
            {p.requirements.map((r, i) => (
              <div key={r}>
                <b>0{i + 1}</b>
                {r}
              </div>
            ))}
          </div>
        </div>
        <aside className="side-card">
          <h3>Before you start</h3>
          <p>
            There can be more than one good solution. Explain your
            responsibilities and trade-offs rather than trying to match a single
            answer.
          </p>
          <Link className="btn primary full" to={`/practice/${p.id}`}>
            Start practice
          </Link>
        </aside>
      </div>
    </section>
  );
}
const empty = {
  classes: [{ name: "", responsibility: "", methods: "" }],
  interfaces: [{ name: "", purpose: "" }],
  relationships: [{ from: "", to: "", type: "association" }],
  explanation: "",
  code: "",
};
function Practice() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/problems/" + id).then((r) => setP(r.data));
  }, [id]);
  const update = (group, i, key, val) =>
    setForm((f) => ({
      ...f,
      [group]: f[group].map((x, j) => (j === i ? { ...x, [key]: val } : x)),
    }));
  const add = (group, obj) =>
    setForm((f) => ({ ...f, [group]: [...f[group], obj] }));
  const submit = async () => {
    setError("");
    const payload = { problemId: id, userId: "demo-user", ...form };
    try {
      const r = await api.post("/submissions", payload);
      nav("/submissions/" + r.data._id);
    } catch (e) {
      setError(e.response?.data?.errors?.join(" ") || "Submission failed");
    }
  };
  if (!p) return <div className="loading">Loading...</div>;
  return (
    <section>
      <div className="practice-head">
        <div>
          <Link to={`/problems/${id}`} className="back">
            ← {p.title}
          </Link>
          <h2>Design your solution</h2>
        </div>
        <button className="btn primary" onClick={submit}>
          Submit solution
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="editor-grid">
        <div>
          <Panel
            title="Classes"
            hint="What objects exist and what does each own?"
          >
            <button
              className="small-add"
              onClick={() =>
                add("classes", { name: "", responsibility: "", methods: "" })
              }
            >
              + Add class
            </button>
            {form.classes.map((x, i) => (
              <div className="entry" key={i}>
                <input
                  placeholder="Class name"
                  value={x.name}
                  onChange={(e) => update("classes", i, "name", e.target.value)}
                />
                <input
                  placeholder="Responsibility"
                  value={x.responsibility}
                  onChange={(e) =>
                    update("classes", i, "responsibility", e.target.value)
                  }
                />
                <textarea
                  placeholder="Methods: park(), release()"
                  value={x.methods}
                  onChange={(e) =>
                    update("classes", i, "methods", e.target.value)
                  }
                />
              </div>
            ))}
          </Panel>
          <Panel
            title="Interfaces"
            hint="Use abstractions where behaviour may vary."
          >
            <button
              className="small-add"
              onClick={() => add("interfaces", { name: "", purpose: "" })}
            >
              + Add interface
            </button>
            {form.interfaces.map((x, i) => (
              <div className="entry two" key={i}>
                <input
                  placeholder="Interface name"
                  value={x.name}
                  onChange={(e) =>
                    update("interfaces", i, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Purpose"
                  value={x.purpose}
                  onChange={(e) =>
                    update("interfaces", i, "purpose", e.target.value)
                  }
                />
              </div>
            ))}
          </Panel>
        </div>
        <div>
          <Panel title="Relationships" hint="Describe how objects collaborate.">
            <button
              className="small-add"
              onClick={() =>
                add("relationships", { from: "", to: "", type: "association" })
              }
            >
              + Add relationship
            </button>
            {form.relationships.map((x, i) => (
              <div className="entry relation" key={i}>
                <input
                  placeholder="From"
                  value={x.from}
                  onChange={(e) =>
                    update("relationships", i, "from", e.target.value)
                  }
                />
                <select
                  value={x.type}
                  onChange={(e) =>
                    update("relationships", i, "type", e.target.value)
                  }
                >
                  <option>association</option>
                  <option>composition</option>
                  <option>aggregation</option>
                  <option>inheritance</option>
                </select>
                <input
                  placeholder="To"
                  value={x.to}
                  onChange={(e) =>
                    update("relationships", i, "to", e.target.value)
                  }
                />
              </div>
            ))}
          </Panel>
          <Panel
            title="Design explanation"
            hint="Explain decisions and trade-offs."
          >
            <textarea
              className="big-text"
              placeholder="Explain why you chose these classes, responsibilities, abstractions and relationships..."
              value={form.explanation}
              onChange={(e) =>
                setForm((f) => ({ ...f, explanation: e.target.value }))
              }
            />
          </Panel>
          <Panel title="Optional code">
            <textarea
              className="code"
              placeholder="Paste a small code sketch if useful..."
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </Panel>
        </div>
      </div>
    </section>
  );
}
function Panel({ title, hint, children }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {hint && <small>{hint}</small>}
        </div>
        {children?.props?.className === "small-add" ? children : null}
      </div>
      {children?.props?.className === "small-add" ? null : children}
    </div>
  );
}
function Submission() {
  const { id } = useParams();
  const [data, setData] = useState();
  useEffect(() => {
    let t;
    const load = () =>
      api.get("/submissions/" + id).then((r) => setData(r.data));
    load();
    t = setInterval(load, 1500);
    return () => clearInterval(t);
  }, [id]);
  if (!data) return <div className="loading">Loading submission...</div>;
  const e = data.evaluation;
  return (
    <section>
      <div className="status-head">
        <div>
          <span className="eyebrow">SUBMISSION</span>
          <h2>{data.problem.title}</h2>
        </div>
        <span className={"status " + data.submission.status}>
          {data.submission.status}
        </span>
      </div>
      {!e ? (
        <div className="waiting">
          <div className="spinner" />
          <h3>Reviewing your design...</h3>
          <p>Deterministic checks and AI feedback are being prepared.</p>
        </div>
      ) : (
        <div className="feedback">
          <Feedback title="Strengths" items={e.strengths} />
          <Feedback title="Issues to consider" items={e.issues} />
          <Feedback title="Suggestions" items={e.suggestions} />
          <Feedback title="Trade-offs" items={e.tradeoffs} />
          <Feedback title="AI mentor review" items={e.aiFeedback} />
          <div className="review-actions">
            <Link className="btn primary" to={`/practice/${data.problem.id}`}>
              Try again
            </Link>
            <Link className="btn" to="/history">
              View history
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
function Feedback({ title, items }) {
  return (
    <div className="feedback-card">
      <h3>{title}</h3>
      {items?.length ? (
        items.map((x, i) => (
          <div className="feedback-item" key={i}>
            <span>•</span>
            <p>{x}</p>
          </div>
        ))
      ) : (
        <p className="muted">No observations.</p>
      )}
    </div>
  );
}
function History() {
  const [list, setList] = useState([]);
  useEffect(() => {
    api.get("/submissions").then((r) => setList(r.data));
  }, []);
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">YOUR PROGRESS</div>
          <h2>Attempt history</h2>
          <p>
            Review previous designs and use feedback to improve your next
            attempt.
          </p>
        </div>
      </div>
      <div className="history">
        {list.length ? (
          list.map((s) => (
            <Link
              className="history-row"
              to={`/submissions/${s._id}`}
              key={s._id}
            >
              <div>
                <b>{s.problem?.title}</b>
                <small>{new Date(s.createdAt).toLocaleString()}</small>
              </div>
              <span className={"status " + s.status}>{s.status}</span>
              <span>→</span>
            </Link>
          ))
        ) : (
          <div className="empty">
            No attempts yet.{" "}
            <Link to="/problems">Start your first practice →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<Problem />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/submissions/:id" element={<Submission />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
