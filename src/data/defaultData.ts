import { StudentProfile, LearningPath, AssessmentQuestion, StudyResource, CuratedResource } from '../types';

export const PRESET_STUDENTS: StudentProfile[] = [
  {
    id: 'alex-chen',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Visual Learner • Game Dev & 3D Graphics',
    learningStyle: 'visual',
    pacing: 'standard',
    primaryInterest: 'Game Development & Graphics',
    secondaryInterests: ['Robotics & AI', '3D Shader Math', 'Cybersecurity'],
    interestEmoji: '🎮',
    skillLevel: 'intermediate',
    academicGoal: {
      category: 'career-bootcamp',
      title: 'Game Engine Architecture & Graphics Certification',
      targetMasteryPercent: 90,
      targetTimeline: '1-Month Intensive Sprint',
      prioritySubtopics: ['Spatial Partitioning', 'Recursive Tree Traversals', 'GPU Memory Optimization'],
    },
    currentStreakDays: 6,
    completedModulesCount: 14,
    overallMasteryScore: 72,
    recentTopics: ['Data Structures & Algorithms', 'Linear Algebra for Games', 'Pathfinding Algorithms'],
    subSkillMasteries: {
      'Array & Spatial Grids': 88,
      'Recursive Tree Traversals': 44,
      'Graph Search (A* / Dijkstra)': 62,
      'Dynamic Programming': 38,
      'Time/Space Complexity': 82,
    },
    diagnosedMisconceptions: [
      {
        id: 'misc-1',
        concept: 'Call Stack in Recursion',
        description: 'Assumes recursive returns overwrite previous frame values rather than unwinding back up.',
        detectedAt: 'Yesterday',
        resolved: false,
      },
      {
        id: 'misc-2',
        concept: 'Array vs Linked List in Memory',
        description: 'Confused contiguous memory cache locality with pointer hopping.',
        detectedAt: '3 days ago',
        resolved: true,
      },
    ],
  },
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    headline: 'Kinesthetic Builder • Climate & Marine Sensors',
    learningStyle: 'kinesthetic',
    pacing: 'deep-dive',
    primaryInterest: 'Climate Ecology & Ocean Sensors',
    secondaryInterests: ['Environmental IoT', 'Python Telemetry', 'Renewable Energy'],
    interestEmoji: '🌊',
    skillLevel: 'beginner',
    academicGoal: {
      category: 'academic-research',
      title: 'Oceanographic Telemetry Data Science Honor Thesis',
      targetMasteryPercent: 85,
      targetTimeline: '3-Month Academic Term',
      prioritySubtopics: ['Hypothesis Testing & p-values', 'Regression Residuals', 'Sensor Calibration'],
    },
    currentStreakDays: 12,
    completedModulesCount: 9,
    overallMasteryScore: 65,
    recentTopics: ['Applied Statistics & Data Science', 'Environmental Modeling', 'Python Data Pipelines'],
    subSkillMasteries: {
      'Hypothesis Testing & p-values': 48,
      'Normal Distributions & Z-scores': 78,
      'Correlation vs Causation': 85,
      'Regression Residuals': 52,
      'Data Cleaning & Imputation': 70,
    },
    diagnosedMisconceptions: [
      {
        id: 'misc-3',
        concept: 'p-value interpretation',
        description: 'Interpreted p < 0.05 as the probability that the null hypothesis is literally false.',
        detectedAt: '2 days ago',
        resolved: false,
      },
    ],
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: 'Conceptual Thinker • Orbital Mechanics & Aerospace',
    learningStyle: 'conceptual',
    pacing: 'accelerated',
    primaryInterest: 'Space Flight & Orbital Mechanics',
    secondaryInterests: ['Aerospace Propulsion', 'Numerical Simulation', 'Astrophysics'],
    interestEmoji: '🚀',
    skillLevel: 'advanced',
    academicGoal: {
      category: 'exam-prep',
      title: 'Graduate Aerospace Engineering Comprehensive Qualifying Exam',
      targetMasteryPercent: 95,
      targetTimeline: '2-Week Final Sprint',
      prioritySubtopics: ['Orbital Trajectories', 'Differential Equations', 'Euler-Lagrange Optimization'],
    },
    currentStreakDays: 18,
    completedModulesCount: 26,
    overallMasteryScore: 86,
    recentTopics: ['Differential Calculus', 'Orbital Trajectories', 'Numerical Methods'],
    subSkillMasteries: {
      'Limits & Continuity': 94,
      'Derivatives as Rates of Change': 91,
      'Chain Rule & Implicit Differentiation': 84,
      'Optimization & Critical Points': 76,
      'Differential Equations': 65,
    },
    diagnosedMisconceptions: [
      {
        id: 'misc-4',
        concept: 'Infinitesimals vs Limits',
        description: 'Treated dt as a tiny discrete number instead of an operational boundary approach.',
        detectedAt: '4 days ago',
        resolved: true,
      },
    ],
  },
];

