import { Card, CardContent } from "@/components/ui/card";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BarChart3,
    Eye,
    Globe,
    Loader2,
    MousePointerClick,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalyticsData {
    totalViews: number;
    uniqueVisitors: number;
    totalClicks: number;
    ctr: number;
    viewsByDay: { date: string; views: number }[];
    topLinks: { linkUrl: string; linkTitle: string | null; clicks: number }[];
    countries: { country: string | null; views: number }[];
    referrers: { referrer: string | null; views: number }[];
    devices: { deviceType: string | null; views: number }[];
}

// ─── Color palette ────────────────────────────────────────────────────────────

const PIE_COLORS = [
    "#2C3947", // Navy Slate
    "#A5F3FC", // Light Cyan
    "#FDE047", // Yellow / Cream
    "#FCA5A5", // Coral Red
    "#C7D2FE", // Soft Violet
    "#CBD5E1", // Slate
    "#FED7AA", // Soft Orange
    "#86EFAC", // Soft Green
];

const TIME_RANGES = [
    { label: "7D", fullLabel: "7 days", value: 7 },
    { label: "14D", fullLabel: "14 days", value: 14 },
    { label: "30D", fullLabel: "30 days", value: 30 },
];

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration: number = 1200) {
    const [value, setValue] = useState(0);
    const startTime = useRef<number | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        startTime.current = null;

        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = Math.min((timestamp - startTime.current) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [target, duration]);

    return value;
}

// ─── Stat Card Component ──────────────────────────────────────────────────────

