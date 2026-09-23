# Research Note

Research Note
LLD Practice Platform — Learner Problem & Product Direction
1. Learner Problem
Low-Level Design (LLD) practice is easy to begin but difficult to self-evaluate. Problems such as Parking
Lot, Vending Machine, and Elevator System can have multiple valid designs, so comparing a learner's
solution with a single model answer does not adequately explain whether the design is thoughtful or
extensible.
The learner needs feedback on design reasoning, including:
• Which class owns which responsibility?
• Whether abstractions are useful and justified.
• How objects collaborate and what relationships exist.
• Whether coupling and cohesion are reasonable.
• How easily the design can accommodate future changes.
• What trade-offs were made and why.
2. Product Direction
The MVP is designed around a repeatable learning loop rather than a large LMS feature set:
Choose Problem
fl
Review Requirements
fl
Create Structured Design
fl
Submit
fl
Evaluate
fl
Review Feedback
fl
Try Again / History
The product therefore treats evaluation as the core learning experience. A learner can explicitly describe
classes, responsibilities, methods, interfaces, relationships, an explanation, and optional code. This
externalizes design decisions so they can be reviewed rather than remaining only in the learner's head.
3. Evaluation Direction
The evaluation model deliberately combines deterministic checks with optional LLM feedback.
Deterministic validation handles predictable structural signals such as class count, interface usage,
relationships, explanation completeness, and problem-specific indicators.
The LLM is used for qualitative mentor-style observations about responsibilities, coupling, cohesion,
abstractions, extensibility, and trade-offs. It is not treated as an oracle and the product does not assume
there is one canonical LLD solution.
4. MVP Scope
The current scope contains three practice problems: Parking Lot, Vending Machine, and Elevator System.
A structured editor was chosen instead of a full graphical UML canvas because the assignment is
time-boxed and the primary product value is the feedback loop.
5. Product Principles
• Feedback should be explainable rather than reduced to a single score.
• Multiple valid designs should be supported.
• The core practice loop should remain useful when AI is unavailable.
Page 1
LLD Practice Platform
• The evaluator should remain replaceable so future rule-based, diagram, code, or human evaluation can
be introduced.
6. Direction Beyond the MVP
Future product directions include richer UML/Mermaid diagram support, more problem-specific rubrics,
side-by-side attempt comparison, human mentor review, code-level analysis, progress analytics, and
personalized practice recommendations
