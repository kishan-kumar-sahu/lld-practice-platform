// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const { randomUUID } = require("crypto");
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "1mb" }));



// const problems = [
//   {
//     id: "parking-lot",
//     title: "Parking Lot",
//     difficulty: "Medium",
//     description:
//       "Design a parking lot that supports multiple floors, vehicle types, parking spots, ticketing and payment.",
//     requirements: [
//       "Support motorcycle, car and truck",
//       "Multiple floors and spot types",
//       "Assign and release parking spots",
//       "Generate entry/exit tickets",
//       "Support cash and card payment",
//       "Allow future parking allocation strategies",
//     ],
//     criteria: [
//       "Separation of responsibilities",
//       "Vehicle and spot abstraction",
//       "Extensibility for new vehicle types",
//       "Ticket/payment responsibilities",
//       "Low coupling",
//     ],
//   },
//   {
//     id: "vending-machine",
//     title: "Vending Machine",
//     difficulty: "Medium",
//     description:
//       "Design a vending machine that manages products, inventory, coins and purchase state.",
//     requirements: [
//       "Display available products",
//       "Accept money",
//       "Validate selected product",
//       "Dispense product and change",
//       "Handle out-of-stock and insufficient funds",
//       "Allow future payment methods",
//     ],
//     criteria: [
//       "State transitions",
//       "Encapsulation",
//       "Inventory responsibility",
//       "Payment abstraction",
//       "Error handling",
//     ],
//   },
//   {
//     id: "elevator",
//     title: "Elevator System",
//     difficulty: "Hard",
//     description:
//       "Design an elevator system serving multiple floors with request handling and scheduling.",
//     requirements: [
//       "Multiple elevators",
//       "Internal and external requests",
//       "Track elevator state and direction",
//       "Assign requests to elevators",
//       "Open/close doors safely",
//       "Allow alternative scheduling strategies",
//     ],
//     criteria: [
//       "State modeling",
//       "Request abstraction",
//       "Scheduling strategy",
//       "Separation of elevator/control responsibilities",
//       "Extensibility",
//     ],
//   },
// ];
// let submissions = [];
// let evaluations = [];
// let SubmissionModel, EvaluationModel;
// const submissionSchema = new mongoose.Schema({
//   userId: String,
//   problemId: String,
//   classes: Array,
//   interfaces: Array,
//   relationships: Array,
//   explanation: String,
//   code: String,
//   status: String,
//   createdAt: Date,
// });
// const evaluationSchema = new mongoose.Schema({
//   submissionId: String,
//   strengths: Array,
//   issues: Array,
//   suggestions: Array,
//   tradeoffs: Array,
//   deterministicFeedback: Array,
//   aiFeedback: Array,
//   createdAt: Date,
// });




