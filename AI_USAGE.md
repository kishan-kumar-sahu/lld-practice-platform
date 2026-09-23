# AI Usage

1. **Evaluation architecture:** AI suggested using an LLM as the primary evaluator. I rejected using it for all validation and kept objective checks deterministic.
2. **Evaluator abstraction:** I accepted an evaluator boundary so future rule-based, diagram or human evaluation can be added without changing submission flow.
3. **Submission UX:** I rejected a full UML canvas for the MVP because it would consume time without being necessary to demonstrate the feedback loop. A structured design form was chosen.
4. **Feedback:** I rejected a single numerical score because LLD has multiple valid solutions. The prototype reports strengths, issues, suggestions and trade-offs.
5. **Async-like status:** Evaluation has an explicit EVALUATING state so a slower model can be used later without changing the learner journey.
