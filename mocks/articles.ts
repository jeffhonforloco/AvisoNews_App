import { Article } from "@/types/news";

export const mockArticles: Article[] = [
  {
    id: "1",
    sourceId: "techcrunch",
    sourceName: "TechCrunch",
    source: "TechCrunch",
    category: "tech",
    title: "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
    titleAi: "GPT-5 Breakthrough: AI Now Reasons Like Human Experts",
    excerpt: "OpenAI has unveiled GPT-5, featuring unprecedented reasoning abilities that rival human experts across multiple domains. The new model demonstrates complex problem-solving skills and enhanced contextual understanding.",
    tldr: "OpenAI's GPT-5 shows human-level reasoning across domains. Major leap in AI problem-solving and contextual understanding capabilities.",
    summary: "OpenAI has unveiled GPT-5, featuring unprecedented reasoning abilities that rival human experts across multiple domains.",
    featured: true,
    breaking: true,
    tags: ["AI", "OpenAI", "Machine Learning", "GPT-5"],
    canonicalUrl: "https://techcrunch.com/openai-gpt5-announcement",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    publishedAt: "2 hours ago",
    importedAt: "2025-01-14T10:00:00Z",
    status: "published",
    viewCount: 15234,
    trending: true,
    readTime: 5,
    audioUrl: "https://example.com/audio/gpt5-announcement.mp3",
    isPremium: false,
    trustScore: {
      overall: 85,
      sourceCredibility: 88,
      factualAccuracy: 82,
      transparency: 85,
      editorial: 87,
      lastUpdated: "2025-01-14T10:00:00Z"
    },
    biasAnalysis: {
      political: { score: 5, label: "Slightly Right", confidence: 0.7 },
      emotional: { score: 15, label: "Positive", confidence: 0.8 },
      factual: { score: 85, label: "High Factual", confidence: 0.9 },
      overall: "center-right",
      confidence: 0.8
    },
    factCheck: {
      status: "verified",
      confidence: 0.9,
      sources: ["OpenAI Official", "Reuters", "Associated Press"],
      lastChecked: "2025-01-14T10:30:00Z",
      details: "Verified through official OpenAI announcement and multiple independent sources."
    },
    coverage: {
      perspectives: 8,
      sources: 15,
      geographic: ["US", "Europe", "Asia"],
      political: ["Center", "Left", "Right"],
      completeness: 85
    },
    aggregatorData: {
      totalSources: 15,
      politicalBias: {
        left: 20,
        centerLeft: 25,
        center: 30,
        centerRight: 15,
        right: 10
      },
      averageTrustScore: 82,
      factCheckStatus: "verified",
      controversyLevel: 25,
      coverageGaps: ["Independent Analysis", "Academic Perspective"],
      sourceEvolution: {
        timeline: [
          {
            timestamp: "2025-01-14T08:00:00Z",
            source: "OpenAI",
            headline: "GPT-5 Official Announcement",
            trustScore: 95,
            significance: "breaking"
          },
          {
            timestamp: "2025-01-14T08:30:00Z",
            source: "TechCrunch",
            headline: "GPT-5 Breakthrough Analysis",
            trustScore: 88,
            significance: "major"
          },
          {
            timestamp: "2025-01-14T09:00:00Z",
            source: "The Verge",
            headline: "What GPT-5 Means for AI",
            trustScore: 85,
            significance: "major"
          },
          {
            timestamp: "2025-01-14T09:30:00Z",
            source: "Wired",
            headline: "GPT-5 Technical Deep Dive",
            trustScore: 90,
            significance: "minor"
          },
          {
            timestamp: "2025-01-14T10:00:00Z",
            source: "Reuters",
            headline: "Industry Reacts to GPT-5",
            trustScore: 92,
            significance: "minor"
          }
        ],
        consensusLevel: 85
      }
    }
  },
  {
    id: "2",
    sourceId: "bloomberg",
    sourceName: "Bloomberg",
    source: "Bloomberg",
    category: "business",
    title: "Apple Stock Hits Record High After Vision Pro Sales Exceed Expectations",
    titleAi: "Apple Soars to Record on Vision Pro Success",
    excerpt: "Apple shares reached an all-time high following reports that Vision Pro sales have exceeded analyst expectations by 40%. The spatial computing device has seen strong adoption in enterprise markets.",
    tldr: "Apple stock hits record high as Vision Pro sales beat expectations by 40%. Strong enterprise adoption drives growth.",
    summary: "Apple shares reached an all-time high following reports that Vision Pro sales have exceeded analyst expectations by 40%.",
    breaking: true,
    tags: ["Apple", "Stocks", "Vision Pro", "Markets"],
    canonicalUrl: "https://bloomberg.com/apple-vision-pro-sales",
    imageUrl: "https://images.unsplash.com/photo-1611174743420-3d7df880ce32?w=800&h=600&fit=crop",
    publishedAt: "4 hours ago",
    importedAt: "2025-01-14T08:00:00Z",
    status: "published",
    viewCount: 8921,
    trending: true,
    readTime: 3,
    isPremium: true,
    trustScore: {
      overall: 92,
      sourceCredibility: 95,
      factualAccuracy: 90,
      transparency: 88,
      editorial: 94,
      lastUpdated: "2025-01-14T08:00:00Z"
    },
    biasAnalysis: {
      political: { score: -10, label: "Slightly Left", confidence: 0.6 },
      emotional: { score: 20, label: "Positive", confidence: 0.7 },
      factual: { score: 90, label: "Very High Factual", confidence: 0.95 },
      overall: "center-left",
      confidence: 0.75
    },
    factCheck: {
      status: "verified",
      confidence: 0.95,
      sources: ["Apple Inc.", "SEC Filings", "Market Data"],
      lastChecked: "2025-01-14T08:15:00Z"
    },
    coverage: {
      perspectives: 12,
      sources: 25,
      geographic: ["US", "Europe", "Asia", "Global"],
      political: ["Center", "Left", "Right", "Business"],
      completeness: 92
    },
    aggregatorData: {
      totalSources: 25,
      politicalBias: {
        left: 15,
        centerLeft: 20,
        center: 35,
        centerRight: 20,
        right: 10
      },
      averageTrustScore: 88,
      factCheckStatus: "verified",
      controversyLevel: 15,
      coverageGaps: ["Consumer Perspective"],
      sourceEvolution: {
        timeline: [
          {
            timestamp: "2025-01-14T06:00:00Z",
            source: "Apple",
            headline: "Vision Pro Sales Update",
            trustScore: 95,
            significance: "breaking"
          },
          {
            timestamp: "2025-01-14T06:30:00Z",
            source: "Bloomberg",
            headline: "Apple Stock Surges on Vision Pro",
            trustScore: 92,
            significance: "major"
          },
          {
            timestamp: "2025-01-14T07:00:00Z",
            source: "CNBC",
            headline: "Wall Street Reacts to Apple News",
            trustScore: 85,
            significance: "major"
          }
        ],
        consensusLevel: 92
      }
    }
  },
  {
    id: "3",
    sourceId: "bbc",
    sourceName: "BBC News",
    source: "BBC News",
    category: "world",
    title: "EU Announces Historic Climate Agreement with Major Industrial Nations",
    titleAi: "EU Seals Landmark Climate Deal with Industrial Powers",
    excerpt: "The European Union has reached a groundbreaking climate agreement with major industrial nations, committing to reduce emissions by 60% by 2035. The deal includes $500 billion in green technology investments.",
    tldr: "EU and industrial nations agree to 60% emission cuts by 2035. $500 billion pledged for green technology investments.",
    summary: "The European Union has reached a groundbreaking climate agreement with major industrial nations, committing to reduce emissions by 60% by 2035.",
    breaking: true,
    tags: ["Climate", "EU", "Environment", "Policy"],
    canonicalUrl: "https://bbc.com/eu-climate-agreement",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop",
    publishedAt: "6 hours ago",
    importedAt: "2025-01-14T06:00:00Z",
    status: "published",
    viewCount: 12456,
    trending: true,
    readTime: 4,
    audioUrl: "https://example.com/audio/eu-climate-deal.mp3",
    trustScore: {
      overall: 88,
      sourceCredibility: 92,
      factualAccuracy: 85,
      transparency: 90,
      editorial: 85,
      lastUpdated: "2025-01-14T06:00:00Z"
    },
    biasAnalysis: {
      political: { score: 0, label: "Center", confidence: 0.85 },
      emotional: { score: 10, label: "Neutral-Positive", confidence: 0.8 },
      factual: { score: 88, label: "High Factual", confidence: 0.9 },
      overall: "center",
      confidence: 0.85
    },
    factCheck: {
      status: "verified",
      confidence: 0.88,
      sources: ["EU Commission", "Reuters", "Associated Press", "Financial Times"],
      lastChecked: "2025-01-14T06:30:00Z"
    },
    coverage: {
      perspectives: 15,
      sources: 35,
      geographic: ["Europe", "US", "Asia", "Global"],
      political: ["Left", "Center", "Right", "Green"],
      completeness: 88
    },
    aggregatorData: {
      totalSources: 35,
      politicalBias: {
        left: 30,
        centerLeft: 25,
        center: 25,
        centerRight: 15,
        right: 5
      },
      averageTrustScore: 85,
      factCheckStatus: "verified",
      controversyLevel: 35,
      coverageGaps: ["Industry Perspective", "Developing Nations"],
      sourceEvolution: {
        timeline: [
          {
            timestamp: "2025-01-14T04:00:00Z",
            source: "EU Commission",
            headline: "Historic Climate Agreement Reached",
            trustScore: 95,
            significance: "breaking"
          },
          {
            timestamp: "2025-01-14T04:30:00Z",
            source: "BBC",
            headline: "EU Climate Deal Analysis",
            trustScore: 88,
            significance: "major"
          },
          {
            timestamp: "2025-01-14T05:00:00Z",
            source: "Reuters",
            headline: "Global Reaction to Climate Pact",
            trustScore: 90,
            significance: "major"
          },
          {
            timestamp: "2025-01-14T05:30:00Z",
            source: "Guardian",
            headline: "Environmental Groups Praise Deal",
            trustScore: 82,
            significance: "minor"
          }
        ],
        consensusLevel: 78
      }
    }
  },
  {
    id: "4",
    sourceId: "wired",
    sourceName: "WIRED",
    source: "WIRED",
    category: "tech",
    title: "Quantum Computer Achieves Breakthrough in Drug Discovery Simulation",
    titleAi: "Quantum Leap: New Drug Discovery via Quantum Computing",
    excerpt: "Researchers have successfully used a quantum computer to simulate complex molecular interactions, potentially accelerating drug discovery by decades. The breakthrough could revolutionize pharmaceutical research.",
    tldr: "Quantum computer simulates complex molecules for drug discovery. Could accelerate pharmaceutical research by decades.",
    summary: "Researchers have successfully used a quantum computer to simulate complex molecular interactions, potentially accelerating drug discovery by decades.",
    tags: ["Quantum Computing", "Healthcare", "Science", "Innovation"],
    canonicalUrl: "https://wired.com/quantum-drug-discovery",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    publishedAt: "8 hours ago",
    importedAt: "2025-01-14T04:00:00Z",
    status: "published",
    viewCount: 6789,
    readTime: 6,
  },
  {
    id: "5",
    sourceId: "cnbc",
    sourceName: "CNBC",
    source: "CNBC",
    category: "business",
    title: "Tesla Announces Revolutionary Battery Technology with 1000-Mile Range",
    titleAi: "Tesla's 1000-Mile Battery Changes EV Game",
    excerpt: "Tesla has unveiled a new battery technology that enables electric vehicles to travel over 1000 miles on a single charge. The breakthrough uses a novel lithium-metal design with enhanced energy density.",
    tldr: "Tesla reveals battery tech enabling 1000-mile EV range. Novel lithium-metal design offers enhanced energy density.",
    summary: "Tesla has unveiled a new battery technology that enables electric vehicles to travel over 1000 miles on a single charge.",
    tags: ["Tesla", "EV", "Battery", "Innovation"],
    canonicalUrl: "https://cnbc.com/tesla-battery-breakthrough",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    publishedAt: "10 hours ago",
    importedAt: "2025-01-14T02:00:00Z",
    status: "published",
    viewCount: 9876,
    trending: true,
    readTime: 4,
  },
  {
    id: "6",
    sourceId: "npr",
    sourceName: "NPR",
    source: "NPR",
    category: "world",
    title: "Japan Launches First Commercial Space Station Module",
    titleAi: "Japan Enters Space Race with Commercial Station",
    excerpt: "Japan has successfully launched its first commercial space station module, marking a significant milestone in the country's space program. The module will support research and manufacturing in zero gravity.",
    tldr: "Japan launches first commercial space station module. Will support zero-gravity research and manufacturing operations.",
    summary: "Japan has successfully launched its first commercial space station module, marking a significant milestone in the country's space program.",
    tags: ["Space", "Japan", "Technology", "Innovation"],
    canonicalUrl: "https://npr.org/japan-space-station",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
    publishedAt: "12 hours ago",
    importedAt: "2025-01-14T00:00:00Z",
    status: "published",
    viewCount: 5432,
    readTime: 3,
  },
  {
    id: "7",
    sourceId: "verge",
    sourceName: "The Verge",
    source: "The Verge",
    category: "tech",
    title: "Microsoft Integrates AI Copilot Across Entire Windows Ecosystem",
    titleAi: "Windows Gets AI Makeover with Universal Copilot",
    excerpt: "Microsoft has announced the integration of AI Copilot across all Windows applications, bringing intelligent assistance to every aspect of the operating system. The update includes advanced code generation and creative tools.",
    tldr: "Microsoft adds AI Copilot to all Windows apps. Features include code generation and creative assistance tools.",
    summary: "Microsoft has announced the integration of AI Copilot across all Windows applications, bringing intelligent assistance to every aspect of the operating system.",
    tags: ["Microsoft", "AI", "Windows", "Copilot"],
    canonicalUrl: "https://theverge.com/microsoft-copilot-windows",
    imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=600&fit=crop",
    publishedAt: "14 hours ago",
    importedAt: "2025-01-13T22:00:00Z",
    status: "published",
    viewCount: 7654,
    readTime: 5,
  },
  {
    id: "8",
    sourceId: "marketwatch",
    sourceName: "MarketWatch",
    source: "MarketWatch",
    category: "business",
    title: "Federal Reserve Signals Potential Rate Cuts Amid Economic Slowdown",
    titleAi: "Fed Hints at Rate Cuts as Economy Cools",
    excerpt: "The Federal Reserve has indicated potential interest rate cuts in response to slowing economic growth. Markets rallied on the news, with major indices posting significant gains.",
    tldr: "Fed signals possible rate cuts due to economic slowdown. Markets rally with major indices posting gains.",
    summary: "The Federal Reserve has indicated potential interest rate cuts in response to slowing economic growth.",
    tags: ["Federal Reserve", "Economy", "Interest Rates", "Markets"],
    canonicalUrl: "https://marketwatch.com/fed-rate-cuts",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    publishedAt: "16 hours ago",
    importedAt: "2025-01-13T20:00:00Z",
    status: "published",
    viewCount: 11234,
    trending: true,
    readTime: 4,
    factCheck: {
      status: "disputed",
      confidence: 0.65,
      sources: ["Federal Reserve", "Economic Analysis"],
      lastChecked: "2025-01-13T20:30:00Z",
      details: "Some economists dispute the interpretation of Fed signals."
    },
    trustScore: {
      overall: 75,
      sourceCredibility: 78,
      factualAccuracy: 72,
      transparency: 75,
      editorial: 76,
      lastUpdated: "2025-01-13T20:00:00Z"
    },
    biasAnalysis: {
      political: { score: 8, label: "Slightly Right", confidence: 0.7 },
      emotional: { score: 25, label: "Positive", confidence: 0.75 },
      factual: { score: 75, label: "Mostly Factual", confidence: 0.8 },
      overall: "center-right",
      confidence: 0.75
    }
  },
  {
    id: "9",
    sourceId: "arstechnica",
    sourceName: "Ars Technica",
    source: "Ars Technica",
    category: "tech",
    title: "Linux Kernel 7.0 Released with Major Performance Improvements",
    titleAi: "Linux 7.0 Delivers Game-Changing Performance",
    excerpt: "The Linux kernel 7.0 has been released with significant performance improvements and enhanced hardware support. The update includes optimizations for modern processors and improved power management.",
    tldr: "Linux kernel 7.0 released with major performance gains. Includes modern processor optimizations and better power management.",
    summary: "The Linux kernel 7.0 has been released with significant performance improvements and enhanced hardware support.",
    tags: ["Linux", "Open Source", "Technology", "Software"],
    canonicalUrl: "https://arstechnica.com/linux-kernel-7",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop",
    publishedAt: "18 hours ago",
    importedAt: "2025-01-13T18:00:00Z",
    status: "published",
    viewCount: 4567,
    readTime: 6,
  },
  {
    id: "10",
    sourceId: "bbc",
    sourceName: "BBC News",
    source: "BBC News",
    category: "world",
    title: "Antarctica Research Station Discovers Ancient Microbial Life",
    titleAi: "Ancient Life Found Deep in Antarctic Ice",
    excerpt: "Scientists at an Antarctic research station have discovered ancient microbial life preserved in ice cores dating back millions of years. The discovery could provide insights into evolution and climate history.",
    tldr: "Ancient microbes discovered in Antarctic ice cores. Finding offers insights into evolution and Earth's climate history.",
    summary: "Scientists at an Antarctic research station have discovered ancient microbial life preserved in ice cores dating back millions of years.",
    tags: ["Science", "Antarctica", "Discovery", "Climate"],
    canonicalUrl: "https://bbc.com/antarctica-discovery",
    imageUrl: "https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800&h=600&fit=crop",
    publishedAt: "20 hours ago",
    importedAt: "2025-01-13T16:00:00Z",
    status: "published",
    viewCount: 8901,
    readTime: 5,
  },
];