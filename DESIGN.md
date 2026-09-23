# Design Note

1. MVP Overview
The MVP is an end-to-end LLD practice platform where a learner chooses a problem, reviews its
requirements, creates a structured design, submits it, receives deterministic and optional AI feedback,
and can review previous attempts.
2. User Flow
Choose Problem
fl
Review Requirements
fl
Create Structured Design
fl
Submit
fl
EVALUATING
fl
Deterministic + AI Evaluation
fl
COMPLETED
fl
Feedback / History / Retry
3. Domain Concepts
The core domain is intentionally small and separates the concepts that matter to the learning loop.
• Problem — defines the LLD challenge, requirements, difficulty, and evaluation criteria.
• Submission — stores the learner's classes, interfaces, relationships, explanation, optional code, status,
and problem reference.
• Evaluation — stores strengths, issues, suggestions, trade-offs, deterministic feedback, and AI feedback.
• Class / Interface / Relationship — structured design elements supplied by the learner.
4. Evaluation Design
The backend separates deterministic evaluation from LLM-based evaluation. The deterministic evaluator
provides predictable structural checks, while the LLM provides contextual mentor feedback when an API
key is configured.
Deterministic evaluation
• Checks whether a submission has enough classes and design structure.
• Looks for interfaces and explicit relationships.
• Checks payment and strategy/allocation signals where relevant.
• Reports possible missing requirements.
LLM evaluation
• Focuses on responsibilities, coupling, cohesion, abstractions, extensibility, and trade-offs.
• Is instructed not to claim that one design is the only correct solution.
• Returns advisory feedback rather than a canonical answer.
5. Persistence & Runtime Strategy
MongoDB/Mongoose is supported for persistence when MONGODB_URI is configured. The prototype also
supports an in-memory mode when MongoDB is unavailable, reducing setup risk during a short
assignment or demo. In-memory submissions are intentionally non-persistent across server restarts.
Page 1
LLD Practice Platform
6. Async Evaluation Behaviour
A submission is stored first with an EVALUATING status. Evaluation is then started separately, after the
submission response is returned. Once evaluation is complete, the submission moves to COMPLETED. If
the AI provider is unavailable, deterministic feedback is still preserved and the failure is reported
gracefully.
7. Key Trade-offs
Structured editor vs. graphical UML editor
Chosen: structured editor. Reason: the assignment is time-boxed and the product value is the feedback
loop. A graphical editor would consume implementation time without being essential to demonstrate the
core learning experience.
Monolith vs. microservices
Chosen: a small Express monolith. Reason: faster implementation, easier debugging, and appropriate
scope for an MVP. A larger production system could later introduce stronger service boundaries.
Deterministic checks + LLM feedback
Chosen: both. Reason: deterministic checks provide repeatability while LLM feedback provides contextual
reasoning. The trade-off is that LLM feedback can still be imperfect and should remain advisory.
MongoDB + in-memory fallback
Chosen: support both. Reason: MongoDB gives persistent storage while the fallback makes the demo
easier to run when a database is not available.
8. Extensibility
The evaluation boundary is deliberately replaceable. Future evaluators such as DiagramEvaluator,
CodeEvaluator, or HumanEvaluator can be introduced without redesigning the learner submission flow.
9. Current MVP Limitations
• Demo user only; authentication is outside scope.
• In-memory mode is not persistent.
• The problem library is intentionally small.
• The deterministic evaluator is intentionally basic.
• AI output depends on external API availability.
• There is no advanced diagram editor or human review workflow.
10. Design Goal
The design is optimized for a focused learning loop: make the learner's reasoning explicit, provide
explainable feedback, preserve previous attempts, and make it easy to try again
