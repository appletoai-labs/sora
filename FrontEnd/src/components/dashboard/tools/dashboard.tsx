'use client';

import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
    Star,
    Coins,
    Target,
    CheckCircle,
    Plus,
    Flame,
    Award,
    TrendingUp,
    Calendar,
    Brain,
    Heart,
    Lightbulb,
    BarChart3,
    Activity,
    X,
    Briefcase,
} from 'lucide-react';
import SoraLogo from '@/components/SoraLogo';

interface UserProgress {
    level: number;
    totalXP: number;
    coins: number;
    dayStreak: number;
    goalsCompleted: number;
    xpToNextLevel: number;
    currentLevelXP: number;
}

interface Goal {
    _id: string;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    isCompleted: boolean;
    xpReward: number;
    coinReward: number;
    createdAt: string;
}

interface Achievement {
    _id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
    unlockedAt?: string;
}

interface DashboardStats {
    totalCheckins: number;
    totalChatSessions: number;
    totalClarityEntries: number;
    recentActivity: number;
    wellnessScore: number;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [userProgress, setUserProgress] = useState<UserProgress>({
        level: 1,
        totalXP: 0,
        coins: 100,
        dayStreak: 0,
        goalsCompleted: 0,
        xpToNextLevel: 100,
        currentLevelXP: 0,
    });
    const [recentGoals, setRecentGoals] = useState<Goal[]>([]);
    const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalCheckins: 0,
        totalChatSessions: 0,
        totalClarityEntries: 0,
        recentActivity: 0,
        wellnessScore: 7.5,
    });
    const [loading, setLoading] = useState(true);
    const [showRecentActivitiesModal, setShowRecentActivitiesModal] = useState(false);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);

    const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`;

    const fetchDashboardData = async () => {
        let wellnessScore = 0;
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                setLoading(false);
                return;
            }

            // Fetch user progress
            try {
                const progressResponse = await fetch(`${API_BASE}/goals/progress`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    setUserProgress(progressData.progress || userProgress);
                }
            } catch (error) {
            }

            // Fetch recent goals
            try {
                const goalsResponse = await fetch(`${API_BASE}/goals/usergoals`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (goalsResponse.ok) {
                    const goalsData = await goalsResponse.json();
                    setRecentGoals(goalsData.goals?.slice(0, 3) || []);
                    wellnessScore = goalsData.wellnessScore ?? 0;
                }
            } catch (error) {
            }

            // Fetch achievements
            try {
                const achievementsResponse = await fetch(`${API_BASE}/goals/achievements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (achievementsResponse.ok) {
                    const achievementsData = await achievementsResponse.json();
                    setRecentAchievements(
                        achievementsData.achievements
                            ?.filter((a: Achievement) => a.isUnlocked)
                            .slice(0, 3) || [],
                    );
                }
            } catch (error) {

            }

            // Fetch analytics data
            try {
                const analyticsResponse = await fetch(`${API_BASE}/analytics/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (analyticsResponse.ok) {
                    const analyticsData = await analyticsResponse.json();
                    if (analyticsData.insights) {
                        setDashboardStats((prev) => ({
                            ...prev,
                            totalCheckins: analyticsData.insights.totalCheckins,
                            totalChatSessions: analyticsData.insights.totalChatSessions,
                            totalClarityEntries: analyticsData.insights.totalClarityEntries,
                            wellnessScore,
                        }));
                    }
                }
            } catch (error) {
                
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load some dashboard data',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
            loadRecentActivities();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadRecentActivities = () => {
        try {
            const activities = JSON.parse(localStorage.getItem('sora_recent_activities') || '[]');
            setRecentActivities(activities.slice(0, 10)); // Get most recent 10
            setDashboardStats((prev) => ({ ...prev, recentActivity: activities.length }));
        } catch (error) {
            console.error('Error loading recent activities:', error);
            setRecentActivities([]);
        }
    };

    const handleRecentActivityClick = () => {
        loadRecentActivities(); // Refresh data
        setShowRecentActivitiesModal(true);
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'strategy_completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'exercise_completed':
                return <Activity className="w-5 h-5 text-blue-400" />;
            case 'emotion_selected':
                return <Heart className="w-5 h-5 text-red-400" />;
            case 'strategies_generated':
                return <Briefcase className="w-5 h-5 text-purple-400" />;
            default:
                return <Activity className="w-5 h-5 text-gray-400" />;
        }
    };

    const renderEffectivenessStars = (effectiveness: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-400'
                    }`}
            />
        ));
    };

    // Recent Activities Modal Component
    const RecentActivitiesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
        isOpen,
        onClose,
    }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-sora-teal">Recent Activities</h3>
                        <Button variant="ghost" onClick={onClose} className="p-2">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    {recentActivities.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={activity.id || index}
                                    className="bg-sora-muted/50 border border-sora-teal/10 rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm">
                                                    {activity.title}
                                                </h4>
                                                <span className="text-xs text-gray-400">
                                                    {formatTimestamp(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-3">
                                                {activity.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {activity.emotion && (
                                                    <span className="px-2 py-1 bg-sora-teal/20 text-sora-teal text-xs rounded-full">
                                                        {activity.emotion}
                                                    </span>
                                                )}
                                                {activity.intensity && (
                                                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                                        Intensity: {activity.intensity}/10
                                                    </span>
                                                )}
                                                {activity.difficulty && (
                                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                                        {activity.difficulty}
                                                    </span>
                                                )}
                                            </div>
                                            {activity.effectiveness && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-gray-400">
                                                        Effectiveness:
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {renderEffectivenessStars(
                                                            activity.effectiveness,
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {activity.notes && (
                                                <p className="text-gray-400 text-xs italic mt-2">
                                                    "{activity.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Activity className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">No recent activities</p>
                            <p className="text-gray-500 text-sm">
                                Start using emotional support tools to see activities here!
                            </p>
                        </div>
                    )}
                    <div className="mt-6 pt-4 border-t border-sora-teal/20">
                        <Button
                            onClick={() => {
                                onClose();
                                // Navigate to emotional support if needed
                                window.location.href = '/app/emotional-support';
                            }}
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            <Heart className="w-4 h-4" />
                            Go to Emotional Support
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY':
                return 'bg-green-600';
            case 'MEDIUM':
                return 'bg-yellow-600';
            case 'HARD':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    const getWellnessColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 6) return 'text-yellow-400';
        return 'text-red-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sora-teal mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <SoraLogo />
                    </div>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Your personalized neurodivergent support hub with insights, progress
                        tracking, and tools
                    </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Star className="w-6 h-6 text-sora-teal" />
                                <span className="text-2xl font-bold text-sora-teal">
                                    {userProgress.totalXP}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm">Total XP</p>
                            <Badge className="bg-sora-teal text-sora-dark font-semibold mt-2">
                                Level {userProgress.level}
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-orange/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Coins className="w-6 h-6 text-sora-orange" />
                                <span className="text-2xl font-bold text-sora-orange">
                                    {userProgress.coins}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm">Coins</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-red-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-6 h-6 text-red-500" />
                                <span className="text-2xl font-bold text-red-500">
                                    {userProgress.dayStreak}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm">Day Streak</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-green-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <span className="text-2xl font-bold text-green-500">
                                    {userProgress.goalsCompleted}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm">Goals Done</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Section */}
                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20 mb-8">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div
                                        className={`text-3xl font-bold ${getWellnessColor(
                                            dashboardStats.wellnessScore,
                                        )}`}
                                    >
                                        {dashboardStats.wellnessScore.toFixed(1)}
                                    </div>
                                    <p className="text-gray-400 text-sm">Wellness Score</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                    Progress to Level {userProgress.level + 1}
                                </span>
                                <span className="text-sora-teal font-semibold">
                                    {userProgress.currentLevelXP}/{userProgress.xpToNextLevel} XP
                                </span>
                            </div>
                            <Progress
                                value={
                                    (userProgress.currentLevelXP / userProgress.xpToNextLevel) * 100
                                }
                                className="h-3 bg-sora-muted"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Goals */}
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Target className="w-6 h-6 text-sora-teal" />
                                Recent Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentGoals.length > 0 ? (
                                    recentGoals.map((goal) => (
                                        <div
                                            key={goal._id}
                                            className="p-4 bg-sora-muted rounded-lg border border-sora-teal/10"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm">
                                                    {goal.title}
                                                </h4>
                                                <Badge
                                                    className={`${getDifficultyColor(
                                                        goal.difficulty,
                                                    )} text-white text-xs`}
                                                >
                                                    {goal.difficulty}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-300 text-xs mb-3">
                                                {goal.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Star className="w-3 h-3 text-sora-teal" />
                                                    <span className="text-sora-teal">
                                                        +{goal.xpReward} XP
                                                    </span>
                                                </div>
                                                {goal.isCompleted && (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Target className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400">No goals yet</p>
                                        <Button
                                            size="sm"
                                            className="mt-3 bg-sora-teal hover:bg-sora-teal/80 text-sora-dark"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Goal
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Achievements */}
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-orange/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Award className="w-6 h-6 text-sora-orange" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentAchievements.length > 0 ? (
                                    recentAchievements.map((achievement) => (
                                        <div
                                            key={achievement._id}
                                            className="p-4 bg-sora-muted rounded-lg border border-sora-orange/10"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-2xl">🏆</div>
                                                <div>
                                                    <h4 className="font-semibold text-white text-sm">
                                                        {achievement.title}
                                                    </h4>
                                                    <p className="text-gray-300 text-xs">
                                                        {achievement.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {achievement.unlockedAt && (
                                                <p className="text-sora-orange text-xs">
                                                    Unlocked:{' '}
                                                    {new Date(
                                                        achievement.unlockedAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Award className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400">No achievements yet</p>
                                        <p className="text-gray-500 text-sm">
                                            Complete goals to unlock achievements!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Summary */}
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-green-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Activity className="w-6 h-6 text-green-500" />
                                Activity Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-sora-teal" />
                                        <span className="text-white text-sm">Check-ins</span>
                                    </div>
                                    <span className="text-sora-teal font-semibold">
                                        {dashboardStats.totalCheckins}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-sora-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5 text-red-400" />
                                        <span className="text-white text-sm">Chat Sessions</span>
                                    </div>
                                    <span className="text-red-400 font-semibold">
                                        {dashboardStats.totalChatSessions}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center justify-between p-3 bg-sora-muted rounded-lg cursor-pointer hover:bg-sora-muted/80 transition-colors"
                                    onClick={handleRecentActivityClick}
                                >
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        <span className="text-white text-sm">Recent Activity</span>
                                    </div>
                                    <span className="text-green-400 font-semibold">
                                        {dashboardStats.recentActivity}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate('/app/clarity')}
                                    className="w-full text-left flex items-center justify-between p-3 bg-sora-muted border border-yellow-400 rounded-lg hover:bg-sora-muted/80 hover:border-yellow-500 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white text-sm">Clarity Tools</span>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-sora-teal/20">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                        <CardDescription className="text-gray-300">
                            Jump into your most-used tools and features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                variant="outline"
                                className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                                onClick={() => navigate("/app/checkin")}
                            >
                                <Calendar className="w-6 h-6" />
                                <span className="text-sm">Daily Check-in</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                                onClick={() => navigate("/app/goals")}
                            >
                                <Target className="w-6 h-6" />
                                <span className="text-sm">Goals</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                                onClick={() => navigate("/app/clarity")}
                            >
                                <Lightbulb className="w-6 h-6" />
                                <span className="text-sm">Clarity Tools</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-20 flex-col gap-2 border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark bg-transparent"
                                onClick={() => navigate("/app/dashboard")}
                            >
                                <BarChart3 className="w-6 h-6" />
                                <span className="text-sm">Analytics</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities Modal */}
            <RecentActivitiesModal
                isOpen={showRecentActivitiesModal}
                onClose={() => setShowRecentActivitiesModal(false)}
            />
        </div>
    );
};

export default Dashboard;
