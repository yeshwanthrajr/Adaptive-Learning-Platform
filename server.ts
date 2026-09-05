import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Generate Personalized Learning Path
app.post("/api/learning-path/generate", async (req, res) => {
  try {
    const { studentProfile, topic, diagnosticResults } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Return high-quality calibrated fallback if API key is not yet set
      return res.json({
        success: true,
        isFallback: true,
        path: {
          id: `path-${Date.now()}`,
          topicTitle: topic || "Applied Machine Learning & Neural Networks",
          topicCategory: "Artificial Intelligence",
          targetGoal: `Master ${topic || "Neural Networks"} calibrated for ${studentProfile?.learningStyle || "visual"} learners interested in ${studentProfile?.primaryInterest || "Science"}.`,
          rationale: `Bespoke curriculum tailored for ${studentProfile?.name || "the learner"}: Emphasizes ${studentProfile?.learningStyle || "visual"} modalities, anchors abstract formulas to ${studentProfile?.primaryInterest || "real-world projects"}, and reinforces identified prerequisite gaps before tackling advanced modules.`,
          adaptationSummary: {
            styleEmphasis: `${studentProfile?.learningStyle || "Visual"} diagrams, memory flowcharts, and mental models over abstract mathematical proofs`,
            interestContext: `Real-world examples drawn directly from ${studentProfile?.primaryInterest || "modern industry"}`,
            paceAdjustment: `${studentProfile?.pacing === "accelerated" ? "Accelerated cadence with high-density milestone checks" : "Deep-dive progression with scaffolding"}`,
            gapFocus: "Targeted prerequisite refreshers inserted dynamically prior to core concepts",
          },
          overallProgress: 0,
          modules: [
            {
              id: "mod-gen-1",
              title: "Foundations & Mental Models",
              description: `Intuitive primer framing ${topic || "the core concepts"} using real-world analogies from ${studentProfile?.primaryInterest || "technology"}.`,
              status: "in-progress",
              difficultyLevel: 1,
              estimatedMinutes: 20,
              learningStyleFocus: studentProfile?.learningStyle || "visual",
              interestHook: `How fundamental principles relate to ${studentProfile?.primaryInterest || "practical systems"}`,
              keyConcepts: ["Core Terminology", "Input/Output Flow", "Boundary Conditions"],
              prerequisites: [],
            },
            {
              id: "mod-gen-2",
              title: "Adaptive Refresher: Core Mathematical Mechanics",
              description: "Targeted review module addressing diagnostic gaps before moving to multi-variable components.",
              status: "recommended",
              difficultyLevel: 2,
              estimatedMinutes: 25,
              learningStyleFocus: studentProfile?.learningStyle || "visual",
              interestHook: "Visualizing rate of change and parameter tuning",
              keyConcepts: ["Gradient Intuition", "Loss Evaluation", "Error Propagation"],
              prerequisites: ["mod-gen-1"],
              isPrerequisiteRefresher: true,
            },
            {
              id: "mod-gen-3",
              title: "Architecture & Structural Components",
              description: `Deconstructing multi-layered systems through step-by-step ${studentProfile?.learningStyle || "visual"} schematics.`,
              status: "locked",
              difficultyLevel: 3,
              estimatedMinutes: 35,
              learningStyleFocus: studentProfile?.learningStyle || "visual",
              interestHook: `Case study: applying this directly inside ${studentProfile?.primaryInterest || "creative projects"}`,
              keyConcepts: ["Layer Connections", "Activation Functions", "Dimensionality"],
              prerequisites: ["mod-gen-2"],
            },
            {
              id: "mod-gen-4",
              title: "Optimization & Applied Tuning",
              description: "Hands-on diagnostic workflows to debug bottlenecks and optimize performance metrics.",
              status: "locked",
              difficultyLevel: 4,
              estimatedMinutes: 40,
              learningStyleFocus: "hands-on",
              interestHook: "Live interactive performance tuning lab",
              keyConcepts: ["Hyperparameters", "Overfitting Prevention", "Regularization"],
              prerequisites: ["mod-gen-3"],
            },
            {
              id: "mod-gen-5",
              title: "Capstone System Implementation",
              description: "Synthesize all learned techniques into an end-to-end applied solution.",
              status: "locked",
              difficultyLevel: 5,
              estimatedMinutes: 50,
              learningStyleFocus: "hands-on",
              interestHook: `A full capstone project tailored to ${studentProfile?.primaryInterest || "practical engineering"}`,
              keyConcepts: ["System Integration", "Evaluation Metrics", "Deployment Optimization"],
              prerequisites: ["mod-gen-4"],
            },
          ],
        },
      });
    }

    const prompt = `You are a world-class adaptive learning curriculum architect.
Design a highly personalized, structured learning path for this student:
- Name: ${studentProfile?.name || "Student"}
- Learning Style: ${studentProfile?.learningStyle || "visual"} (Visual = diagrams/flowcharts; Hands-on = interactive labs/code; Conceptual = first principles/analogies; Concise = fast bullet cheat-sheets)
- Pacing Preference: ${studentProfile?.pacing || "standard"}
- Primary Interest: ${studentProfile?.primaryInterest || "General Science & Tech"}
- Current Skill Level: ${studentProfile?.skillLevel || "intermediate"}
- Target Topic: ${topic || "Algorithms & Data Structures"}
${diagnosticResults ? `- Diagnostic Assessment Performance: ${JSON.stringify(diagnosticResults)}` : ""}

Generate a tailored learning roadmap with 4 to 6 sequentially ordered modules.
Crucial Requirements:
1. Calibrate to their learning style (e.g. if visual, emphasize visual mental models, ASCII schematics, spatial representations).
2. Integrate their primary interest (${studentProfile?.primaryInterest}) into the interest hooks and real-world examples.
3. If diagnostic results or skill level indicates gaps, explicitly mark one module with isPrerequisiteRefresher = true.
4. If they already have high mastery in basics, fast-track them.
Return STRICT JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicTitle: { type: Type.STRING },
            topicCategory: { type: Type.STRING },
            targetGoal: { type: Type.STRING },
            rationale: { type: Type.STRING },
            adaptationSummary: {
              type: Type.OBJECT,
              properties: {
                styleEmphasis: { type: Type.STRING },
                interestContext: { type: Type.STRING },
                paceAdjustment: { type: Type.STRING },
                gapFocus: { type: Type.STRING },
              },
              required: ["styleEmphasis", "interestContext", "paceAdjustment", "gapFocus"],
            },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["completed", "in-progress", "recommended", "locked"] },
                  difficultyLevel: { type: Type.INTEGER },
                  estimatedMinutes: { type: Type.INTEGER },
                  learningStyleFocus: { type: Type.STRING, enum: ["visual", "hands-on", "conceptual", "concise"] },
                  interestHook: { type: Type.STRING },
                  keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                  isPrerequisiteRefresher: { type: Type.BOOLEAN },
                  isFastTracked: { type: Type.BOOLEAN },
                },
                required: ["id", "title", "description", "status", "difficultyLevel", "estimatedMinutes", "learningStyleFocus", "interestHook", "keyConcepts"],
              },
            },
          },
          required: ["topicTitle", "topicCategory", "targetGoal", "rationale", "adaptationSummary", "modules"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const pathObj = {
      ...parsed,
      id: `path-${Date.now()}`,
      overallProgress: 0,
    };

    res.json({ success: true, path: pathObj });
  } catch (error: any) {
    console.error("Error generating learning path:", error);
    res.status(500).json({ error: error.message || "Failed to generate learning path" });
  }
});

// 2. Generate Adaptive Assessment Questions
app.post("/api/assessment/generate", async (req, res) => {
  try {
    const { topic, moduleTitle, difficultyLevel = 3, studentProfile, count = 3 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        isFallback: true,
        questions: [
          {
            id: `q-gen-1`,
            prompt: `In the context of ${topic || "Algorithms"}, which strategy best optimizes lookup performance without excessive memory overhead?`,
            contextScenario: `Applied scenario in ${studentProfile?.primaryInterest || "system engineering"}: processing high-throughput telemetry streams.`,
            diagramAscii: `Input Stream -> [Filter / Hash Map] -> O(1) Quick Access\n                        v (Fallback)\n                     [B-Tree Disk Index]`,
            options: [
              {
                id: "opt-1",
                text: "Hash tables with dynamic load factor resizing to preserve O(1) average lookup.",
                isCorrect: true,
                explanation: "Correct! Dynamic rehashing balances memory usage and amortizes insertion/lookup to O(1).",
              },
              {
                id: "opt-2",
                text: "Allocating a 100GB contiguous array at boot time regardless of record count.",
                isCorrect: false,
                explanation: "Over-allocating static memory leads to catastrophic memory waste and page swapping.",
                misconceptionIdentified: "Confusing theoretical speed with practical memory constraints.",
              },
              {
                id: "opt-3",
                text: "Linear unsorted linked lists because insertion requires zero pointer math.",
                isCorrect: false,
                explanation: "While insertion is O(1), lookup is O(N) which degrades quickly under high throughput.",
                misconceptionIdentified: "Optimizing write time at the expense of crippling read latency.",
              },
              {
                id: "opt-4",
                text: "Disabling garbage collection permanently to avoid latency pauses.",
                isCorrect: false,
                explanation: "Disabling GC causes rapid memory exhaustion unless using manual Arena allocators.",
                misconceptionIdentified: "Misunderstanding memory lifecycle management.",
              },
            ],
            hints: [
              "Consider how amortized time complexity behaves when arrays double in size.",
              "Look for the trade-off between instant constant-time lookup and RAM footprints.",
              "Hash maps provide near instant key-value resolution as long as collisions are bounded.",
            ],
            conceptTag: "Data Structure Trade-offs",
            difficulty: difficultyLevel,
          },
        ],
      });
    }

    const prompt = `You are an adaptive educational assessment specialist.
Generate ${count} adaptive, high-quality multiple-choice diagnostic/formative assessment questions.
Topic: ${topic}
Module: ${moduleTitle || topic}
Target Difficulty: ${difficultyLevel} out of 5
Student Profile:
- Name: ${studentProfile?.name || "Student"}
- Learning Modality: ${studentProfile?.learningStyle || "visual"}
- Primary Passion / Interest: ${studentProfile?.primaryInterest || "Real-world tech"}

Requirements:
1. Every question must feature a realistic context scenario drawn directly from the student's interest (${studentProfile?.primaryInterest}).
2. If the student is a 'visual' learner, include a clean ASCII diagram / schema in 'diagramAscii'.
3. EXACT MISCONCEPTION IDENTIFICATION: For every incorrect option, provide a specific 'misconceptionIdentified' describing the exact cognitive error the student made when picking that choice.
4. Provide 3 progressive hints:
   - Hint 1: Conceptual nudge without giving away the answer
   - Hint 2: Formula, mechanic, or trade-off guidance
   - Hint 3: Step-by-step resolution
Return STRICT JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              prompt: { type: Type.STRING },
              contextScenario: { type: Type.STRING },
              diagramAscii: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                    explanation: { type: Type.STRING },
                    misconceptionIdentified: { type: Type.STRING },
                  },
                  required: ["id", "text", "isCorrect", "explanation"],
                },
              },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } },
              conceptTag: { type: Type.STRING },
              difficulty: { type: Type.INTEGER },
            },
            required: ["id", "prompt", "options", "hints", "conceptTag", "difficulty"],
          },
        },
      },
    });

    const questions = JSON.parse(response.text?.trim() || "[]");
    res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Error generating assessment:", error);
    res.status(500).json({ error: error.message || "Failed to generate assessment" });
  }
});