export const SAMPLE_LEARNING_PATH_CS: LearningPath = {
  id: 'path-dsa-alex',
  topicTitle: 'Data Structures & Algorithms',
  topicCategory: 'Computer Science',
  targetGoal: 'Master Trees, Graphs & Dynamic Pathfinding for Game Mechanics',
  rationale: 'Calibrated for Alex (Visual Learner): High-contrast visual memory models, spatial dungeon-map analogies, and explicit recursion stack diagrams to eliminate the identified stack-unwinding misconception.',
  adaptationSummary: {
    styleEmphasis: 'Visual schematics & memory diagrams over raw code proofs',
    interestContext: 'Every algorithm contextualized as video game tilemaps, AI enemy pathfinding, and inventory slots',
    paceAdjustment: 'Standard pacing with targeted prerequisite scaffolding for recursion',
    gapFocus: 'Deep dive into Call Stack mechanics before advancing to Binary Search Trees',
  },
  overallProgress: 45,
  modules: [
    {
      id: 'mod-1',
      title: 'Memory Layout & Spatial Arrays',
      description: 'How contiguous memory buffers power high-speed game rendering and 2D grid coordinates.',
      status: 'completed',
      difficultyLevel: 1,
      estimatedMinutes: 20,
      learningStyleFocus: 'visual',
      interestHook: 'Building a 2D tilemap cache without stuttering framerates',
      keyConcepts: ['Contiguous RAM', 'Cache Lines', 'O(1) Index Lookup', 'Row-Major Order'],
      prerequisites: [],
      masteryScore: 92,
    },
    {
      id: 'mod-2',
      title: 'Scaffold Refresher: Visualizing the Call Stack',
      description: 'Adaptive remedial unit: trace recursive functions frame-by-frame as physical stacked trays.',
      status: 'completed',
      difficultyLevel: 2,
      estimatedMinutes: 25,
      learningStyleFocus: 'visual',
      interestHook: 'How the game engine pauses state when entering nested game menus',
      keyConcepts: ['Stack Frames', 'Base Case Triggers', 'Unwinding Return Values', 'Memory Limits'],
      prerequisites: ['mod-1'],
      isPrerequisiteRefresher: true,
      masteryScore: 84,
    },
    {
      id: 'mod-3',
      title: 'Binary Trees & Scene Graphs',
      description: 'Organizing 3D worlds, camera frustum hierarchies, and fast collision partitions.',
      status: 'in-progress',
      difficultyLevel: 3,
      estimatedMinutes: 35,
      learningStyleFocus: 'visual',
      interestHook: 'Bounding Volume Hierarchies (BVH) used in Unity & Unreal physics',
      keyConcepts: ['Node Pointers', 'In-Order Traversal', 'Tree Depth vs Height', 'Spatial Partitioning'],
      prerequisites: ['mod-2'],
      masteryScore: 68,
    },
    {
      id: 'mod-4',
      title: 'A* Pathfinding & Priority Queues',
      description: 'Adaptive graph search: heuristic distance metrics for smart NPC navigation around obstacles.',
      status: 'recommended',
      difficultyLevel: 4,
      estimatedMinutes: 45,
      learningStyleFocus: 'hands-on',
      interestHook: 'Programming an enemy stealth patrol that finds shortest route through maze',
      keyConcepts: ['Manhattan vs Euclidean Distance', 'Min-Heap Queues', 'Visited Sets', 'Relaxation'],
      prerequisites: ['mod-3'],
    },
    {
      id: 'mod-5',
      title: 'Dynamic Programming for Game State',
      description: 'Memoization and optimal sub-structure: solving complex combat combo damages in polynomial time.',
      status: 'locked',
      difficultyLevel: 5,
      estimatedMinutes: 50,
      learningStyleFocus: 'conceptual',
      interestHook: 'Calculating max combo damage paths across spell cooldown timelines',
      keyConcepts: ['Overlapping Subproblems', 'Memoization Table', 'Bottom-Up Tabulation'],
      prerequisites: ['mod-4'],
    },
  ],
};

