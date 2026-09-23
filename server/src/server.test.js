const test = require("node:test");
const assert = require("node:assert/strict");
const { validateSubmission, deterministicEvaluate } = require("./server");
test("rejects incomplete submission", () =>
  assert.ok(
    validateSubmission({
      problemId: "parking-lot",
      classes: [],
      explanation: "",
    }).length > 0,
  ));
test("evaluates a structured design", () => {
  const s = {
    classes: [
      { name: "Vehicle" },
      { name: "ParkingSpot" },
      { name: "ParkingLot" },
    ],
    interfaces: [{ name: "ParkingStrategy" }],
    relationships: [{ from: "ParkingLot", to: "ParkingSpot" }],
    explanation:
      "Vehicle and parking spot are separate responsibilities. Payment uses a strategy.",
    code: "",
  };
  const p = {
    id: "parking-lot",
    criteria: ["Separation"],
    requirements: ["Support motorcycle"],
  };
  const r = deterministicEvaluate(s, p);
  assert.ok(r.strengths.length >= 2);
  assert.ok(r.tradeoffs.length > 0);
});