// 2b. Dynamic Adaptive Question Step (Computerized Adaptive Testing)
app.post("/api/assessment/adaptive-step", async (req, res) => {
  try {
    const {
      topic,
      studentProfile,
      currentDifficulty = 2,
      lastWasCorrect,
      lastConfidence,
      lastMisconception,
      questionNumber = 1,
    } = req.body;

    // Calculate target difficulty
    let nextDifficulty = currentDifficulty;
    let branchType: "standard" | "level-up" | "diagnostic-scaffold" | "reinforce" = "standard";

    if (lastWasCorrect === true) {
      if (lastConfidence === "high") {
        nextDifficulty = Math.min(5, currentDifficulty + 1);
        branchType = "level-up";
      } else {
        nextDifficulty = currentDifficulty; // Verify mastery without jump
        branchType = "reinforce";
      }
    } else if (lastWasCorrect === false) {
      nextDifficulty = Math.max(1, currentDifficulty - 1);
      branchType = lastMisconception ? "diagnostic-scaffold" : "reinforce";
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        isFallback: true,
        nextDifficulty,
        branchType,
      });
    }

    const prompt = `You are a real-time Computerized Adaptive Testing (CAT) psychometric engine.
The student (${studentProfile?.name}) is taking an adaptive assessment on '${topic}'.
Performance on previous item:
- Was Correct: ${lastWasCorrect}
- Stated Confidence: ${lastConfidence || "moderate"}
- Diagnosed Misconception (if any): ${lastMisconception || "none"}
- Adjusted Target Difficulty: ${nextDifficulty} out of 5 (Branch Type: ${branchType})
- Student Primary Interest: ${studentProfile?.primaryInterest}
- Student Learning Modality: ${studentProfile?.learningStyle}

Task: Generate exactly ONE adaptive question calibrated precisely to Difficulty Level ${nextDifficulty}.
If branchType is 'diagnostic-scaffold', frame this question to isolate and remedy the misconception: '${lastMisconception}'.
If branchType is 'level-up', pose a higher-order synthesis challenge.
Provide options with precise 'misconceptionIdentified' for wrong answers, 3 progressive hints, and an interest-anchored context scenario.
Return STRICT JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            prompt: { type: Type.STRING },
            contextScenario: { type: Type.STRING },
            diagramAscii: { type: Type.STRING },
            codeSnippet: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  explanation: { type: Type.STRING },
                  misconceptionIdentified: { type: Type.STRING },
                },
                required: ["id", "text", "isCorrect", "explanation"],
              },
            },
            hints: { type: Type.ARRAY, items: { type: Type.STRING } },
            conceptTag: { type: Type.STRING },
            difficulty: { type: Type.INTEGER },
          },
          required: ["id", "prompt", "options", "hints", "conceptTag", "difficulty"],
        },
      },
    });

    const question = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      nextDifficulty,
      branchType,
      question: {
        ...question,
        id: `q-dyn-${questionNumber}-${Date.now()}`,
        difficulty: nextDifficulty,
      },
    });
  } catch (error: any) {
    console.error("Error generating adaptive step:", error);
    res.status(500).json({ error: error.message || "Failed to step adaptive assessment" });
  }
});

// 3. Analyze Assessment Performance & Accurately Pinpoint Gaps and Strengths
app.post("/api/assessment/analyze", async (req, res) => {
  try {
    const { questions, attempts, studentProfile, topic } = req.body;

    const total = questions.length;
    const correctCount = attempts.filter((a: any) => a.isCorrect).length;
    const scorePercent = Math.round((correctCount / total) * 100);

    const difficultyTrajectory = attempts.map((a: any) => a.difficultyAtAttempt || 2);

    if (!process.env.GEMINI_API_KEY) {
      let level: any = "Developing";
      if (scorePercent >= 85) level = "Advanced";
      else if (scorePercent >= 65) level = "Proficient";
      else if (scorePercent < 45) level = "Novice";

      const validatedStrengths = attempts
        .filter((a: any) => a.isCorrect && (a.difficultyAtAttempt >= 3 || a.confidenceRating === "high"))
        .map((a: any) => a.conceptTag || "Core Analysis");

      const detectedGaps = attempts
        .filter((a: any) => !a.isCorrect)
        .map((a: any) => {
          const q = questions.find((item: any) => item.id === a.questionId);
          return {
            concept: a.conceptTag || q?.conceptTag || "Target Concept",
            severity: (a.confidenceRating === "high" ? "critical" : "moderate") as "critical" | "moderate" | "minor",
            misconception: a.misconceptionTriggered || "Inverted operational boundary conditions",
            remediationAction: `Review targeted video breakdown and complete the micro-lab on ${a.conceptTag || "this concept"}.`,
          };
        });

      return res.json({
        success: true,
        isFallback: true,
        result: {
          scorePercent,
          totalQuestions: total,
          correctCount,
          masteryLevel: level,
          difficultyTrajectory,
          validatedStrengths: validatedStrengths.length > 0 ? Array.from(new Set(validatedStrengths)) : ["Basic Recall", "Applied Scenario Intuition"],
          keyInsights: [
            `Demonstrated strong grasp of foundational ${topic || "mechanics"}.`,
            attempts.some((a: any) => !a.isCorrect)
              ? "Detected hesitation around edge-case boundary conditions and resource budgeting."
              : "Exceptional analytical speed and zero fundamental misconceptions detected.",
          ],
          detectedGaps,
          pathAdjustments: [
            scorePercent >= 80
              ? "Fast-tracking next module: unlocked higher tier challenge nodes."
              : "Inserted dynamic 15-minute micro-scaffold unit targeting identified misconceptions.",
            `Reinforced ${studentProfile?.learningStyle || "visual"} diagrams in upcoming study materials.`,
          ],
          detailedFeedback: `Great effort! You scored ${scorePercent}%. Your responses show a solid foundation, especially when analyzing problems framed through ${studentProfile?.primaryInterest || "real-world contexts"}. We have adapted your learning path roadmap to focus on the specific concepts you hesitated on.`,
        },
      });
    }

    const prompt = `You are an expert psychometrician and adaptive learning diagnostic specialist.
Analyze the student's performance on this computerized adaptive assessment:
Student: ${studentProfile?.name} (Learning style: ${studentProfile?.learningStyle}, Interest: ${studentProfile?.primaryInterest}, Academic Goal: ${studentProfile?.academicGoal?.title || "Mastery"})
Topic: ${topic}
Questions and student choices:
${JSON.stringify(
  questions.map((q: any) => {
    const attempt = attempts.find((a: any) => a.questionId === q.id);
    const chosenOption = q.options.find((o: any) => o.id === attempt?.selectedOptionId);
    return {
      conceptTag: q.conceptTag,
      difficulty: q.difficulty,
      studentWasCorrect: attempt?.isCorrect,
      chosenAnswerText: chosenOption?.text,
      identifiedMisconception: chosenOption?.misconceptionIdentified,
      confidenceRating: attempt?.confidenceRating || "moderate",
      hintsUsed: attempt?.hintsUsed || 0,
      timeSpentSeconds: attempt?.timeSpentSeconds || 0,
    };
  }),
  null,
  2
)}

Generate a personalized diagnostic synthesis in STRICT JSON:
- scorePercent (number)
- masteryLevel: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Master'
- keyInsights: array of 2-3 specific analytical observations
- validatedStrengths: array of 2-3 specific sub-skills where the student proved strong competence
- detectedGaps: array of objects with:
    - concept (string)
    - severity ('critical' | 'moderate' | 'minor' - if high confidence but wrong answer, mark 'critical')
    - misconception (string describing root cause cognitive error)
    - remediationAction (string describing concrete recommendation)
- pathAdjustments: array of 2-3 concrete curriculum adaptations (e.g. insert remedial micro-module, fast-track, shift to hands-on drill)
- detailedFeedback: warm, encouraging, pedagogically sharp explanation tailored to the student`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scorePercent: { type: Type.INTEGER },
            masteryLevel: { type: Type.STRING, enum: ["Novice", "Developing", "Proficient", "Advanced", "Master"] },
            keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            validatedStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            detectedGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["critical", "moderate", "minor"] },
                  misconception: { type: Type.STRING },
                  remediationAction: { type: Type.STRING },
                },
                required: ["concept", "severity", "misconception", "remediationAction"],
              },
            },
            pathAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedFeedback: { type: Type.STRING },
          },
          required: ["scorePercent", "masteryLevel", "keyInsights", "validatedStrengths", "detectedGaps", "pathAdjustments", "detailedFeedback"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      result: {
        ...parsed,
        totalQuestions: total,
        correctCount,
        difficultyTrajectory,
      },
    });
  } catch (error: any) {
    console.error("Error analyzing assessment:", error);
    res.status(500).json({ error: error.message || "Failed to analyze assessment" });
  }
});

// 3b. AI-Powered Resource Curation Engine
app.post("/api/resources/curate", async (req, res) => {
  try {
    const { studentProfile, topic, activeGaps = [], formatFilter } = req.body;

    const interest = studentProfile?.primaryInterest || "Real-world Engineering";
    const learningStyle = studentProfile?.learningStyle || "visual";
    const academicGoal = studentProfile?.academicGoal?.title || "Comprehensive Subject Mastery";

    if (!process.env.GEMINI_API_KEY) {
      // High-quality calibrated domain fallbacks
      const fallbackResources = [
        {
          id: `res-art-${Date.now()}-1`,
          title: `Optimizing Spatial Partitioning & Memory Locality in ${interest}`,
          format: "article",
          source: "MIT OpenCourseWare / Systems Architecture Notes",
          url: "https://ocw.mit.edu",
          estimatedTime: "11 min read",
          difficulty: "intermediate",
          matchingInterest: interest,
          targetedGap: activeGaps[0] || "Array & Memory Contiguity",
          relevanceScore: 97,
          whyRecommended: `Curated specifically for ${studentProfile?.name}: Connects ${topic || "Core Systems"} to ${interest}, resolving active gaps in memory locality with ${learningStyle} diagrams.`,
          keyTakeaways: [
            "Hardware L1 cache prefetching favors flat arrays over linked node structures.",
            "Spatial subdivision prunes collision checks from O(N²) down to O(N log N).",
            "Measuring memory footprint early prevents catastrophic page thrashing.",
          ],
          summary: `An engineering guide unpacking memory cache lines, pointer overhead, and spatial trees framed through ${interest}.`,
        },
        {
          id: `res-vid-${Date.now()}-2`,
          title: `Visualizing Call Stack Unwinding & Recursive State Rollbacks`,
          format: "video",
          source: "Computer Science Visualized / 3Blue1Brown Style",
          url: "https://youtube.com",
          estimatedTime: "13 min video",
          difficulty: "beginner",
          matchingInterest: interest,
          targetedGap: activeGaps.find((g: string) => g.toLowerCase().includes("recursion")) || "Call Stack in Recursion",
          relevanceScore: 96,
          whyRecommended: `Visual walkthrough directly addressing the misconception that recursion returns overwrite parent variables.`,
          keyTakeaways: [
            "Stack activation frames are popped in strict LIFO order.",
            "Parent variable values remain preserved throughout child execution.",
            "Base case acts as the bounding condition for stack integrity.",
          ],
          summary: `Animated visual demonstration of the CPU call stack, showing execution pausing and resuming at recursive sites.`,
        },
        {
          id: `res-ex-${Date.now()}-3`,
          title: `Hands-on Sandbox: Dynamic Collision Partitioning & Heuristic Tuning`,
          format: "exercise",
          source: "Interactive Algorithm Lab Suite",
          url: "https://github.com",
          estimatedTime: "18 min lab",
          difficulty: "intermediate",
          matchingInterest: interest,
          targetedGap: "Spatial Partitioning & Complexity",
          relevanceScore: 94,
          whyRecommended: `Hands-on interactive challenge matching your ${learningStyle} preference and goal of ${academicGoal}.`,
          keyTakeaways: [
            "Tune threshold parameters to minimize total intersection tests.",
            "Observe logarithmic scaling when entity counts scale from 50 to 5,000.",
          ],
          summary: `A code/simulation sandbox where you adjust spatial parameters and verify performance with real-time telemetry.`,
          interactiveExerciseSnippet: {
            prompt: `If 400 entities are clustered inside quadrant NW, what is the best strategy to keep frame times below 16ms?`,
            options: [
              "Subdivide quadrant NW into 4 child quadrants (recursively)",
              "Disable collisions entirely for that quadrant",
              "Allocate an unindexed linked list for all 400 entities",
              "Execute all-pairs check on the CPU thread",
            ],
            correctIndex: 0,
            explanation: "Recursive subdivision keeps entity counts per leaf bounded, preventing localized quadratic performance drops.",
          },
        },
        {
          id: `res-art-${Date.now()}-4`,
          title: `Statistical Significance & Sensor Calibration in Modern Field Systems`,
          format: "article",
          source: "ACM Queue & Environmental Data Science",
          url: "https://queue.acm.org",
          estimatedTime: "14 min read",
          difficulty: "intermediate",
          matchingInterest: interest,
          targetedGap: "p-value interpretation",
          relevanceScore: 93,
          whyRecommended: `Clarifies statistical inference and confidence intervals for sensor noise and telemetry experiments.`,
          keyTakeaways: [
            "p-values measure probability of data under the null hypothesis, not hypothesis validity.",
            "Always inspect effect size and confidence intervals alongside significance tests.",
          ],
          summary: `A practical breakdown of hypothesis testing, sensor drift correction, and statistical confidence.`,
        },
      ];

      const filtered = formatFilter && formatFilter !== "all"
        ? fallbackResources.filter((r) => r.format === formatFilter)
        : fallbackResources;

      return res.json({
        success: true,
        isFallback: true,
        resources: filtered,
      });
    }

    const prompt = `You are a world-class AI learning resource curation engine.
Analyze this student's profile, diagnostic assessment performance, and stated interests to curate 4 to 6 highly relevant, top-tier study materials:
Student: ${studentProfile?.name}
- Learning Style: ${learningStyle}
- Primary Interest: ${interest}
- Secondary Interests: ${(studentProfile?.secondaryInterests || []).join(", ")}
- Academic Goal: ${academicGoal} (Target: ${studentProfile?.academicGoal?.targetMasteryPercent || 90}% mastery)
- Current Topic: ${topic || "Applied Computer Science"}
- Active Diagnosed Knowledge Gaps / Misconceptions: ${JSON.stringify(activeGaps)}
${formatFilter && formatFilter !== "all" ? `- Required Resource Format: ${formatFilter}` : ""}

Curation Requirements:
1. Recommends diverse formats: 'article', 'video', 'exercise', 'simulation'.
2. Directly targets the student's active knowledge gaps (${JSON.stringify(activeGaps)}). Each resource must explicitly state why it was recommended for this student's exact gap and interest.
3. Incorporate real, respected educational publications and channels (e.g. MIT OpenCourseWare, ACM Queue, Distill.pub, 3Blue1Brown, Stanford InfoLab, NASA JPL, Computerphile, Harvard Data Science).
4. Calibrate the presentation to their learning style (${learningStyle}) and interest (${interest}).
5. Include an 'interactiveExerciseSnippet' with prompt, 4 options, correctIndex, and explanation for at least 2 resources.
Return STRICT JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              format: { type: Type.STRING, enum: ["article", "video", "exercise", "simulation"] },
              source: { type: Type.STRING },
              url: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["beginner", "intermediate", "advanced"] },
              matchingInterest: { type: Type.STRING },
              targetedGap: { type: Type.STRING },
              relevanceScore: { type: Type.INTEGER },
              whyRecommended: { type: Type.STRING },
              keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              interactiveExerciseSnippet: {
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["prompt", "options", "correctIndex", "explanation"],
              },
            },
            required: ["id", "title", "format", "source", "estimatedTime", "difficulty", "matchingInterest", "relevanceScore", "whyRecommended", "keyTakeaways", "summary"],
          },
        },
      },
    });

    const resources = JSON.parse(response.text?.trim() || "[]");
    res.json({
      success: true,
      resources: resources.map((r: any, i: number) => ({
        ...r,
        id: r.id || `curated-${Date.now()}-${i}`,
      })),
    });
  } catch (error: any) {
    console.error("Error curating resources:", error);
    res.status(500).json({ error: error.message || "Failed to curate resources" });
  }
});