// function getProblem(id) {
//   return problems.find((p) => p.id === id);
// }
// function validateSubmission(body) {
//   const errors = [];
//   if (!body.problemId || !getProblem(body.problemId))
//     errors.push("Valid problem is required");
//   if (!Array.isArray(body.classes) || body.classes.length === 0)
//     errors.push("Add at least one class");
//   if (!body.explanation || body.explanation.trim().length < 20)
//     errors.push("Add a design explanation of at least 20 characters");
//   return errors;
// }
// function deterministicEvaluate(s, p) {
//   const text = JSON.stringify(s).toLowerCase();
//   const req = p.criteria.map((x) => x.toLowerCase());
//   const strengths = [],
//     issues = [],
//     suggestions = [];
//   if (s.classes?.length >= 3)
//     strengths.push(
//       "You identified multiple domain objects instead of putting the whole design into one class.",
//     );
//   else
//     issues.push(
//       "The design has very few classes; consider extracting separate domain responsibilities.",
//     );
//   if (s.interfaces?.length)
//     strengths.push(
//       "You used interfaces, which can help isolate changing behaviour.",
//     );
//   else
//     issues.push(
//       "No interface/abstraction was provided. Consider interfaces for behaviour likely to vary.",
//     );
//   if (s.relationships?.length >= 2)
//     strengths.push(
//       "Relationships are explicitly described, making object collaboration easier to review.",
//     );
//   else
//     issues.push(
//       "Add explicit relationships such as composition, aggregation, inheritance, or association.",
//     );
//   if (/payment|pay/.test(text))
//     strengths.push("Payment behaviour is addressed.");
//   else if (p.id === "parking-lot" || p.id === "vending-machine")
//     issues.push("Payment responsibility is not clearly addressed.");
//   if (/strategy|scheduler|allocation/.test(text))
//     suggestions.push(
//       "Good direction: a strategy abstraction can make changing algorithms easier.",
//     );
//   else
//     suggestions.push(
//       "Consider a Strategy interface where the problem has a behaviour that may have multiple valid algorithms.",
//     );
//   suggestions.push(
//     "Keep each class focused on one cohesive responsibility and avoid a god object.",
//   );
//   const missing = p.requirements.filter(
//     (r) => !text.includes(r.toLowerCase().split(" ")[0]),
//   );
//   if (missing.length)
//     issues.push(
//       `Some requirements may not be represented clearly: ${missing.slice(0, 2).join("; ")}.`,
//     );
//   const tradeoffs = [
//     "A simpler design is easier to understand initially, while additional abstractions improve extensibility but increase class count.",
//     "Because LLD has multiple valid solutions, feedback focuses on responsibilities, coupling, cohesion and extensibility rather than a single canonical design.",
//   ];
//   return {
//     strengths,
//     issues,
//     suggestions,
//     tradeoffs,
//     deterministicFeedback: [
//       `Checked ${p.criteria.length} evaluation dimensions and basic submission completeness.`,
//     ],
//   };
// }
// async function aiEvaluate(s, p) {
//   if (!process.env.OPENAI_API_KEY)
//     return [
//       "AI review is running in demo mode because OPENAI_API_KEY is not configured. The deterministic review is still available.",
//     ];
//   try {
//     const OpenAI = require("openai");
//     const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     const prompt = `Review this LLD solution for ${p.title}. Give 3 concise observations. Do not claim there is one correct design. Focus on responsibilities, coupling/cohesion, abstractions, extensibility and trade-offs. Solution: ${JSON.stringify(s)}`;
//     const r = await client.chat.completions.create({
//       model: process.env.OPENAI_MODEL || "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are an LLD mentor. Be explainable and constructive.",
//         },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.2,
//     });
//     return [r.choices?.[0]?.message?.content || "No AI feedback returned."];
//   } catch (e) {
//     return [
//       `AI evaluation failed gracefully: ${e.message}. Deterministic feedback is still available.`,
//     ];
//   }
// }
// async function saveSubmission(obj) {
//   if (SubmissionModel) return (await SubmissionModel.create(obj)).toObject();
//   submissions.push(obj);
//   return obj;
// }
// async function saveEvaluation(obj) {
//   if (EvaluationModel) return (await EvaluationModel.create(obj)).toObject();
//   evaluations.push(obj);
//   return obj;
// }
// app.get("/api/health", (req, res) => res.json({ ok: true }));
// app.get("/api/problems", (req, res) => res.json(problems));
// app.get("/api/problems/:id", (req, res) => {
//   const p = getProblem(req.params.id);
//   if (!p) return res.status(404).json({ message: "Problem not found" });
//   res.json(p);
// });
// app.post("/api/submissions", async (req, res) => {
//   const errors = validateSubmission(req.body);
//   if (errors.length) return res.status(400).json({ errors });




// const submission = {
//   ...req.body,
//   status: "EVALUATING",
//   createdAt: new Date(),
// };



// const saved = await saveSubmission(submission);
// submission._id = saved._id;
// res.status(201).json(saved);



//   setImmediate(async () => {
//     const p = getProblem(submission.problemId);
//     const d = deterministicEvaluate(submission, p);
//     const ai = await aiEvaluate(submission, p);


   