function StatCard({
    title,
    value,
    suffix = "",
    icon: Icon,
    iconBg,
    delay = 0,
}: {
    title: string;
    value: number;
    suffix?: string;
    icon: React.ElementType;
    iconBg: string;
    delay?: number;
}) {
    const animatedValue = useAnimatedCounter(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
        >
            <Card className="relative overflow-hidden bg-white border-2 border-[#2C3947] rounded-2xl shadow-[3px_3px_0px_0px_rgba(44,57,71,1)] group transition-all">
                <CardContent className="p-4 sm:p-5 relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#2C3947]/10 ${iconBg}`}>
                            <Icon className="h-5 w-5 text-[#2C3947]" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[#2C3947]/40 group-hover:text-[#2C3947]/80 transition-colors" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#2C3947] tracking-tight">
                        {animatedValue.toLocaleString()}{suffix}
                    </p>
                    <p className="text-xs sm:text-sm text-[#2C3947]/60 font-semibold mt-1">{title}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const chartTooltipStyle = {
    backgroundColor: "#ffffff",
    border: "2px solid #2C3947",
    borderRadius: "12px",
    color: "#2C3947",
    fontFamily: "Lexend, sans-serif",
    fontWeight: "bold",
    fontSize: "13px",
    padding: "10px 14px",
    boxShadow: "3px 3px 0px 0px rgba(44,57,71,1)",
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [days, setDays] = useState(7);

    useEffect(() => {
        const fetchAnalytics = async () => {
            // First load → full loading screen. Subsequent → subtle refresh
            if (data) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(false);
            try {
                const response = await axios.get(`/api/analytics/overview?days=${days}`, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data) {
                    setData(response.data);
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError(true);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchAnalytics();
    }, [days]);

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const truncateUrl = (url: string, maxLen: number = 25): string => {
        try {
            const urlObj = new URL(url);
            const display = urlObj.hostname.replace("www.", "") + urlObj.pathname;
            return display.length > maxLen ? display.slice(0, maxLen) + "…" : display;
        } catch {
            return url.length > maxLen ? url.slice(0, maxLen) + "…" : url;
        }
    };

    // ─── Loading State ────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
                        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        See how your profile is performing
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading your insights...</p>
                </div>
            </div>
        );
    }

    // ─── Error State ──────────────────────────────────────────────────────

    if (error || !data) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
                        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        Analytics
                    </h1>
                </div>
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <BarChart3 className="h-7 w-7 text-destructive" />
                    </div>
                    <p className="text-muted-foreground text-sm">Something went wrong. Please try again.</p>
                </div>
            </div>
        );
    }

    const hasAnyData = data.totalViews > 0 || data.totalClicks > 0;

    // ─── Main View ────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 sm:space-y-8 pb-8">
            {/* ─── Header ──────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        See how your profile is performing — views, clicks, and more
                    </p>
                </div>

                {/* Time Range Pills */}
                <div className="flex items-center gap-0.5 bg-accent/40 rounded-xl p-1 border border-border/50 backdrop-blur-sm">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setDays(range.value)}
                            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                                days === range.value
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                            }`}
                            title={range.fullLabel}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* ─── Stats Grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    title="Total Views"
                    value={data.totalViews}
                    icon={Eye}
                    iconBg="bg-blue-50"
                    delay={0}
                />
                <StatCard
                    title="Unique Visitors"
                    value={data.uniqueVisitors}
                    icon={Users}
                    iconBg="bg-purple-50"
                    delay={0.08}
                />
                <StatCard
                    title="Link Clicks"
                    value={data.totalClicks}
                    icon={MousePointerClick}
                    iconBg="bg-emerald-50"
                    delay={0.16}
                />
                <StatCard
                    title="Click Rate"
                    value={data.ctr}
                    suffix="%"
                    icon={TrendingUp}
                    iconBg="bg-amber-50"
                    delay={0.24}
                />
            </div>

            {/* ─── Area Chart: Views Over Time ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="bg-white border-2 border-[#2C3947] rounded-2xl shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] overflow-hidden">
                    <div className="p-4 sm:p-6 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-[#2C3947]/10 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-[#2C3947]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-[#2C3947]">Views Over Time</h3>
                                    <p className="text-xs text-[#2C3947]/60 font-semibold">Your profile visits in the last {days} days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardContent className="px-2 sm:px-4 pb-4 pt-0">
                        {data.viewsByDay.some(d => d.views > 0) ? (
                            <div className="h-[220px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.viewsByDay} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2C3947" stopOpacity={0.15} />
                                                <stop offset="100%" stopColor="#2C3947" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(44, 57, 71, 0.08)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={formatDate}
                                            stroke="#2C3947"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={8}
                                        />
                                        <YAxis
                                            stroke="#2C3947"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                            dx={-4}
                                        />
                                        <Tooltip
                                            contentStyle={chartTooltipStyle}
                                            labelFormatter={(label) => formatDate(String(label))}
                                            cursor={{ stroke: "#2C3947", strokeDasharray: "4 4" }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#2C3947"
                                            strokeWidth={3}
                                            fill="url(#viewsGradient)"
                                            dot={{ fill: "#2C3947", strokeWidth: 0, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 2, stroke: "#FEF9C3", fill: "#2C3947" }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChartState
                                icon={TrendingUp}
                                title="No views yet"
                                description="Share your profile link to start getting visitors!"
                            />
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* ─── Two Column: Bar + Pie ────────────────────────────────── */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Bar Chart: Top Clicked Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-white border-2 border-[#2C3947] rounded-2xl shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] h-full">
                        <div className="p-4 sm:p-6 pb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-purple-50 border border-[#2C3947]/10 flex items-center justify-center">
                                    <MousePointerClick className="h-4 w-4 text-[#2C3947]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-[#2C3947]">Most Clicked Links</h3>
                                    <p className="text-xs text-[#2C3947]/60 font-semibold">Which links your visitors love</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="px-2 sm:px-4 pb-4 pt-0">
                            {data.topLinks.length > 0 ? (
                                <div className="h-[260px] sm:h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data.topLinks.slice(0, 6).map((l) => ({
                                                name: l.linkTitle || truncateUrl(l.linkUrl),
                                                clicks: l.clicks,
                                            }))}
                                            layout="vertical"
                                            margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44, 57, 71, 0.08)" horizontal={false} />
                                            <XAxis
                                                type="number"
                                                stroke="#2C3947"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                allowDecimals={false}
                                            />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={110}
                                                stroke="#2C3947"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                            <Bar
                                                dataKey="clicks"
                                                fill="#2C3947"
                                                radius={[0, 4, 4, 0]}
                                                barSize={20}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyChartState
                                    icon={MousePointerClick}
                                    title="No clicks yet"
                                    description="Once visitors click your links, you'll see the top ones here"
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pie Chart: Countries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card className="bg-white border-2 border-[#2C3947] rounded-2xl shadow-[4px_4px_0px_0px_rgba(44,57,71,1)] h-full">
                        <div className="p-4 sm:p-6 pb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-cyan-50 border border-[#2C3947]/10 flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-[#2C3947]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-[#2C3947]">Where Your Visitors Are</h3>
                                    <p className="text-xs text-[#2C3947]/60 font-semibold">Countries of your audience</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pb-4 pt-0">
                            {data.countries.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <div className="h-[180px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data.countries.map((c, i) => ({
                                                        name: c.country || "Unknown",
                                                        value: c.views,
                                                        fill: PIE_COLORS[i % PIE_COLORS.length],
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={48}
                                                    outerRadius={76}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                    stroke="none"
                                                    cornerRadius={4}
                                                />
                                                <Tooltip contentStyle={chartTooltipStyle} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Legend */}
                                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3 px-4">
                                        {data.countries.slice(0, 6).map((c, i) => {
                                            const total = data.countries.reduce((s, x) => s + x.views, 0);
                                            const pct = total > 0 ? Math.round((c.views / total) * 100) : 0;
                                            return (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <div
                                                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                                                    />
                                                    <span className="text-[#2C3947] font-bold">
                                                        {c.country || "Unknown"}
                                                    </span>
                                                    <span className="text-[#2C3947]/60 font-semibold">
                                                        {pct}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <EmptyChartState
                                    icon={Globe}
                                    title="No location data yet"
                                    description="Geographic data will appear once visitors start viewing your profile"
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* ─── Referrers Table ──────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="bg-white border-2 border-[#2C3947] rounded-2xl shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
                    <div className="p-4 sm:p-6 pb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-pink-50 border border-[#2C3947]/10 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-[#2C3947]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-[#2C3947]">Traffic Sources</h3>
                                <p className="text-xs text-[#2C3947]/60 font-semibold">Where your visitors are coming from</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-0 pb-2">
                        {data.referrers.length > 0 ? (
                            <div className="space-y-1">
                                {data.referrers.map((ref, index) => {
                                    const maxViews = Math.max(...data.referrers.map(r => r.views));
                                    const barWidth = maxViews > 0 ? (ref.views / maxViews) * 100 : 0;
                                    const totalRefViews = data.referrers.reduce((sum, r) => sum + r.views, 0);
                                    const share = totalRefViews > 0 ? Math.round((ref.views / totalRefViews) * 100) : 0;

                                    return (
                                        <div
                                            key={index}
                                            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200"
                                        >
                                            {/* Progress bar background */}
                                            <div
                                                className="absolute left-0 top-0 h-full rounded-lg bg-[#2C3947]/[0.05] group-hover:bg-[#2C3947]/[0.08] transition-all duration-300"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                            <div className="relative flex items-center justify-between w-full">
                                                <span className="text-sm truncate max-w-[200px] sm:max-w-[350px] font-bold text-[#2C3947]">
                                                    {formatReferrer(ref.referrer)}
                                                </span>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-sm font-black text-[#2C3947]">{ref.views}</span>
                                                    <span className="text-xs text-[#2C3947]/60 font-bold w-10 text-right">{share}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyChartState
                                icon={Sparkles}
                                title="No referrer data yet"
                                description="When someone finds your profile through a link, it'll show up here"
                                compact
                            />
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* ─── Empty Overall State ──────────────────────────────────── */}
            {!hasAnyData && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Card className="bg-white border-2 border-dashed border-[#2C3947]/20 rounded-2xl shadow-[4px_4px_0px_0px_rgba(44,57,71,1)]">
                        <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-6">
                            <div className="h-16 w-16 rounded-2xl bg-[#2C3947]/5 flex items-center justify-center mb-4 border border-[#2C3947]/10">
                                <BarChart3 className="h-8 w-8 text-[#2C3947]" />
                            </div>
                            <h3 className="text-lg font-black text-[#2C3947] mb-2">Your analytics are ready!</h3>
                            <p className="text-sm text-[#2C3947]/60 font-semibold max-w-md">
                                Share your profile link with the world. Every time someone visits your page or clicks a link, it'll be tracked here with beautiful charts and insights.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

// ─── Empty Chart State ────────────────────────────────────────────────────────

function EmptyChartState({
    icon: Icon,
    title,
    description,
    compact = false,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    compact?: boolean;
}) {
    return (
        <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "py-12"}`}>
            <div className="h-11 w-11 rounded-xl bg-slate-50 border border-[#2C3947]/10 flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-[#2C3947]/60" />
            </div>
            <p className="text-sm font-bold text-[#2C3947] mb-1">{title}</p>
            <p className="text-xs text-[#2C3947]/60 font-semibold max-w-[240px]">{description}</p>
        </div>
    );
}

// ─── Format Referrer URL ──────────────────────────────────────────────────────

function formatReferrer(referrer: string | null): string {
    if (!referrer) return "Direct / None";
    try {
        const url = new URL(referrer);
        return url.hostname.replace("www.", "");
    } catch {
        return referrer.length > 40 ? referrer.slice(0, 40) + "…" : referrer;
    }
}