// 4. Generate Personalized Study Resource & Interest Reframing
app.post("/api/study-resource/generate", async (req, res) => {
  try {
    const { topic, conceptTitle, studentProfile, resourceType = "concept-breakdown", interestReframe } = req.body;

    const interest = interestReframe || studentProfile?.primaryInterest || "Real-world engineering";
    const style = studentProfile?.learningStyle || "visual";

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        isFallback: true,
        resource: {
          id: `res-${Date.now()}`,
          moduleId: "active-mod",
          title: `${conceptTitle || topic} (Adapted for ${studentProfile?.name || "Student"})`,
          type: resourceType,
          content: {
            summary: `Personalized deep dive explaining ${conceptTitle || topic} through the lens of ${interest}.`,
            coreExplanation: `When exploring ${conceptTitle || topic}, think about how systems balance inputs, transformations, and bounded states. Just like in ${interest}, optimal execution avoids bottleneck accumulation by distributing load intelligently across pipeline stages.`,
            interestAnalogy: `🎯 ${interest} Parallel: Imagine coordinating an orchestrated event where each subsystem signals completion before passing state down the chain.`,
            visualSchematic: `
+---------------------------------------------+
|               ${conceptTitle || topic}                |
|  [Input Data] -> [Transformer] -> [Output]  |
|         |               |                   |
|     (Feedback)     (Validation)             |
+---------------------------------------------+
`,
            interactiveExercise: {
              challengePrompt: `Which tuning parameter prevents buffer overflow when throughput spikes by 300% in a ${interest} setting?`,
              options: ["Backpressure signaling", "Ignoring error packets", "Infinite recursion", "Hardcoded sleep loops"],
              correctAnswer: "Backpressure signaling",
              solutionExplanation: "Backpressure throttles upstream producers until downstream consumers catch up, preventing catastrophic memory exhaustion.",
            },
            bulletKeyTakeaways: [
              "Always balance throughput against memory boundaries.",
              "Isolate state transformations to prevent unintended side effects.",
              "Measure latency at 99th percentile rather than relying on average metrics.",
            ],
            commonPitfalls: [
              "Assuming infinite buffer capacity during unexpected load spikes.",
              "Failing to implement graceful fallback timeouts.",
            ],
          },
        },
      });
    }

    const prompt = `You are an adaptive educational content generator.
Create a rich, personalized study resource for:
- Concept: ${conceptTitle || topic}
- Overarching Topic: ${topic}
- Student Learning Style: ${style} (visual = include expressive ASCII diagrams and mental layout; hands-on = step-by-step interactive challenge; conceptual = deep first principles; concise = high-density bullet synthesis)
- Contextual Interest: ${interest}
- Resource Type: ${resourceType}

Key Instructions:
1. Explain the concept deeply, accurately, and accessibly.
2. Provide an illuminating real-world analogy centered explicitly on the student's interest (${interest}).
3. If style is 'visual', include a creative, well-formatted ASCII diagram or schematic in visualSchematic.
4. Include an interactive mini-challenge with 4 options, the correct answer, and an insightful explanation.
5. Include 3 bullet key takeaways and 2 common pitfalls.
Return STRICT JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["concept-breakdown", "interactive-lab", "cheatsheet", "reframe"] },
            content: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                coreExplanation: { type: Type.STRING },
                interestAnalogy: { type: Type.STRING },
                visualSchematic: { type: Type.STRING },
                interactiveExercise: {
                  type: Type.OBJECT,
                  properties: {
                    challengePrompt: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    solutionExplanation: { type: Type.STRING },
                  },
                  required: ["challengePrompt", "options", "correctAnswer", "solutionExplanation"],
                },
                bulletKeyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                commonPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["summary", "coreExplanation", "interestAnalogy", "bulletKeyTakeaways", "commonPitfalls"],
            },
          },
          required: ["title", "type", "content"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      resource: {
        id: `res-${Date.now()}`,
        moduleId: "active-mod",
        ...parsed,
      },
    });
  } catch (error: any) {
    console.error("Error generating study resource:", error);
    res.status(500).json({ error: error.message || "Failed to generate study resource" });
  }
});

// 5. Socratic Adaptive AI Tutor Chat with Multi-Model & Search Grounding
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const {
      message,
      studentProfile,
      currentTopic,
      currentConcept,
      chatHistory = [],
      modelSpeed = "balanced", // 'fast' -> gemini-3.1-flash-lite, 'balanced' -> gemini-3.5-flash, 'deep' -> gemini-3.1-pro-preview
      useSearchGrounding = false,
    } = req.body;

    // Model selection based on requirements:
    // gemini-3.1-flash-lite for tasks that should happen fast
    // gemini-3.5-flash for general tasks (and with googleSearch)
    // gemini-3.1-pro-preview for particularly complex tasks
    let selectedModel = "gemini-3.5-flash";
    if (modelSpeed === "fast") {
      selectedModel = "gemini-3.1-flash-lite";
    } else if (modelSpeed === "deep") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (useSearchGrounding) {
      selectedModel = "gemini-3.5-flash";
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        modelUsed: selectedModel,
        reply: `That's a thoughtful question about ${currentConcept || currentTopic || "this topic"}! Because you learn best with ${studentProfile?.learningStyle || "visual"} examples and love ${studentProfile?.primaryInterest || "technology"}, imagine this: whenever you encounter a complex barrier, break it into smaller sub-states. Would you like me to walk through a step-by-step example using ${studentProfile?.primaryInterest || "your favorite topic"}?`,
        groundingSources: [],
      });
    }

    const systemInstruction = `You are an empathetic, world-class Socratic AI Study Coach on an adaptive learning platform.
You are tutoring:
- Name: ${studentProfile?.name || "Student"}
- Learning Modality: ${studentProfile?.learningStyle || "visual"}
- Primary Passion / Interest: ${studentProfile?.primaryInterest || "Technology"}
- Current Topic: ${currentTopic || "General Studies"}
- Current Sub-concept: ${currentConcept || "Core Fundamentals"}

Pedagogical Rules:
1. Speak warmly, clearly, and directly without fluff.
2. Adapt your explanation style to the student's learning modality (use visual mental imagery/ASCII if visual; concrete code/actions if hands-on; conceptual analogies if conceptual).
3. Naturally weave in metaphors and analogies from their primary interest (${studentProfile?.primaryInterest}) to make complex abstractions feel intuitive.
4. Don't just lecture: end with an engaging, bite-sized follow-up question or thought experiment to test their intuition.`;

    const contents = [
      ...chatHistory.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents as any,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = groundingChunks
      ? groundingChunks
          .map((chunk: any) => chunk.web)
          .filter((web: any) => Boolean(web && web.uri))
      : [];

    res.json({
      success: true,
      modelUsed: selectedModel,
      reply: response.text || "I'm here to help you break down this concept! What specific part feels unclear?",
      groundingSources,
    });
  } catch (error: any) {
    console.error("Error in tutor chat:", error);
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

// Vite Middleware & SPA serving
async function startServer() {
  const server = http.createServer(app);

  // Set up WebSocket server for Gemini Live Audio conversation (gemini-3.1-flash-live-preview)
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (clientWs: WebSocket) => {
    console.log("[Live API] Client connected to real-time voice channel");
    let session: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        session = await ai.live.connect({
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
            },
            systemInstruction:
              "You are Aura, an empathetic real-time voice tutor on an adaptive learning platform. You speak concisely, warmly, and help students master difficult concepts through intuitive mental models and real-time dialogue.",
          },
          callbacks: {
            onmessage: (message: any) => {
              const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ audio }));
              }
              if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ interrupted: true }));
              }
            },
            onclose: () => {
              console.log("[Live API] Gemini Live session closed");
            },
            onerror: (err: any) => {
              console.error("[Live API] Gemini Live error:", err);
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ error: "Voice connection error" }));
              }
            },
          },
        });
      } catch (err) {
        console.error("[Live API] Failed to connect to Gemini Live:", err);
        clientWs.send(JSON.stringify({ error: "Failed to initialize Gemini Live session" }));
      }
    } else {
      clientWs.send(JSON.stringify({ info: "Live audio requires GEMINI_API_KEY in environment" }));
    }

    clientWs.on("message", (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error("[Live API] Error processing incoming audio packet:", err);
      }
    });

    clientWs.on("close", () => {
      if (session) {
        try {
          session.close();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Adaptive Learning Platform server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
