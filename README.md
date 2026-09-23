# LLD Practice Platform

A focused end-to-end MVP for practicing Low-Level Design: choose a problem, model classes/interfaces/relationships, submit, receive deterministic + optional AI feedback, and review history.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose (optional; falls back to in-memory storage for a zero-setup demo)
- OpenAI API (optional; deterministic feedback works without it)

## Run
### Backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```
Windows PowerShell uses `Copy-Item .env.example .env`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

If MongoDB is not running, the backend automatically uses in-memory storage. Restarting the server clears demo submissions.

## Optional AI
Put `OPENAI_API_KEY` in `server/.env`. The AI is used only for qualitative design feedback. Objective validation remains deterministic.

## MVP decisions
- Structured submission instead of a complex UML editor to keep the 2-day scope focused.
- Deterministic evaluator handles basic completeness and problem-specific signals.
- LLM evaluator handles qualitative reasoning and trade-offs.
- `Evaluator` is a replaceable domain boundary; more evaluator implementations can be added later.
- Evaluation exposes `EVALUATING` and `COMPLETED` states; failures still preserve deterministic feedback.

## Limitations
- Demo user only; authentication is intentionally outside MVP scope.
- In-memory mode is not persistent.
- AI output is advisory and not treated as a canonical solution.