export const SAMPLE_QUESTIONS_ALEX: AssessmentQuestion[] = [
  {
    id: 'q-1',
    prompt: 'In a recursive function traversing a game tree, what happens to local variables when a child recursive call returns to its parent?',
    contextScenario: 'Game AI: Checking possible future moves 3 turns ahead in a turn-based tactical game.',
    diagramAscii: `[Frame 3: Move Depth 3] -> return score (+10)
  ^
[Frame 2: Move Depth 2]  <- Unwinding here!
  ^
[Frame 1: Root Move]`,
    options: [
      {
        id: 'opt-a',
        text: 'The parent stack frame is popped from memory and local variables are overwritten.',
        isCorrect: false,
        explanation: 'Stack unwinding pops the *child* frame, restoring the exact previous state of the parent.',
        misconceptionIdentified: 'Call stack direction inverted: thinks parent is destroyed on return.',
      },
      {
        id: 'opt-b',
        text: 'The child frame is popped, and the parent resumes execution with its own preserved local variables exactly as they were.',
        isCorrect: true,
        explanation: 'Correct! Stack frames operate in LIFO order. When a child returns, only its frame is discarded; the parent remains intact.',
      },
      {
        id: 'opt-c',
        text: 'Local variables become global references to prevent re-calculating values.',
        isCorrect: false,
        explanation: 'Local variables remain strictly scoped to their stack activation record.',
        misconceptionIdentified: 'Confusing stack scoping with memoization caching.',
      },
      {
        id: 'opt-d',
        text: 'The CPU restarts execution from the first line of the parent function with child arguments.',
        isCorrect: false,
        explanation: 'Execution resumes at the instruction immediately following the recursive call site.',
        misconceptionIdentified: 'Confusing function return with recursive restart.',
      },
    ],
    hints: [
      'Think of stack frames like a deck of cards: you only remove the top card when that specific move finishes.',
      'The parent function paused right at the line where it called the child. When the child answers, where does the parent pick up?',
      'LIFO: The child frame disappears from the top, restoring the parent frame beneath with all its variables intact.',
    ],
    conceptTag: 'Call Stack Unwinding',
    difficulty: 2,
  },
  {
    id: 'q-2',
    prompt: 'A 2D game tilemap has 10,000 tiles. Why does a flat 1D array `index = y * width + x` outperform an array of linked list nodes for rendering passes?',
    contextScenario: 'Rendering Engine: 60 FPS loop looping through visible map coordinates every 16ms.',
    options: [
      {
        id: 'opt-a',
        text: 'Linked lists require O(log N) traversal for sequential reads.',
        isCorrect: false,
        explanation: 'Linked lists are O(N) for sequential iteration, but the real bottleneck in modern CPUs is memory cache misses.',
        misconceptionIdentified: 'Confusing asymptotic big-O with hardware cache architecture.',
      },
      {
        id: 'opt-b',
        text: 'Flat contiguous arrays utilize CPU cache prefetching lines; linked lists scatter pointer hops across RAM causing cache misses.',
        isCorrect: true,
        explanation: 'Spot on! Contiguous memory allows hardware prefetchers to load sequential blocks into L1/L2 cache before you even ask for them.',
      },
      {
        id: 'opt-c',
        text: 'Linked lists cannot hold numerical coordinates.',
        isCorrect: false,
        explanation: 'Linked list nodes can hold any data structure or coordinate tuple.',
      },
      {
        id: 'opt-d',
        text: '1D arrays automatically run on the GPU while linked lists can only execute on CPU.',
        isCorrect: false,
        explanation: 'Both reside in RAM unless explicitly uploaded as textures or compute buffers.',
      },
    ],
    hints: [
      'Focus on physical hardware RAM layout versus random heap pointer addresses.',
      'When your CPU reads memory address 0x1000, it also grabs the adjacent 64 bytes into its high-speed L1 cache.',
      'Contiguous spatial locality maximizes CPU cache hits, which is critical for 60 FPS loops.',
    ],
    conceptTag: 'Cache Locality & Memory Layout',
    difficulty: 3,
  },
  {
    id: 'q-3',
    prompt: 'You are partitioning collision checks between 500 game characters. Why is a Quadtree or Bounding Volume Hierarchy better than checking all pairs?',
    contextScenario: 'Physics Engine: Characters moving in an open-world arena.',
    options: [
      {
        id: 'opt-a',
        text: 'Checking all pairs takes O(N^2) (250,000 checks), while spatial trees eliminate checks for characters in distant quadrants, reducing to average O(N log N).',
        isCorrect: true,
        explanation: 'Exactly right! Spatial partitioning discards characters that are nowhere near each other before expensive polygon intersection math.',
      },
      {
        id: 'opt-b',
        text: 'Quadtrees reduce the mathematical count of characters by merging nearby sprites into one entity.',
        isCorrect: false,
        explanation: 'Entities remain independent; only their bounding boundaries are grouped hierarchically.',
      },
      {
        id: 'opt-c',
        text: 'Quadtrees guarantee that no collisions will ever happen, saving CPU time.',
        isCorrect: false,
        explanation: 'Collisions still occur; the tree only accelerates finding which pairs need testing.',
      },
      {
        id: 'opt-d',
        text: 'Spatial trees convert floating point coordinates into string keys.',
        isCorrect: false,
        explanation: 'Spatial trees organize bounding boxes into hierarchical spatial volumes.',
      },
    ],
    hints: [
      'Calculate 500 * 500 = 250,000 calculations per frame without spatial filtering.',
      'If two characters are in completely opposite corners of the map, do we need to test their hitboxes?',
      'Hierarchical bounding boxes let us skip an entire branch of characters with a single bounding-box test.',
    ],
    conceptTag: 'Spatial Partitioning & Complexity',
    difficulty: 3,
  },
];

