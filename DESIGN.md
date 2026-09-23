# Design Note

## User flow
Choose problem → review requirements → create structured design → submit → evaluation → feedback → retry/history.

## Domain boundaries
Problem, Submission and Evaluation are separate concepts. Evaluation is split into deterministic and LLM-based strategies.

## Extensibility
The evaluation workflow is intentionally independent of a specific evaluator. A future `DiagramEvaluator`, `CodeEvaluator` or `HumanEvaluator` can implement the same contract without changing submission handling.

## Trade-offs
A structured editor was selected over a graphical UML editor because the assignment is time-boxed and the product value is the feedback loop. MongoDB is supported but the prototype can run in-memory to reduce setup risk. AI is optional so the product remains useful when the model is unavailable.
