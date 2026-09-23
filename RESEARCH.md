# Research Note

## Learner problem
LLD practice is easy to start but difficult to self-evaluate because many designs can satisfy the same requirements. Learners need feedback on responsibilities, relationships, abstractions, coupling, cohesion and trade-offs rather than only a model answer.

## Product direction
The MVP focuses on a repeatable loop: choose a realistic problem, externalize a design, submit it, receive explainable feedback, review the attempt and try again.

## Evaluation direction
Objective checks are kept deterministic for consistency. Qualitative design reasoning is delegated to an LLM when configured. The system does not treat the LLM as an oracle: feedback is framed as observations and suggestions, and multiple valid designs are explicitly supported.

## Scope
Three problems are included: Parking Lot, Vending Machine and Elevator System. A structured editor captures classes, interfaces, relationships, explanation and optional code without spending most of the 2-day window on a graphical UML editor.