export const SAMPLE_STUDY_RESOURCE_ALEX: StudyResource = {
  id: 'res-mod-3',
  moduleId: 'mod-3',
  title: 'Binary Trees & Spatial Partitioning (Visual Game Dev Guide)',
  type: 'concept-breakdown',
  content: {
    summary: 'A visual, intuitive breakdown of how hierarchical trees subdivide 2D/3D space so game engines only test collisions between objects in the same spatial cell.',
    coreExplanation: `Imagine your game world as a 1000x1000 meter map with 400 enemies. If you test every enemy against every other enemy, your CPU computes 400 * 399 / 2 = 79,800 polygon intersection checks every 16 milliseconds!

Instead of brute force, a Quadtree (2D) or Octree (3D) divides the arena into 4 quadrants (NW, NE, SW, SE).
- If a quadrant contains more than 4 enemies, it splits into 4 smaller sub-quadrants.
- When an arrow flies through quadrant NW, the game ONLY tests enemies inside quadrant NW!
- Quadrants NE, SW, and SE are skipped instantly in O(1) time.`,
    interestAnalogy: '🎮 Game Dev Analogy: Like zooming in on a mini-map radar. Instead of scanning the entire galaxy, the targeting radar only renders the sector your spaceship is currently flying through.',
    visualSchematic: `
+-----------------------+-----------------------+
|  Sector 0 (NW)        |  Sector 1 (NE)        |
|  [Player]             |  [Empty]              |
|  * Sub-divided:       |                       |
|   +-----+-----+       |                       |
|   |Enemy|Boss |       |                       |
|   +-----+-----+       |                       |
+-----------------------+-----------------------+
|  Sector 2 (SW)        |  Sector 3 (SE)        |
|  [Dungeon Entrance]   |  [3 Goblins Patrolling|
+-----------------------+-----------------------+
      Tree Hierarchy:
           Root Arena
         /    |    \\    \\
       NW    NE    SW    SE
      / \\
    NW1 NW2 (Player & Boss inside NW only!)
`,
    interactiveExercise: {
      challengePrompt: 'If a map has 8 enemies in Sector NW and 50 enemies in Sector SE, how many collision checks are needed between an arrow fired in Sector NW and the enemies in Sector SE?',
      options: ['0 checks (Sector SE is skipped completely)', '50 checks', '400 checks', '8 checks'],
      correctAnswer: '0 checks (Sector SE is skipped completely)',
      solutionExplanation: 'Because the arrow is bounded within Sector NW, the spatial tree test against Sector SE bounding box evaluates to FALSE, pruning all 50 SE enemies from the check pipeline immediately!',
    },
    bulletKeyTakeaways: [
      'Spatial trees prune search space from quadratic O(N²) down to logarithmic O(N log N).',
      'Leaf nodes only split when entity count exceeds threshold (typically 4-8 entities).',
      'Moving entities simply update their quadrant container as they cross boundary thresholds.',
    ],
    commonPitfalls: [
      'Rebuilding the entire tree from scratch every single frame (prefer loose quadtrees or updating only moved objects).',
      'Setting quadrant threshold to 1, causing excessive tree depth and memory fragmentation.',
    ],
  },
};