//     const ev = {
//   submissionId: submission._id,
//   ...d,
//   aiFeedback: ai,
//   createdAt: new Date(),
// };


//     await saveEvaluation(ev);
//     if (SubmissionModel)
//       await SubmissionModel.updateOne(
//         { _id: submission._id },
//         { status: "COMPLETED" },
//       );
//     else {
//       const x = submissions.find((a) => a._id === submission._id);
//       if (x) x.status = "COMPLETED";
//     }
//   });
// });
// app.get("/api/submissions", async (req, res) => {
//   const list = SubmissionModel
//     ? await SubmissionModel.find().sort({ createdAt: -1 }).lean()
//     : submissions
//         .slice()
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   res.json(list.map((s) => ({ ...s, problem: getProblem(s.problemId) })));
// });
// app.get("/api/submissions/:id", async (req, res) => {
//   const s = SubmissionModel
//     ? await SubmissionModel.findOne({ _id: req.params.id }).lean()
//     : submissions.find((x) => x._id === req.params.id);
//   if (!s) return res.status(404).json({ message: "Submission not found" });
//   const e = EvaluationModel
//     ? await EvaluationModel.findOne({ submissionId: s._id }).lean()
//     : evaluations.find((x) => x.submissionId === s._id);
//   res.json({
//     submission: s,
//     problem: getProblem(s.problemId),
//     evaluation: e || null,
//   });
// });
// async function start() {
//   if (process.env.MONGODB_URI) {
//     try {
//       await mongoose.connect(process.env.MONGODB_URI);
//       SubmissionModel = mongoose.model("Submission", submissionSchema);
//       EvaluationModel = mongoose.model("Evaluation", evaluationSchema);
//       console.log("MongoDB connected");
//     } catch (e) {
//       console.log("MongoDB unavailable; using in-memory mode");
//     }
//   }
//   const port = process.env.PORT || 5000;
//   app.listen(port, () =>
//     console.log(`Server running on http://localhost:${port}`),
//   );
// }
// if (require.main === module) start();
// module.exports = { app, deterministicEvaluate, validateSubmission };










                 // another




                 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

dotenv.config();


console.log(
  "Groq key loaded:",
  process.env.GROQ_API_KEY 
);

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null;

const problems = [
  {
    id: "parking-lot",
    title: "Parking Lot",
    difficulty: "Medium",
    description:
      "Design a parking lot that supports multiple floors, vehicle types, parking spots, ticketing and payment.",
    requirements: [
      "Support motorcycle, car and truck",
      "Multiple floors and spot types",
      "Assign and release parking spots",
      "Generate entry/exit tickets",
      "Support cash and card payment",
      "Allow future parking allocation strategies",
    ],
    criteria: [
      "Separation of responsibilities",
      "Vehicle and spot abstraction",
      "Extensibility for new vehicle types",
      "Ticket/payment responsibilities",
      "Low coupling",
    ],
  },
  {
    id: "vending-machine",
    title: "Vending Machine",
    difficulty: "Medium",
    description:
      "Design a vending machine that manages products, inventory, coins and purchase state.",
    requirements: [
      "Display available products",
      "Accept money",
      "Validate selected product",
      "Dispense product and change",
      "Handle out-of-stock and insufficient funds",
      "Allow future payment methods",
    ],
    criteria: [
      "State transitions",
      "Encapsulation",
      "Inventory responsibility",
      "Payment abstraction",
      "Error handling",
    ],
  },
  {
    id: "elevator",
    title: "Elevator System",
    difficulty: "Hard",
    description:
      "Design an elevator system serving multiple floors with request handling and scheduling.",
    requirements: [
      "Multiple elevators",
      "Internal and external requests",
      "Track elevator state and direction",
      "Assign requests to elevators",
      "Open/close doors safely",
      "Allow alternative scheduling strategies",
    ],
    criteria: [
      "State modeling",
      "Request abstraction",
      "Scheduling strategy",
      "Separation of elevator/control responsibilities",
      "Extensibility",
    ],
  },
];

