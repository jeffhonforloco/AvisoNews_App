# AvisoNews Advanced Features Documentation

Comprehensive guide for authentication, internationalization, push notifications, and testing infrastructure.

---

## 🔐 User Authentication

### Overview
Complete authentication system with sign in, sign up, session management, and profile updates.

### Features Implemented

#### 1. **Authentication Service** (`services/auth.ts`)
- **Sign Up**: Create new user accounts with validation
- **Sign In**: Authenticate existing users
- **Sign Out**: Clear session and analytics
- **Session Management**: Persistent authentication across app restarts
- **Profile Updates**: Modify user information
- **Email Validation**: RFC-compliant email format checking
- **Password Validation**: Strong password requirements
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

#### 2. **Auth Provider** (`providers/AuthProvider.tsx`)
- Global authentication state
- User context throughout the app
- Automatic session restoration on app launch
- Analytics integration for auth events

#### 3. **Authentication Screens**

**Sign In Screen** (`app/auth/sign-in.tsx`):
- Email and password fields
- Real-time validation
- Loading states
- Error handling
- "Sign Up" link for new users
- Beautiful gradient UI

**Sign Up Screen** (`app/auth/sign-up.tsx`):
- Name, email, password, confirmation fields
- Comprehensive validation
- Password strength requirements
- Terms acceptance
- Success confirmation
- "Sign In" link for existing users

#### 4. **Settings Integration**
- User profile display when authenticated
- Sign out with confirmation dialog
- Sign in prompt when not authenticated
- Seamless navigation

### Usage Examples

#### Check Authentication Status
```typescript
import { useAuth } from '@/providers/AuthProvider';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <SignInPrompt />;

  return <WelcomeScreen user={user} />;
}
```

#### Sign In
```typescript
const { signIn } = useAuth();

const handleSignIn = async () => {
  const result = await signIn({
    email: 'user@example.com',
    password: 'StrongPass123',
  });

  if (result.success) {
    // Navigate to home
  } else {
    // Show error: result.message
  }
};
```

#### Sign Up
```typescript
const { signUp } = useAuth();

const handleSignUp = async () => {
  const result = await signUp({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'StrongPass123',
  });

  if (result.success) {
    // Welcome new user!
  }
};
```

#### Sign Out
```typescript
const { signOut } = useAuth();

await signOut();
router.replace('/auth/sign-in');
```

### API Integration

For production, connect to your backend:

```typescript
// In services/auth.ts
// Update EXPO_PUBLIC_API_URL in .env

// POST /auth/signup
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password"
}

// POST /auth/signin
{
  "email": "user@example.com",
  "password": "password"
}

// Response format:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## 🌍 Internationalization (i18n)

### Overview
Multi-language support with English, Spanish, and French translations.

### Features Implemented

#### 1. **i18n Service** (`services/i18n.ts`)
- Automatic device language detection
- Fallback to English for unsupported languages
- Easy locale switching
- Translation helper function

#### 2. **Locale Files**
- `locales/en.json` - English (complete)
- `locales/es.json` - Spanish (Español)
- `locales/fr.json` - French (Français)

#### 3. **Translation Coverage**
- Common UI terms (cancel, save, delete, etc.)
- Tab labels
- Home screen
- Categories
- Search interface
- Settings
- Authentication screens
- Article interface
- Offline status
- Error messages

### Usage Examples

#### Basic Translation
```typescript
import i18n from '@/services/i18n';

const welcomeText = i18n.t('home.title'); // "AvisoNews"
const signInButton = i18n.t('auth.signIn.submit'); // "Sign In"
```

#### Translation with Variables
```typescript
// In locale file:
{
  "article": {
    "views": "{{count}} views",
    "minRead": "{{minutes}} min read"
  }
}

// In code:
i18n.t('article.views', { count: 1234 }); // "1234 views"
i18n.t('article.minRead', { minutes: 5 }); // "5 min read"
```

#### Change Language
```typescript
import { setLocale, availableLocales } from '@/services/i18n';

// Show language picker
availableLocales.forEach(locale => {
  console.log(locale.name, locale.nativeName);
  // English English
  // Spanish Español
  // French Français
});

// Switch language
setLocale('es'); // Switch to Spanish
```

#### Get Current Language
```typescript
import { getLocale } from '@/services/i18n';

