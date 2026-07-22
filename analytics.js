// Analytics data storage
let analytics = {
  totalVisits: parseInt(localStorage.getItem("totalVisits")) || 0,
  todayVisits: parseInt(localStorage.getItem("todayVisits")) || 0,
  uniqueVisitors: new Set(
    JSON.parse(localStorage.getItem("uniqueVisitors")) || []
  ),
  monthlyVisits: JSON.parse(localStorage.getItem("monthlyVisits")) || [
    0, 0, 0, 0, 0, 0,
  ],
  lastReset: localStorage.getItem("lastReset") || new Date().toDateString(),
  avgTimeOnSite: parseInt(localStorage.getItem("avgTimeOnSite")) || 0,
  pageViews: JSON.parse(localStorage.getItem("pageViews")) || {
    "index.html": 0,
    "index-fa.html": 0,
    "dashboard.html": 0,
    "dashboard-fa.html": 0,
  },
  visitTimes: JSON.parse(localStorage.getItem("visitTimes")) || [],
  referrers: new Map(JSON.parse(localStorage.getItem("referrers")) || []),
};

// Function to save analytics data
function saveAnalytics() {
  localStorage.setItem("totalVisits", analytics.totalVisits);
  localStorage.setItem("todayVisits", analytics.todayVisits);
  localStorage.setItem(
    "uniqueVisitors",
    JSON.stringify([...analytics.uniqueVisitors])
  );
  localStorage.setItem(
    "monthlyVisits",
    JSON.stringify(analytics.monthlyVisits)
  );
  localStorage.setItem("lastReset", analytics.lastReset);
  localStorage.setItem("avgTimeOnSite", analytics.avgTimeOnSite);
  localStorage.setItem("pageViews", JSON.stringify(analytics.pageViews));
  localStorage.setItem("visitTimes", JSON.stringify(analytics.visitTimes));
  localStorage.setItem("referrers", JSON.stringify([...analytics.referrers]));
}

// Function to track visit
function trackVisit() {
  // Reset daily counter if it's a new day
  const today = new Date().toDateString();
  if (today !== analytics.lastReset) {
    analytics.todayVisits = 0;
    analytics.lastReset = today;
  }

  // Update analytics
  analytics.totalVisits++;
  analytics.todayVisits++;
  analytics.uniqueVisitors.add(
    "visitor-" + Math.random().toString(36).substr(2, 9)
  );

  // Update monthly visits
  const currentMonth = new Date().getMonth();
  analytics.monthlyVisits[currentMonth]++;

  // Track page views
  const page = window.location.pathname.split("/").pop() || "index.html";
  analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;

  // Track referrer
  const referrer = document.referrer || "Direct";
  analytics.referrers.set(
    referrer,
    (analytics.referrers.get(referrer) || 0) + 1
  );

  // Track visit time
  analytics.visitTimes.push(new Date().getTime());

  // Calculate average time on site (last 100 visits)
  if (analytics.visitTimes.length > 100) {
    analytics.visitTimes.shift();
  }
  if (analytics.visitTimes.length > 1) {
    const avgTime =
      analytics.visitTimes.reduce((acc, time, i, arr) => {
        if (i === 0) return 0;
        return acc + (time - arr[i - 1]);
      }, 0) /
      (analytics.visitTimes.length - 1);
    analytics.avgTimeOnSite = Math.round(avgTime / 1000 / 60); // Convert to minutes
  }

  // Save analytics data
  saveAnalytics();
}

// Function to get analytics data
function getAnalyticsData() {
  return {
    totalVisits: analytics.totalVisits,
    todayVisits: analytics.todayVisits,
    uniqueVisitors: analytics.uniqueVisitors.size,
    monthlyVisits: analytics.monthlyVisits,
    avgTimeOnSite: analytics.avgTimeOnSite,
    pageViews: analytics.pageViews,
    topReferrers: Array.from(analytics.referrers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([url, count]) => ({ url, count })),
  };
}

// Track visit when page loads
document.addEventListener("DOMContentLoaded", trackVisit);
