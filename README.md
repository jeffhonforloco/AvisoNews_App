# AvisoNews 2.0

**Your Trusted News Source - Premium News Platform**

AvisoNews is a world-class news aggregation platform that combines automated news aggregation from sources worldwide with human-curated content. Built with React Native and Expo, it delivers a premium news reading experience that rivals and exceeds Apple News.

## 🌟 Features

### Core Features
- **Automated News Aggregation**: Real-time news from sources worldwide
- **Human-Curated Content**: Expertly selected stories for quality
- **Source Intelligence**: Trust scores, bias analysis, and fact-checking
- **Multiple Perspectives**: View stories from different viewpoints
- **Breaking News**: Real-time breaking news alerts
- **Audio Articles**: Listen to articles with text-to-speech
- **Offline Reading**: Download articles for offline access
- **Personalization**: Customized feeds based on preferences

### Premium Features
- **Trust Metrics**: Comprehensive source credibility analysis
- **Bias Detection**: Political and emotional bias analysis
- **Fact Checking**: Integrated fact-checking from multiple sources
- **Coverage Analysis**: See how different sources cover stories
- **Story Evolution**: Track how stories develop over time

## 🎨 Design

AvisoNews 2.0 features a premium design system with:
- Modern, sophisticated color palette
- Enhanced typography for optimal readability
- Smooth animations and transitions
- Depth and shadows for visual hierarchy
- Theme-aware styling (Light & Dark modes)
- Responsive design for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Start the development server
npm start
# or
bun start
```

### Running on Different Platforms

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Platform Support

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web

## 🏗️ Architecture

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Context + Zustand
- **API**: tRPC with Hono backend
- **Styling**: StyleSheet with Theme Provider
- **Animations**: React Native Animated + Reanimated

## 📂 Project Structure

```
├── app/              # Routes and screens
├── components/      # Reusable UI components
├── providers/       # Context providers
├── constants/       # App constants (colors, etc.)
├── types/           # TypeScript type definitions
├── lib/             # Utility functions and helpers
└── backend/         # tRPC backend routes
```

## 🎯 Key Improvements in v2.0

### Frontend & Design
- ✅ Premium design system with cohesive colors
- ✅ Enhanced typography and reading experience
- ✅ Improved visual hierarchy and spacing
- ✅ Better component styling with shadows and depth
- ✅ Theme-aware styling throughout
- ✅ Enhanced home screen layout
- ✅ Premium article reading experience
- ✅ Better branding and identity
- ✅ Improved responsive design
- ✅ Enhanced tab bar styling

### Backend & News Aggregation
- ✅ **30+ News Sources**: Comprehensive coverage from BBC, Reuters, AP, CNN, TechCrunch, Bloomberg, and more
- ✅ **Multiple API Support**: RSS feeds, NewsAPI.org, NewsData.io, and Google News RSS
- ✅ **Enhanced RSS Parsing**: Direct XML parsing with fallback to JSON proxy
- ✅ **Retry Logic**: Exponential backoff retry mechanism for failed requests
- ✅ **Smart Deduplication**: URL and title-based duplicate detection
- ✅ **Intelligent Updates**: Automatic updates every 10 minutes with statistics tracking
- ✅ **Better Error Handling**: Comprehensive error handling with detailed logging
- ✅ **Image Extraction**: Enhanced image extraction from multiple RSS feed formats
- ✅ **Rate Limit Awareness**: Handles API rate limits gracefully
- ✅ **Performance Optimized**: Parallel fetching with Promise.allSettled

### News Sources Included
- **World News**: BBC, Reuters, AP, CNN, The Guardian, Al Jazeera
- **Technology**: TechCrunch, The Verge, Wired, Ars Technica, Engadget
- **Business**: Bloomberg, Financial Times, CNBC, Reuters Business
- **Science**: Scientific American, Nature, Science Daily
- **Health**: Medical News Today
- **Sports**: ESPN, BBC Sport
- **Entertainment**: Variety, The Hollywood Reporter
- **Plus**: NewsAPI.org and NewsData.io integration (when API keys are provided)

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed improvement documentation.

## 🔧 Configuration

### App Configuration
Update `app.json` for:
- App name and slug
- Bundle identifiers
- App icons and splash screens
- Permissions

### Backend API Keys (Optional but Recommended)
Create a `.env` file or set environment variables for enhanced news coverage:

```bash
# NewsAPI.org (Free tier: 100 requests/day)
# Get your key at https://newsapi.org/register
NEWSAPI_KEY=your_newsapi_key_here

# NewsData.io (Free tier: 200 requests/day)
# Get your key at https://newsdata.io/
NEWSDATA_KEY=your_newsdata_key_here
```

**Note**: The app works perfectly without API keys using RSS feeds and Google News RSS, which have no rate limits!

## 📄 License

Private - All Rights Reserved

## 👥 Contributing

This is a private project. For contributions or questions, please contact the development team.

---

**Built with ❤️ using React Native & Expo**
