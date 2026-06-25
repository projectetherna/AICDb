// Dreamwall — Admin bootstrap globals.
// All data is now loaded live from Supabase in each admin page component.
// These are empty stubs so that references in Admin.jsx / AdminContent.jsx
// that haven't been fully migrated yet don't throw before the async fetch completes.

window.ADMIN_USERS       = [];
window.ADMIN_USER_EMAILS = {};
window.ADMIN_SUBMISSIONS = [];
window.ADMIN_REPORTS     = { content: [], comments: [] };
window.ADMIN_BUG_REPORTS = [];
window.ADMIN_ACTIVITY    = [];
window.ADMIN_STATS       = { totalUsers: 0, totalContent: 0, pendingReviews: 0, activeToday: 0, totalRatings: 0, reportedItems: 0 };
window.ADMIN_SERIES      = { active: Array(30).fill(0), regs: Array(30).fill(0) };
window.ADMIN_LEADERS     = { byViews: [], byRatings: [], topCreators: [] };