export const ADAPTIVE_QUESTION_BANK: AssessmentQuestion[] = [
  // Difficulty Level 1: Foundations
  {
    id: 'q-adaptive-l1',
    prompt: 'When indexing into a contiguous 1D array of 3D mesh vertices, what is the computational time complexity to retrieve element at index `k`?',
    contextScenario: 'Real-time rendering: retrieving vertex position coordinates from a geometry buffer.',
    diagramAscii: `Index:   [ 0 ]   [ 1 ]   [ 2 ]   ...   [ k ]\nAddress: 0x100   0x104   0x108         Base + (k * 4 bytes)\n-> Direct pointer arithmetic: 1 CPU instruction!`,
    options: [
      {
        id: 'opt-l1-a',
        text: 'O(1) Constant Time via direct hardware base-pointer offset calculation.',
        isCorrect: true,
        explanation: 'Correct! Memory addresses are calculated instantly as `baseAddress + index * elementSize` in a single CPU cycle.',
      },
      {
        id: 'opt-l1-b',
        text: 'O(log N) because the CPU must perform binary search across the indices.',
        isCorrect: false,
        explanation: 'Binary search is for searching unsorted values, not for indexing into known memory positions.',
        misconceptionIdentified: 'Confusing direct memory indexing with binary value search.',
      },
      {
        id: 'opt-l1-c',
        text: 'O(N) because each preceding element must be read into cache first.',
        isCorrect: false,
        explanation: 'Contiguous RAM does not require linear traversal; memory controllers jump directly to any byte.',
        misconceptionIdentified: 'Confusing linked list traversal with contiguous array indexing.',
      },
      {
        id: 'opt-l1-d',
        text: 'O(N^2) if the array is loaded on secondary storage.',
        isCorrect: false,
        explanation: 'Secondary storage latency is a hardware I/O factor, not a quadratic algorithmic complexity.',
      },
    ],
    hints: [
      'Think about pointer math: address = base + index * sizeof(float). How many math operations is that?',
      'Does the CPU need to read index 0, 1, 2 to find index 50?',
      'Direct memory offset means constant O(1) time regardless of array size.',
    ],
    conceptTag: 'Array Contiguity & Addressing',
    difficulty: 1,
  },

  // Difficulty Level 2: Core Mechanics (Recursion / Call Stack)
  {
    id: 'q-adaptive-l2',
    prompt: 'In a recursive depth-first tree traversal function, what happens to local variables when a child recursive invocation reaches its base case and returns?',
    contextScenario: 'Game AI: Checking possible future moves 3 turns ahead in a turn-based tactical game.',
    diagramAscii: `[Frame 3: Move Depth 3] -> Base Case Reached -> Returns Score (+10)\n  ^ (Popped from stack)\n[Frame 2: Move Depth 2]  <- Unwinding here! Parent state preserved.\n  ^ \n[Frame 1: Root Move]`,
    options: [
      {
        id: 'opt-l2-a',
        text: 'The child stack frame is popped from memory, and execution safely returns to the parent frame with all local variables exactly as they were.',
        isCorrect: true,
        explanation: 'Correct! Stack frames adhere to LIFO (Last In, First Out). The return destroys only the child activation record, leaving the parent intact.',
      },
      {
        id: 'opt-l2-b',
        text: 'The parent stack frame is popped from memory, and its variables are overwritten by the child.',
        isCorrect: false,
        explanation: 'Incorrect. The child is popped, not the parent. Stack unwinding restores parent execution.',
        misconceptionIdentified: 'Call stack direction inverted: assumes parent is destroyed when child returns.',
      },
      {
        id: 'opt-l2-c',
        text: 'All variables are converted to heap memory allocations automatically to prevent deallocation.',
        isCorrect: false,
        explanation: 'Local variables stay on the call stack unless explicitly allocated on the heap.',
        misconceptionIdentified: 'Confusing stack frame lifecycle with heap persistence.',
      },
      {
        id: 'opt-l2-d',
        text: 'The function restarts from line 1 of the root function with new arguments.',
        isCorrect: false,
        explanation: 'Returning from recursion resumes right after the recursive invocation site, not from the top.',
      },
    ],
    hints: [
      'Think of stack frames like trays in a cafeteria dispenser: the top tray is lifted off first.',
      'The parent function paused right at the line where it called the child. What happens when the child finishes?',
      'LIFO unwinding discards the child frame and restores the parent.',
    ],
    conceptTag: 'Call Stack in Recursion',
    difficulty: 2,
  },

  // Diagnostic Probe: Targeted Remedial Probe for Recursion
  {
    id: 'q-probe-recursion',
    prompt: 'DIAGNOSTIC PROBE: Consider `function count(n) { if (n <= 0) return 0; count(n - 1); return n; }`. What does `count(2)` return?',
    contextScenario: 'Targeted Diagnostic: Isolating execution flow when recursive frames unwind.',
    options: [
      {
        id: 'opt-probe-a',
        text: 'It returns 2, because the top-level call frame has n = 2 preserved when the child call returns.',
        isCorrect: true,
        explanation: 'Correct! When `count(1)` finishes, control returns to the `count(2)` frame where `n` is still 2.',
      },
      {
        id: 'opt-probe-b',
        text: 'It returns 0, because the base case return value overwrote all previous n values.',
        isCorrect: false,
        explanation: 'The return value of `count(n - 1)` was not even stored; the parent frame evaluates its own local `n`.',
        misconceptionIdentified: 'Assumes base-case return overwrites local variable bindings in ancestor frames.',
      },
      {
        id: 'opt-probe-c',
        text: 'It throws a stack overflow exception immediately.',
        isCorrect: false,
        explanation: 'n reaches 0 in just 3 frames (count(2) -> count(1) -> count(0)), safely hitting the base case.',
      },
    ],
    hints: [
      'Notice that the return statement says `return n`, not `return count(n-1)`.',
      'What was the value of `n` in the very first frame that was called?',
    ],
    conceptTag: 'Call Stack in Recursion',
    difficulty: 2,
    targetMisconceptionProbe: 'Call Stack in Recursion',
  },

  // Difficulty Level 3: Intermediate System Trade-offs
  {
    id: 'q-adaptive-l3',
    prompt: 'A 2D open-world game tests collisions between 600 characters every 16ms. Why does a Quadtree provide superior frame pacing compared to an O(N²) all-pairs check?',
    contextScenario: 'Physics Engine: maintaining smooth 60 FPS under heavy NPC density.',
    diagramAscii: `All-Pairs: 600 * 599 / 2 = 179,700 collision tests / frame!\nQuadtree:  Divide map into 4 quadrants.\n           Only test characters sharing the same leaf quadrant.\n           Tests drop to ~3,000 / frame!`,
    options: [
      {
        id: 'opt-l3-a',
        text: 'It hierarchically prunes characters located in distant sectors, eliminating ~98% of redundant geometry checks.',
        isCorrect: true,
        explanation: 'Correct! Spatial trees discard collision checks between entities that are nowhere near each other before expensive polygon math.',
      },
      {
        id: 'opt-l3-b',
        text: 'It compresses all 600 characters into a single combined sprite, avoiding calculations.',
        isCorrect: false,
        explanation: 'Quadtrees partition spatial volumes, they do not merge entity state.',
      },
      {
        id: 'opt-l3-c',
        text: 'It forces characters to move strictly along orthogonal grid axes.',
        isCorrect: false,
        explanation: 'Entities can move continuously in any direction; the tree simply updates their quadrant coordinates.',
      },
      {
        id: 'opt-l3-d',
        text: 'It transfers physics math from the CPU to audio hardware buffers.',
        isCorrect: false,
        explanation: 'Audio buffers process sound samples, not spatial collision hierarchies.',
      },
    ],
    hints: [
      'If two goblins are at opposite ends of a 5km island, should the CPU spend time checking if their swords overlap?',
      'Spatial hierarchy allows bounding box rejection in O(1) time per quadrant.',
      'Hierarchical partitioning cuts tests from O(N²) down to average O(N log N).',
    ],
    conceptTag: 'Spatial Partitioning & Complexity',
    difficulty: 3,
  },

  // Difficulty Level 4: Advanced Algorithmic Optimization
  {
    id: 'q-adaptive-l4',
    prompt: 'In an A* pathfinding implementation for enemy navigation, what occurs if your heuristic function h(n) OVERESTIMATES the true cost to reach the target goal?',
    contextScenario: 'Enemy AI: calculating shortest path across dynamic barricades.',
    options: [
      {
        id: 'opt-l4-a',
        text: 'The algorithm loses its guarantee of finding the mathematically shortest path (it is no longer admissible), though search may terminate faster.',
        isCorrect: true,
        explanation: 'Correct! An admissible heuristic must never overestimate true cost (h(n) <= h*(n)). Overestimating makes A* greedy and sub-optimal.',
      },
      {
        id: 'opt-l4-b',
        text: 'The search is guaranteed to enter an infinite loop and crash the game.',
        isCorrect: false,
        explanation: 'A* will still terminate as long as edge costs are positive; it just might return a sub-optimal route.',
        misconceptionIdentified: 'Confusing heuristic inaccuracy with infinite cycle failure.',
      },
      {
        id: 'opt-l4-c',
        text: 'The heuristic automatically transforms into Dijkstra algorithm.',
        isCorrect: false,
        explanation: 'Dijkstra corresponds to h(n) = 0 (underestimating completely, not overestimating).',
      },
      {
        id: 'opt-l4-d',
        text: 'Priority queue insertion changes from O(log V) to O(V²).',
        isCorrect: false,
        explanation: 'Priority queue complexity depends on heap data structure, not the numerical accuracy of heuristic weights.',
      },
    ],
    hints: [
      'Recall the formal definition of heuristic admissibility: h(n) must be an optimistic lower bound.',
      'If A* thinks a path is more expensive than it really is, will it overlook that path in favor of a worse one?',
      'Overestimating sacrifices shortest-path optimality.',
    ],
    conceptTag: 'A* Pathfinding & Heuristic Admissibility',
    difficulty: 4,
  },

  // Difficulty Level 5: Expert Mastery & Cache/Dynamic Programming
  {
    id: 'q-adaptive-l5',
    prompt: 'When implementing dynamic programming for complex game state simulations, why does a bottom-up tabulation approach in a contiguous 2D flat buffer typically outperform top-down recursive memoization by 5x-10x in release builds?',
    contextScenario: 'Combat Simulator: Evaluating multi-agent skill combinations across 1,000 game turns.',
    diagramAscii: `Top-Down Memoization:  Hash Table lookups + pointer chasing + call stack overhead.\nBottom-Up Tabulation:  Linear row-major buffer traversal -> 100% CPU L1 cache line prefetch hits!`,
    options: [
      {
        id: 'opt-l5-a',
        text: 'Bottom-up tabulation traverses contiguous memory sequentially, maximizing CPU cache prefetch hits and eliminating recursive call stack frame allocation overhead.',
        isCorrect: true,
        explanation: 'Spot on! Sequential memory access leverages hardware prefetchers and avoids the overhead of hash lookups and recursive activation records.',
      },
      {
        id: 'opt-l5-b',
        text: 'Bottom-up tabulation solves fewer subproblems mathematically than memoization.',
        isCorrect: false,
        explanation: 'Tabulation often solves all subproblems in the table, whereas memoization only solves reachable ones. Tabulation wins purely due to memory hardware throughput.',
        misconceptionIdentified: 'Believing tabulation computes fewer subproblems rather than recognizing hardware cache advantages.',
      },
      {
        id: 'opt-l5-c',
        text: 'Top-down memoization runs in exponential time O(2^N) while tabulation is always O(N).',
        isCorrect: false,
        explanation: 'Both achieve the exact same asymptotic polynomial time complexity; the difference is constant factor hardware cache performance.',
      },
      {
        id: 'opt-l5-d',
        text: 'Recursive memoization disables multi-threading permanently in the OS kernel.',
        isCorrect: false,
        explanation: 'Recursion has no effect on OS thread schedulers.',
      },
    ],
    hints: [
      'Focus on physical hardware execution: compare hash-map bucket pointer hops with sequential array loops.',
      'When your CPU reads memory sequentially, hardware prefetchers load adjacent 64-byte cache lines before instructions ask.',
      'Contiguous iteration + zero function frame overhead delivers massive hardware speedups.',
    ],
    conceptTag: 'Dynamic Programming & Cache Architecture',
    difficulty: 5,
  },
];

