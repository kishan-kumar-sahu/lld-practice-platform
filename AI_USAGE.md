# AI Usage

1. Evaluation architecture

AI was considered as the primary evaluator, but that approach was rejected for objective validation. Deterministic checks remain predictable; AI is used for qualitative reasoning.

2. Evaluator abstraction

An evaluator boundary was accepted so future rule-based, diagram, code, or human evaluation can be added without changing submission flow.

3. Submission UX

A full UML canvas was rejected for the two-day MVP. A structured design form was chosen because it captures the information needed for evaluation with lower implementation complexity.

4. Feedback model

A single numerical score was rejected as the primary feedback mechanism because LLD can have multiple valid solutions. The platform reports strengths, issues, suggestions, trade-offs, deterministic feedback, and optional AI feedback.

5. Evaluation status

The EVALUATING state was accepted so slower model calls can be accommodated without redesigning the learner journey.

Principles

AI suggestions were reviewed before integration.

Requirements remained the primary decision criteria.

Generated code was not accepted blindly.

Unnecessary infrastructure complexity was avoided.

AI is advisory, not a canonical answer.
