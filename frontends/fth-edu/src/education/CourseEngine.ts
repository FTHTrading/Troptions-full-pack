import { voiceEngine } from '../voice/VoiceEngine';
import { ammEngine } from '../amm/AMMEngine';

// Course Structure
interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  modules: Module[];
  rewards: {
    tokens: number;
    nft: string;
    certificate: boolean;
  };
  category: string;
}

interface Module {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  duration: number;
  quiz?: QuizQuestion[];
  codeExercise?: CodeExercise;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CodeExercise {
  instructions: string;
  starterCode: string;
  solution: string;
  validation: string;
}

interface UserProgress {
  userId: string;
  completedCourses: string[];
  completedModules: string[];
  quizScores: Record<string, number>;
  totalTokensEarned: number;
  streak: number;
  level: number;
  xp: number;
}

// Course Library
const COURSES: Course[] = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Fundamentals',
    description: 'Learn the basics of blockchain, wallets, and digital assets',
    difficulty: 'beginner',
    duration: 120,
    category: 'Blockchain',
    modules: [
      {
        id: 'cb-1',
        title: 'What is Blockchain?',
        type: 'text',
        duration: 15,
        content: `Blockchain is a distributed ledger technology that records transactions across multiple computers.

Think of it like a digital notebook that everyone can see, but no one can erase.

Key concepts:
- Decentralization: No single entity controls it
- Transparency: All transactions are visible
- Immutability: Once recorded, cannot be changed
- Consensus: Network agrees on the state`,
      },
      {
        id: 'cb-2',
        title: 'Understanding Wallets',
        type: 'interactive',
        duration: 20,
        content: 'Interactive wallet simulation...',
        quiz: [
          {
            question: 'What is a private key?',
            options: [
              'Your public address that others can see',
              'A secret code that proves ownership of your funds',
              'The password to your email',
              'A type of cryptocurrency',
            ],
            correctAnswer: 1,
            explanation: 'A private key is like the password to your bank account. Anyone with your private key can access your funds.',
          },
        ],
      },
      {
        id: 'cb-3',
        title: 'Your First Transaction',
        type: 'interactive',
        duration: 25,
        content: 'Practice sending test transactions on the XRPL Testnet',
        codeExercise: {
          instructions: 'Create a simple function to send 1 XRP to a test address',
          starterCode: `const { Client } = require('xrpl');

async function sendXRP() {
  // Your code here
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  
  // TODO: Connect, create wallet, send payment
}

sendXRP();`,
          solution: `const { Client, Wallet } = require('xrpl');

async function sendXRP() {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  
  const wallet = Wallet.fromSeed('snYOURTESTSEED');
  
  const payment = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Destination: 'rTESTADDRESS',
    Amount: '1000000', // 1 XRP in drops
  };
  
  const prepared = await client.autofill(payment);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  
  console.log('Transaction:', result.result.hash);
  await client.disconnect();
}

sendXRP();`,
          validation: 'Check if transaction was submitted successfully',
        },
      },
    ],
    rewards: {
      tokens: 50,
      nft: 'crypto-basics-cert',
      certificate: true,
    },
  },
  {
    id: 'amm-lp',
    title: 'Liquidity Pools & AMM',
    description: 'Master Automated Market Makers and yield farming',
    difficulty: 'intermediate',
    duration: 180,
    category: 'DeFi',
    modules: [
      {
        id: 'amm-1',
        title: 'How AMMs Work',
        type: 'text',
        duration: 20,
        content: `Automated Market Makers (AMMs) use math to price assets instead of order books.

The formula: x * y = k

Where:
- x = amount of Token A in pool
- y = amount of Token B in pool
- k = constant (never changes during swap)

Example:
Pool has 1000 XRP and 1000 RLUSD
If someone swaps 100 XRP for RLUSD:
New XRP = 1100
New RLUSD = (1000 * 1000) / 1100 = 909.09
They receive: 1000 - 909.09 = 90.91 RLUSD`,
      },
      {
        id: 'amm-2',
        title: 'Impermanent Loss Explained',
        type: 'video',
        duration: 15,
        content: 'Video explanation with interactive calculator...',
      },
      {
        id: 'amm-3',
        title: 'Build Your First LP Position',
        type: 'interactive',
        duration: 30,
        content: 'Create a liquidity pool position using the AMM engine',
        codeExercise: {
          instructions: 'Add liquidity to the XRP/RLUSD pool',
          starterCode: `import { ammEngine } from './amm/AMMEngine';

async function addLiquidity() {
  // TODO: Add 100 XRP and 100 RLUSD to pool
  
  const result = await ammEngine.addLiquidity(
    'pool-id',
    '100',
    '100',
    wallet
  );
  
  console.log('LP Tokens:', result.lpTokensMinted);
}

addLiquidity();`,
          solution: `import { ammEngine } from './amm/AMMEngine';

async function addLiquidity() {
  const poolId = await ammEngine.createPool('XRP', 'RLUSD', '1000', '1000');
  
  const result = await ammEngine.addLiquidity(
    poolId,
    '100',
    '100',
    wallet
  );
  
  console.log('LP Tokens:', result.lpTokensMinted);
  console.log('Position:', result.position);
  console.log('APR:', await ammEngine.getPoolAPR(poolId));
}

addLiquidity();`,
          validation: 'Verify LP tokens were minted and position tracked',
        },
      },
    ],
    rewards: {
      tokens: 100,
      nft: 'amm-master-cert',
      certificate: true,
    },
  },
  {
    id: 'troptions-ecosystem',
    title: 'TROPTIONS Ecosystem Mastery',
    description: 'Deep dive into the TROPTIONS platform, $PICK token, and World Cup 2026',
    difficulty: 'advanced',
    duration: 240,
    category: 'Ecosystem',
    modules: [
      {
        id: 'te-1',
        title: 'TROPTIONS History & Evolution',
        type: 'text',
        duration: 25,
        content: `TROPTIONS: From Trade Currency to Tokenized Economy

Founded: 2003 (22 years of operation)
Evolution:
1. 2003-2010: Trade currency for business barter
2. 2010-2018: Digital asset on blockchain
3. 2018-2024: Multi-chain token economy
4. 2024+: Full DeFi ecosystem with $PICK

Key Milestones:
- 2019: Survived Missouri regulatory challenge (dismissed)
- 2023: $175M USDC issued on XRPL
- 2024: 89+ deployed sites, 27 Rust crates
- 2025: World Cup 2026 Atlanta integration
- 2026: Launch of TROPTIONS EDU AI app`,
      },
      {
        id: 'te-2',
        title: '$PICK Tokenomics',
        type: 'interactive',
        duration: 30,
        content: 'Explore $PICK token utility, staking, and governance',
        quiz: [
          {
            question: 'What is the maximum supply of $PICK?',
            options: ['10 million', '1 million', '100 million', 'Unlimited'],
            correctAnswer: 1,
            explanation: '$PICK has a maximum supply of 1 million tokens, creating scarcity and value appreciation potential.',
          },
          {
            question: 'How do you earn $PICK in the EDU app?',
            options: [
              'Buy on exchange only',
              'Complete courses and quizzes',
              'Mining with computers',
              'Airdrops only',
            ],
            correctAnswer: 1,
            explanation: 'Users earn $PICK by completing courses, passing quizzes, and maintaining learning streaks.',
          },
        ],
      },
      {
        id: 'te-3',
        title: 'World Cup 2026 Integration',
        type: 'interactive',
        duration: 35,
        content: 'Build a World Cup sponsorship smart contract',
        codeExercise: {
          instructions: 'Create a sponsorship contract for WC2026',
          starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WCSponsorship {
    // TODO: Implement sponsorship tiers
    // - Local Vendor ($500)
    // - Regional Partner ($2,500)
    // - Global Sponsor ($10,000)
    
    struct Sponsor {
        address wallet;
        string tier;
        uint256 amount;
        bool active;
    }
    
    mapping(address => Sponsor) public sponsors;
    
    function becomeSponsor(string memory tier) external payable {
        // Implementation needed
    }
}`,
          solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WCSponsorship {
    struct Sponsor {
        address wallet;
        string tier;
        uint256 amount;
        uint256 pickTokens;
        bool active;
        uint256 timestamp;
    }
    
    mapping(address => Sponsor) public sponsors;
    mapping(string => uint256) public tierPrices;
    mapping(string => uint256) public tierRewards;
    
    address public owner;
    uint256 public totalSponsors;
    
    event SponsorshipCreated(address indexed sponsor, string tier, uint256 amount);
    event TokensDistributed(address indexed sponsor, uint256 amount);
    
    constructor() {
        owner = msg.sender;
        
        // Set tier pricing
        tierPrices['Local'] = 500;
        tierPrices['Regional'] = 2500;
        tierPrices['Global'] = 10000;
        
        // Set $PICK rewards
        tierRewards['Local'] = 500;
        tierRewards['Regional'] = 2500;
        tierRewards['Global'] = 10000;
    }
    
    function becomeSponsor(string memory tier) external payable {
        require(tierPrices[tier] > 0, "Invalid tier");
        require(msg.value >= tierPrices[tier], "Insufficient payment");
        require(!sponsors[msg.sender].active, "Already a sponsor");
        
        sponsors[msg.sender] = Sponsor({
            wallet: msg.sender,
            tier: tier,
            amount: msg.value,
            pickTokens: tierRewards[tier],
            active: true,
            timestamp: block.timestamp
        });
        
        totalSponsors++;
        
        emit SponsorshipCreated(msg.sender, tier, msg.value);
        emit TokensDistributed(msg.sender, tierRewards[tier]);
    }
    
    function distributePICK(address sponsor) external {
        require(msg.sender == owner, "Only owner");
        require(sponsors[sponsor].active, "Not a sponsor");
        
        // Transfer $PICK tokens to sponsor
        // Implementation depends on token contract
    }
}`,
          validation: 'Verify contract compiles and tier system works',
        },
      },
    ],
    rewards: {
      tokens: 200,
      nft: 'troptions-master-cert',
      certificate: true,
    },
  },
];