let submissions = [];
let evaluations = [];
let SubmissionModel, EvaluationModel;

const submissionSchema = new mongoose.Schema({
  userId: String,
  problemId: String,
  classes: Array,
  interfaces: Array,
  relationships: Array,
  explanation: String,
  code: String,
  status: String,
  createdAt: Date,
});

const evaluationSchema = new mongoose.Schema({
  submissionId: String,
  strengths: Array,
  issues: Array,
  suggestions: Array,
  tradeoffs: Array,
  deterministicFeedback: Array,
  aiFeedback: Array,
  createdAt: Date,
});

function getProblem(id) {
  return problems.find((p) => p.id === id);
}

function validateSubmission(body) {
  const errors = [];

  if (!body.problemId || !getProblem(body.problemId))
    errors.push("Valid problem is required");

  if (!Array.isArray(body.classes) || body.classes.length === 0)
    errors.push("Add at least one class");

  if (!body.explanation || body.explanation.trim().length < 20)
    errors.push("Add a design explanation of at least 20 characters");

  return errors;
}

function deterministicEvaluate(s, p) {
  const text = JSON.stringify(s).toLowerCase();

  const req = p.criteria.map((x) => x.toLowerCase());

  const strengths = [],
    issues = [],
    suggestions = [];

  if (s.classes?.length >= 3)
    strengths.push(
      "You identified multiple domain objects instead of putting the whole design into one class.",
    );
  else
    issues.push(
      "The design has very few classes; consider extracting separate domain responsibilities.",
    );

  if (s.interfaces?.length)
    strengths.push(
      "You used interfaces, which can help isolate changing behaviour.",
    );
  else
    issues.push(
      "No interface/abstraction was provided. Consider interfaces for behaviour likely to vary.",
    );

  if (s.relationships?.length >= 2)
    strengths.push(
      "Relationships are explicitly described, making object collaboration easier to review.",
    );
  else
    issues.push(
      "Add explicit relationships such as composition, aggregation, inheritance, or association.",
    );

  if (/payment|pay/.test(text))
    strengths.push("Payment behaviour is addressed.");
  else if (p.id === "parking-lot" || p.id === "vending-machine")
    issues.push("Payment responsibility is not clearly addressed.");

  if (/strategy|scheduler|allocation/.test(text))
    suggestions.push(
      "Good direction: a strategy abstraction can make changing algorithms easier.",
    );
  else
    suggestions.push(
      "Consider a Strategy interface where the problem has a behaviour that may have multiple valid algorithms.",
    );

  suggestions.push(
    "Keep each class focused on one cohesive responsibility and avoid a god object.",
  );

  const missing = p.requirements.filter(
    (r) => !text.includes(r.toLowerCase().split(" ")[0]),
  );

  if (missing.length)
    issues.push(
      `Some requirements may not be represented clearly: ${missing
        .slice(0, 2)
        .join("; ")}.`,
    );

  const tradeoffs = [
    "A simpler design is easier to understand initially, while additional abstractions improve extensibility but increase class count.",
    "Because LLD has multiple valid solutions, feedback focuses on responsibilities, coupling, cohesion and extensibility rather than a single canonical design.",
  ];

  return {
    strengths,
    issues,
    suggestions,
    tradeoffs,
    deterministicFeedback: [
      `Checked ${p.criteria.length} evaluation dimensions and basic submission completeness.`,
    ],
  };
}


/* =========================================================
   ONLY OPENAI -> GROQ CHANGE IS HERE
   ========================================================= */