const currentLanguage = getLocale(); // 'en', 'es', or 'fr'
```

### Adding New Languages

1. Create locale file: `locales/xx.json`
2. Copy structure from `locales/en.json`
3. Translate all keys
4. Add to `services/i18n.ts`:
```typescript
import xx from '@/locales/xx.json';

const i18n = new I18n({
  en,
  es,
  fr,
  xx, // Add here
});

export const availableLocales = [
  // ...existing locales
  { code: 'xx', name: 'Language Name', nativeName: 'Native Name' },
];
```

---

## 🔔 Push Notifications

### Overview
Complete push notification system with Expo Notifications API.

### Features Implemented

#### 1. **Push Notification Service** (`services/pushNotifications.ts`)
- Permission handling
- Token registration
- Notification scheduling
- Badge management
- Notification listeners
- Analytics integration

#### 2. **Capabilities**
- **Local Notifications**: Schedule notifications within the app
- **Push Notifications**: Receive notifications from server
- **Badge Count**: App icon badge management
- **Notification Channels**: Android notification channels
- **Foreground Handling**: Show notifications when app is open

### Usage Examples

#### Initialize
```typescript
import { PushNotifications } from '@/services/pushNotifications';

// In app startup
await PushNotifications.initialize();
```

#### Get Push Token
```typescript
const token = await PushNotifications.registerForPushNotifications();
// Send this token to your backend
```

#### Schedule Local Notification
```typescript
// Immediate notification
await PushNotifications.scheduleNotification(
  'Breaking News',
  'Important update available!',
  { seconds: 1 }
);

// Delayed notification
await PushNotifications.scheduleNotification(
  'Reminder',
  'Check today\'s news',
  { seconds: 3600 } // 1 hour
);

// Daily notification
await PushNotifications.scheduleNotification(
  'Daily Digest',
  'Your news is ready',
  {
    hour: 9,
    minute: 0,
    repeats: true,
  }
);
```

#### Listen for Notifications
```typescript
import { useEffect } from 'react';

useEffect(() => {
  // Notification received (app in foreground)
  const subscription1 = PushNotifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
    }
  );

  // Notification tapped (user interaction)
  const subscription2 = PushNotifications.addNotificationResponseListener(
    (response) => {
      console.log('Notification tapped:', response);
      // Navigate to specific screen
    }
  );

  return () => {
    subscription1.remove();
    subscription2.remove();
  };
}, []);
```

#### Badge Management
```typescript
// Get badge count
const count = await PushNotifications.getBadgeCount();

// Set badge count
await PushNotifications.setBadgeCount(5);

// Clear badge
await PushNotifications.setBadgeCount(0);
```

#### Cancel Notifications
```typescript
// Cancel specific notification
await PushNotifications.cancelNotification(notificationId);

// Cancel all notifications
await PushNotifications.cancelAllNotifications();
```

### Notification Examples

#### Daily News Digest
```typescript
import { scheduleDailyDigest } from '@/services/pushNotifications';

// Schedule daily at 9 AM
await scheduleDailyDigest();
```

#### Breaking News Alert
```typescript
import { scheduleBreakingNews } from '@/services/pushNotifications';

// Immediate notification
await scheduleBreakingNews('Major event happening now!');
```

### Server-Side Push Notifications

To send push notifications from your server:

```bash
# Using Expo Push API
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[user_token_here]",
  "title": "Breaking News",
  "body": "Important update!",
  "data": {
    "articleId": "123",
    "category": "tech"
  }
}
```

### App Configuration

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#FF6B6B"
        }
      ]
    ],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#FF6B6B",
      "androidMode": "default",
      "androidCollapsedTitle": "AvisoNews"
    }
  }
}
```

---

## 🧪 Automated Testing

### Overview
Jest testing infrastructure with React Native Testing Library.

### Features Implemented

#### 1. **Jest Configuration** (`jest.config.js`)
- Expo preset for React Native
- Transform ignore patterns for Expo modules
- Coverage collection
- Module path mapping

#### 2. **Testing Tools**
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing
- **Jest Native**: Extended matchers

#### 3. **Test Scripts** (in `package.json`)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Running Tests