export const DEFAULT_CURATED_RESOURCES: CuratedResource[] = [
  {
    id: 'res-curated-1',
    title: 'Visualizing Recursion & The Call Stack (Unwinding Made Visually Concrete)',
    format: 'video',
    source: '3Blue1Brown / Computer Science Visualized',
    url: 'https://youtube.com',
    estimatedTime: '14 min video',
    difficulty: 'beginner',
    matchingInterest: 'Game Development & Graphics',
    targetedGap: 'Call Stack in Recursion',
    relevanceScore: 98,
    whyRecommended: 'Directly addresses your diagnosed misconception regarding call stack unwinding using animated 3D stack frames and game state rollback analogies.',
    keyTakeaways: [
      'Stack frames exist independently in memory; child returns never overwrite parent variables.',
      'LIFO unwinding restores execution immediately after the call site.',
      'Base cases act as the safety valve preventing infinite recursion stack overflow.',
    ],
    summary: 'A pristine, step-by-step visual dissection of recursive call stacks. Shows how activation records push onto the execution stack and unwind back up without mutating parent variables.',
    interactiveExerciseSnippet: {
      prompt: 'If function `traverse(depth)` calls `traverse(depth + 1)`, which frame is deallocated first when depth reaches 5?',
      options: ['The depth=5 frame (most recently pushed)', 'The depth=0 root frame', 'All frames simultaneously', 'The parent depth=4 frame'],
      correctIndex: 0,
      explanation: 'The call stack obeys Last-In-First-Out (LIFO). The most recently pushed frame (depth=5) is popped first upon returning.',
    },
  },
  {
    id: 'res-curated-2',
    title: 'Hardware Cache Locality: Why Contiguous Memory Destroys Linked Lists',
    format: 'article',
    source: 'MIT OpenCourseWare / Systems Architecture',
    url: 'https://ocw.mit.edu',
    estimatedTime: '10 min read',
    difficulty: 'intermediate',
    matchingInterest: 'Game Development & Graphics',
    targetedGap: 'Array vs Linked List in Memory',
    relevanceScore: 95,
    whyRecommended: 'Reinforces how modern CPU L1/L2 caches prefetch 64-byte blocks, illustrating why 1D arrays outperform pointer-hopping structures in 60 FPS engines.',
    keyTakeaways: [
      'A CPU cache miss costs ~200 cycles of idle latency waiting for main RAM.',
      'Contiguous array indexing triggers hardware prefetchers to load sequential blocks automatically.',
      'Spatial locality is the single largest performance factor in rendering and physics loops.',
    ],
    summary: 'An illuminating engineering guide on how CPU cache architectures interact with memory structures. Demonstrates why flat contiguous arrays are the cornerstone of real-time game loops.',
  },
  {
    id: 'res-curated-3',
    title: 'Interactive Quadtree Spatial Partitioning Sandbox',
    format: 'simulation',
    source: 'Interactive Computer Graphics Lab',
    url: 'https://github.com',
    estimatedTime: '20 min lab',
    difficulty: 'intermediate',
    matchingInterest: 'Game Development & Graphics',
    targetedGap: 'Spatial Partitioning & Complexity',
    relevanceScore: 92,
    whyRecommended: 'Hands-on interactive lab: adjust quadrant split thresholds in real time and watch collision checks plummet from 180,000 down to 2,400.',
    keyTakeaways: [
      'Spatial hierarchy enables logarithmic spatial querying.',
      'Leaf quadrant thresholds balance tree depth against iteration count.',
      'Objects only query collisions against peers in their immediate spatial leaf.',
    ],
    summary: 'An interactive 2D simulation canvas where you place 500 animated entities, trigger collision queries, and inspect bounding volume hierarchy partitions in real time.',
    interactiveExerciseSnippet: {
      prompt: 'What is the optimal threshold for splitting a quadtree node with 500 moving game characters?',
      options: ['4 to 8 entities per leaf node', '1 entity per node (extreme depth)', '250 entities (almost flat)', '500 entities (no partitioning)'],
      correctIndex: 0,
      explanation: 'Empirical benchmarks in game engines show 4-8 entities per leaf strikes the optimal balance between tree traversal depth and inner-leaf iteration.',
    },
  },
  {
    id: 'res-curated-4',
    title: 'Interpreting p-values & Statistical Significance in Sensor Data',
    format: 'article',
    source: 'Harvard Ecology & Marine Data Science Notes',
    url: 'https://harvard.edu',
    estimatedTime: '12 min read',
    difficulty: 'beginner',
    matchingInterest: 'Climate Ecology & Ocean Sensors',
    targetedGap: 'p-value interpretation',
    relevanceScore: 97,
    whyRecommended: 'Curated for Maya: resolves the common confusion between p-value probability and null hypothesis truth in real ocean sensor telemetry.',
    keyTakeaways: [
      'A p-value is P(Data | Null is True), NOT P(Null is False | Data).',
      'p < 0.05 indicates data is surprising under the null hypothesis, not that the hypothesis is disproven.',
      'Confidence intervals and effect sizes provide far more practical insight than p-values alone.',
    ],
    summary: 'A clear, intuitive guide demystifying p-values and hypothesis testing in the context of marine sensor data, temperature anomalies, and environmental telemetry.',
  },
  {
    id: 'res-curated-5',
    title: 'A* Pathfinding & Heuristic Admissibility Interactive Drill',
    format: 'exercise',
    source: 'Stanford CS Problem Set Suite',
    url: 'https://stanford.edu',
    estimatedTime: '15 min exercise',
    difficulty: 'advanced',
    matchingInterest: 'Game Development & Graphics',
    relevanceScore: 90,
    whyRecommended: 'Tests your ability to calibrate heuristics between Manhattan and Euclidean metrics across dynamic game obstacles.',
    keyTakeaways: [
      'Admissible heuristics guarantee shortest path optimality.',
      'Consistent heuristics guarantee monotonic f-cost progression without reopening closed nodes.',
      'Manhattan distance is admissible for 4-directional grid movement; Euclidean for 8-directional or continuous space.',
    ],
    summary: 'A step-by-step problem set testing your calculation of g(n), h(n), and f(n) scores, priority queue relaxation, and obstacle avoidance.',
    interactiveExerciseSnippet: {
      prompt: 'If moving between grid tiles has a cost of 1, is Euclidean distance sqrt(dx² + dy²) admissible for 4-way grid movement?',
      options: ['Yes, because Euclidean distance is always <= Manhattan distance (never overestimates)', 'No, because it produces non-integer floating point numbers', 'No, it overestimates the 4-way distance', 'Only if dx == dy'],
      correctIndex: 0,
      explanation: 'Euclidean distance is the straight-line distance, which is always less than or equal to the actual 4-way grid path (Manhattan). Since it never overestimates, it is admissible!',
    },
  },
  {
    id: 'res-curated-6',
    title: 'Numerical Integration in Orbital Trajectories: Verlet vs Euler',
    format: 'article',
    source: 'NASA JPL Flight Dynamics Technical Memo',
    url: 'https://jpl.nasa.gov',
    estimatedTime: '16 min read',
    difficulty: 'advanced',
    matchingInterest: 'Space Flight & Orbital Mechanics',
    relevanceScore: 94,
    whyRecommended: 'Curated for Marcus: addresses numerical drift in multi-body orbital simulations and symplectic integrators.',
    keyTakeaways: [
      'Standard Euler integration bleeds energy continuously, causing satellites to spiral outwards.',
      'Velocity Verlet and Runge-Kutta 4 conserve orbital energy over thousands of orbits.',
      'Symplectic integrators preserve phase-space volume in Hamiltonian systems.',
    ],
    summary: 'A technical deep-dive into numerical methods for aerospace simulations, comparing Euler, Verlet, and RK4 integrators for orbital stability.',
  },
];