async function aiEvaluate(s, p) {
  if (!process.env.GROQ_API_KEY) {
    return [
      "AI review is running in demo mode because GROQ_API_KEY is not configured. The deterministic review is still available.",
    ];
  }

  try {
    const prompt = `Review this LLD solution for ${p.title}.

Give 3 concise observations.

Do not claim there is one correct design.

Focus on:
- responsibilities
- coupling/cohesion
- abstractions
- extensibility
- trade-offs

Solution:
${JSON.stringify(s)}`;

    const r = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are an LLD mentor. Be explainable and constructive.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,
    });

    return [
      r.choices?.[0]?.message?.content ||
        "No AI feedback returned.",
    ];
  } catch (e) {
    return [
      `AI evaluation failed gracefully: ${e.message}. Deterministic feedback is still available.`,
    ];
  }
}


/* =========================================================
   REST OF YOUR LOGIC IS SAME
   ========================================================= */

async function saveSubmission(obj) {
  if (SubmissionModel)
    return (await SubmissionModel.create(obj)).toObject();

  submissions.push(obj);
  return obj;
}

async function saveEvaluation(obj) {
  if (EvaluationModel)
    return (await EvaluationModel.create(obj)).toObject();

  evaluations.push(obj);
  return obj;
}

app.get("/api/health", (req, res) =>
  res.json({ ok: true })
);

app.get("/api/problems", (req, res) =>
  res.json(problems)
);

app.get("/api/problems/:id", (req, res) => {
  const p = getProblem(req.params.id);

  if (!p)
    return res.status(404).json({
      message: "Problem not found",
    });

  res.json(p);
});

app.post("/api/submissions", async (req, res) => {
  const errors = validateSubmission(req.body);

  if (errors.length)
    return res.status(400).json({ errors });

  const submission = {
    ...req.body,
    status: "EVALUATING",
    createdAt: new Date(),
  };

  const saved = await saveSubmission(submission);

  submission._id = saved._id;

  res.status(201).json(saved);

  setImmediate(async () => {
    const p = getProblem(submission.problemId);

    const d = deterministicEvaluate(
      submission,
      p
    );

    const ai = await aiEvaluate(
      submission,
      p
    );

    const ev = {
      submissionId: submission._id,
      ...d,
      aiFeedback: ai,
      createdAt: new Date(),
    };

    await saveEvaluation(ev);

    if (SubmissionModel)
      await SubmissionModel.updateOne(
        { _id: submission._id },
        { status: "COMPLETED" },
      );
    else {
      const x = submissions.find(
        (a) => a._id === submission._id
      );

      if (x)
        x.status = "COMPLETED";
    }
  });
});

app.get("/api/submissions", async (req, res) => {
  const list = SubmissionModel
    ? await SubmissionModel
        .find()
        .sort({ createdAt: -1 })
        .lean()
    : submissions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

  res.json(
    list.map((s) => ({
      ...s,
      problem: getProblem(s.problemId),
    }))
  );
});

app.get("/api/submissions/:id", async (req, res) => {
  const s = SubmissionModel
    ? await SubmissionModel
        .findOne({ _id: req.params.id })
        .lean()
    : submissions.find(
        (x) => x._id === req.params.id
      );

  if (!s)
    return res.status(404).json({
      message: "Submission not found",
    });

  const e = EvaluationModel
    ? await EvaluationModel.findOne({
        submissionId: s._id,
      }).lean()
    : evaluations.find(
        (x) => x.submissionId === s._id
      );

  res.json({
    submission: s,
    problem: getProblem(s.problemId),
    evaluation: e || null,
  });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI
      );

      SubmissionModel =
        mongoose.model(
          "Submission",
          submissionSchema
        );

      EvaluationModel =
        mongoose.model(
          "Evaluation",
          evaluationSchema
        );

      console.log("MongoDB connected");
    } catch (e) {
      console.log(
        "MongoDB unavailable; using in-memory mode"
      );
    }
  }

  const port = process.env.PORT || 5000;

  app.listen(port, () =>
    console.log(
      `Server running on http://localhost:${port}`
    )
  );
}

if (require.main === module)
  start();

module.exports = {
  app,
  deterministicEvaluate,
  validateSubmission,
};