```bash
# Run all tests
bun test

# Watch mode (re-run on file changes)
bun test:watch

# Coverage report
bun test:coverage
```

### Example Tests

#### Service Tests (`__tests__/services/auth.test.ts`)
```typescript
import { AuthAPI } from '@/services/auth';

describe('AuthService', () => {
  it('should validate correct email', () => {
    expect(AuthAPI.validateEmail('test@example.com')).toBe(true);
  });

  it('should reject weak passwords', () => {
    const result = AuthAPI.validatePassword('weak');
    expect(result.valid).toBe(false);
  });

  it('should sign up user', async () => {
    const result = await AuthAPI.signUp({
      name: 'Test',
      email: 'test@test.com',
      password: 'Strong123',
    });
    expect(result.success).toBe(true);
  });
});
```

#### Component Tests
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('should handle button press', () => {
    const mockFn = jest.fn();
    const { getByRole } = render(<MyComponent onPress={mockFn} />);

    fireEvent.press(getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Writing Tests

#### Test Structure
```typescript
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Runs after each test
  });

  it('should do something', () => {
    // Test implementation
  });

  it('should handle edge case', () => {
    // Test implementation
  });
});
```

#### Common Matchers
```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThan(10);

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/regex/);

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ key: value });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledTimes(2);
```

### Coverage Goals

Aim for:
- **Services**: 80%+ coverage
- **Providers**: 70%+ coverage
- **Utils**: 90%+ coverage
- **Components**: 60%+ coverage

---

## 🚀 Quick Start Guide

### 1. Authentication
```typescript
// Check if user is logged in
const { isAuthenticated, user } = useAuth();

// Sign in
await signIn({ email, password });

// Sign up
await signUp({ name, email, password });

// Sign out
await signOut();
```

### 2. Internationalization
```typescript
// Translate text
i18n.t('common.cancel'); // "Cancel"

// Change language
setLocale('es'); // Switch to Spanish

// Get available languages
availableLocales.forEach(locale => {
  console.log(locale.name, locale.nativeName);
});
```

### 3. Push Notifications
```typescript
// Initialize
await PushNotifications.initialize();

// Schedule notification
await PushNotifications.scheduleNotification(
  'Title',
  'Message',
  { seconds: 60 }
);

// Listen for taps
PushNotifications.addNotificationResponseListener((response) => {
  // Handle tap
});
```

### 4. Testing
```bash
# Run tests
bun test

# Watch mode
bun test:watch

# Coverage
bun test:coverage
```

---

## 📊 Analytics Integration

All new features integrate with the analytics system:

### Authentication Events
- `user_signin`
- `user_signup`
- `user_signout`
- `profile_update`
- `auth_error`

### Notification Events
- `push_registered`
- `push_permission_denied`
- `notification_scheduled`
- `notification_received`
- `notification_tapped`

### i18n Events
- `language_changed`

---

## 🔧 Configuration

### Environment Variables

Add to `.env`:
```bash
# API
EXPO_PUBLIC_API_URL=https://api.avisonews.com

# Project ID for push notifications
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id

# Analytics
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

### App Configuration

Update `app.json`:
```json
{
  "expo": {
    "name": "AvisoNews",
    "plugins": [
      "expo-router",
      "expo-notifications",
      "expo-localization"
    ],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#FF6B6B"
    }
  }
}
```

---

## 🎯 Best Practices

### Authentication
- Always validate input on client AND server
- Use secure password requirements
- Implement rate limiting on server
- Handle token expiration
- Clear sensitive data on sign out

### i18n
- Keep translations in sync across languages
- Use meaningful keys (not just numbers)
- Test with RTL languages (Arabic, Hebrew)
- Handle pluralization correctly
- Include context for translators

### Push Notifications
- Request permissions at appropriate time
- Provide value before asking for permission
- Allow users to customize notification preferences
- Don't spam users
- Handle permission denial gracefully

### Testing
- Write tests before fixing bugs
- Test edge cases
- Mock external dependencies
- Keep tests fast
- Aim for high coverage on critical paths

---

## 📚 Additional Resources

- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)
- [i18n-js Documentation](https://github.com/fnando/i18n-js)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

**Last Updated**: January 2026
**Version**: 3.0.0
**Maintainer**: AvisoNews Team