export class CourseEngine {
  private userProgress: Map<string, UserProgress> = new Map();
  private courses: Map<string, Course> = new Map();
  
  constructor() {
    // Load courses
    COURSES.forEach(course => this.courses.set(course.id, course));
  }
  
  // Get all courses
  getCourses(): Course[] {
    return Array.from(this.courses.values());
  }
  
  // Get course by ID
  getCourse(courseId: string): Course | undefined {
    return this.courses.get(courseId);
  }
  
  // Get courses by category
  getCoursesByCategory(category: string): Course[] {
    return this.getCourses().filter(c => c.category === category);
  }
  
  // Get courses by difficulty
  getCoursesByDifficulty(difficulty: string): Course[] {
    return this.getCourses().filter(c => c.difficulty === difficulty);
  }
  
  // Start course for user
  async startCourse(userId: string, courseId: string): Promise<void> {
    const progress = this.getOrCreateProgress(userId);
    
    if (!progress.completedCourses.includes(courseId)) {
      // Initialize course progress
      console.log(`User ${userId} started course ${courseId}`);
      
      // Speak welcome message
      await voiceEngine.speak(`Welcome to ${this.courses.get(courseId)?.title}. Let's begin your learning journey!`);
    }
  }
  
  // Complete module
  async completeModule(userId: string, courseId: string, moduleId: string): Promise<void> {
    const progress = this.getOrCreateProgress(userId);
    
    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      progress.xp += 10;
      
      // Check for level up
      const newLevel = Math.floor(progress.xp / 100) + 1;
      if (newLevel > progress.level) {
        progress.level = newLevel;
        await voiceEngine.speak(`Congratulations! You've reached level ${newLevel}!`);
      }
      
      this.userProgress.set(userId, progress);
    }
  }
  
  // Submit quiz
  async submitQuiz(
    userId: string,
    courseId: string,
    moduleId: string,
    answers: number[]
  ): Promise<{ score: number; passed: boolean }> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error('Course not found');
    
    const module = course.modules.find(m => m.id === moduleId);
    if (!module?.quiz) throw new Error('No quiz found');
    
    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    
    const score = (correct / module.quiz.length) * 100;
    const passed = score >= 70;
    
    const progress = this.getOrCreateProgress(userId);
    progress.quizScores[`${courseId}-${moduleId}`] = score;
    
    if (passed) {
      progress.xp += 25;
      progress.totalTokensEarned += course.rewards.tokens / course.modules.length;
      await voiceEngine.speak(`Great job! You scored ${score.toFixed(0)}% and earned ${course.rewards.tokens / course.modules.length} $PICK tokens!`);
    } else {
      await voiceEngine.speak(`You scored ${score.toFixed(0)}%. Keep studying and try again!`);
    }
    
    this.userProgress.set(userId, progress);
    
    return { score, passed };
  }
  
  // Complete course
  async completeCourse(userId: string, courseId: string): Promise<void> {
    const progress = this.getOrCreateProgress(userId);
    const course = this.courses.get(courseId);
    
    if (!course) return;
    
    if (!progress.completedCourses.includes(courseId)) {
      progress.completedCourses.push(courseId);
      progress.totalTokensEarned += course.rewards.tokens;
      progress.xp += 100;
      progress.streak += 1;
      
      // Award certificate
      if (course.rewards.certificate) {
        console.log(`Awarding certificate: ${course.rewards.nft}`);
      }
      
      await voiceEngine.speak(
        `Congratulations! You've completed ${course.title} and earned ${course.rewards.tokens} $PICK tokens!`
      );
      
      this.userProgress.set(userId, progress);
    }
  }
  
  // Get user progress
  getProgress(userId: string): UserProgress {
    return this.getOrCreateProgress(userId);
  }
  
  // Get leaderboard
  getLeaderboard(limit: number = 10): UserProgress[] {
    return Array.from(this.userProgress.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }
  
  // Get or create user progress
  private getOrCreateProgress(userId: string): UserProgress {
    let progress = this.userProgress.get(userId);
    
    if (!progress) {
      progress = {
        userId,
        completedCourses: [],
        completedModules: [],
        quizScores: {},
        totalTokensEarned: 0,
        streak: 0,
        level: 1,
        xp: 0,
      };
      this.userProgress.set(userId, progress);
    }
    
    return progress;
  }
}

// Singleton
export const courseEngine = new CourseEngine();