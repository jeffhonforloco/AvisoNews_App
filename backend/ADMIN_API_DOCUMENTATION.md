# Admin Panel API Documentation

## Overview

The Admin Panel provides comprehensive management capabilities for the AvisoNews platform through a secure, role-based API system.

## Authentication

### Login
```typescript
trpc.admin.auth.login.useMutation({
  email: string,
  password: string
})
```

Returns: `{ user: AdminUser, token: string }`

### Get Current Admin
```typescript
trpc.admin.auth.getCurrent.useQuery()
```

### Check Permission
```typescript
trpc.admin.auth.checkPermission.useQuery({
  permission: string
})
```

**Default Credentials:**
- Email: `admin@avisonews.com`
- Password: `admin123`

## Admin Roles & Permissions

### Super Admin
Full access to all features:
- Manage users
- Manage articles
- Manage sources & categories
- Moderate content
- View analytics
- Manage automation
- Manage settings
- Publish/delete articles
- Edit trust scores

### Admin
Most features except user management:
- Manage articles
- Manage sources & categories
- Moderate content
- View analytics
- Publish/delete articles

### Editor
Content management:
- Manage articles
- Moderate content
- Publish/delete articles

### Moderator
Content moderation only:
- Moderate content
- View analytics

### Curator
Curated content:
- Manage articles
- Publish articles

## API Endpoints

### Dashboard

**Get Dashboard Stats**
```typescript
trpc.admin.dashboard.stats.useQuery()
```

Returns comprehensive platform statistics including:
- Total articles, sources, users
- Today's articles count
- Pending moderation count
- Automated vs curated articles
- Average trust score
- Articles by category/source
- Recent activity logs
- Top trending articles

**Get Activity Logs**
```typescript
trpc.admin.dashboard.activityLogs.useQuery({
  limit?: number,
  offset?: number,
  entityType?: "article" | "source" | "user" | "category" | "setting"
})
```

### Articles Management

**List Articles**
```typescript
trpc.admin.articles.list.useQuery({
  status?: "all" | "published" | "draft" | "pending" | "flagged",
  category?: string,
  sourceId?: string,
  search?: string,
  limit?: number,
  offset?: number
})
```

**Update Article**
```typescript
trpc.admin.articles.update.useMutation({
  id: string,
  title?: string,
  excerpt?: string,
  category?: string,
  featured?: boolean,
  breaking?: boolean,
  trending?: boolean,
  status?: "published" | "draft",
  trustScore?: {
    overall: number,
    sourceCredibility: number,
    factualAccuracy: number,
    transparency: number,
    editorial: number
  }
})
```

**Delete Article**
```typescript
trpc.admin.articles.delete.useMutation({
  id: string
})
```

**Moderate Article**
```typescript
trpc.admin.articles.moderate.useMutation({
  articleId: string,
  status: "approved" | "rejected" | "flagged",
  reason?: string,
  notes?: string
})
```

**Bulk Operations**
```typescript
trpc.admin.articles.bulk.useMutation({
  type: "publish" | "delete" | "archive" | "update_category" | "update_trust_score",
  articleIds: string[],
  category?: string,
  trustScore?: number
})
```

### Automation Management

**List Automation Configs**
```typescript
trpc.admin.automation.list.useQuery()
```

**Get Automation Config**
```typescript
trpc.admin.automation.get.useQuery({
  id: string
})
```

**Create Automation Config**
```typescript
trpc.admin.automation.create.useMutation({
  sourceId: string,
  enabled?: boolean,
  fetchInterval: number, // minutes (1-1440)
  autoPublish?: boolean,
  requireModeration?: boolean,
  filters?: {
    categories?: string[],
    keywords?: string[],
    excludeKeywords?: string[],
    minTrustScore?: number
  }
})
```

**Update Automation Config**
```typescript
trpc.admin.automation.update.useMutation({
  id: string,
  enabled?: boolean,
  fetchInterval?: number,
  autoPublish?: boolean,
  requireModeration?: boolean,
  filters?: {...}
})
```

**Delete Automation Config**
```typescript
trpc.admin.automation.delete.useMutation({
  id: string
})
```

**Run Automation**
```typescript
trpc.admin.automation.run.useMutation({
  id: string
})
```

### Curation Management

**List Curated Submissions**
```typescript
trpc.admin.curation.list.useQuery({
  status?: "all" | "pending" | "approved" | "rejected",
  limit?: number,
  offset?: number
})
```

**Submit Curated Article**
```typescript
trpc.admin.curation.submit.useMutation({
  title: string,
  excerpt: string,
  content: string,
  category: string,
  sourceId?: string,
  externalUrl?: string,
  imageUrl?: string,
  tags?: string[]
})
```

**Review Submission**
```typescript
trpc.admin.curation.review.useMutation({
  id: string,
  action: "approve" | "reject",
  notes?: string
})
```

**Update Submission**
```typescript
trpc.admin.curation.update.useMutation({
  id: string,
  title?: string,
  excerpt?: string,
  content?: string,
  category?: string,
  tags?: string[]
})
```

**Delete Submission**
```typescript
trpc.admin.curation.delete.useMutation({
  id: string
})
```

### User Management

**List Users**
```typescript
trpc.admin.users.list.useQuery({
  role?: AdminRole,
  active?: boolean,
  search?: string,
  limit?: number,
  offset?: number
})
```

**Get User**
```typescript
trpc.admin.users.get.useQuery({
  id: string
})
```

**Create User**
```typescript
trpc.admin.users.create.useMutation({
  email: string,
  name: string,
  role: AdminRole,
  active?: boolean
})
```

**Update User**
```typescript
trpc.admin.users.update.useMutation({
  id: string,
  name?: string,
  role?: AdminRole,
  active?: boolean,
  permissions?: string[]
})
```

**Delete User**
```typescript
trpc.admin.users.delete.useMutation({
  id: string
})
```

Note: Cannot delete super admin user.

## Admin Panel Features

### Dashboard
- Real-time platform statistics
- Activity log monitoring
- Quick access to all management features
- Visual charts and metrics

### Articles Management
- View all articles with filters
- Search functionality
- Bulk operations (publish, delete, archive)
- Content moderation (approve/reject/flag)
- Edit articles and trust scores
- Status management (published/draft/pending)

### Automation
- Configure automated news fetching
- Set fetch intervals
- Configure filters (categories, keywords, trust scores)
- Auto-publish settings
- Manual run capability
- Track automation performance

### Curation
- Submit human-curated articles
- Review pending submissions
- Approve/reject curated content
- Track curation workflow
- Edit submissions before approval

### User Management
- Create admin users
- Assign roles and permissions
- Activate/deactivate users
- Search and filter users
- View user activity

### Settings
- View admin profile
- Check permissions
- Configure notifications
- Platform settings (future)

## Security

- All admin endpoints require authentication
- Role-based access control
- Permission checks on sensitive operations
- Token-based authentication
- Protected routes with middleware

## Accessing the Admin Panel

Navigate to: `/admin/login`

After authentication, you'll be redirected to: `/admin/(tabs)/dashboard`

## Future Enhancements

- [ ] Source management interface
- [ ] Category management interface
- [ ] Advanced analytics dashboard
- [ ] Content scheduling
- [ ] Email notifications
- [ ] Export/import functionality
- [ ] Audit logs
- [ ] Advanced search filters
- [ ] Bulk import articles
- [ ] API key management

