'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Heart, Hand, List, Clock, Lightbulb, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckinData {
    mood: number | null;
    anxiety: number | null;
    sensory: number | null;
    executive: number | null;
    energy: number | null;
    notes: string;
}

const DailyCheckin: React.FC = () => {
    const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`;
    const navigate = useNavigate();
    const [checkinData, setCheckinData] = useState<CheckinData>({
        mood: null,
        anxiety: null,
        sensory: null,
        executive: null,
        energy: null,
        notes: '',
    });

    const [showRecommendations, setShowRecommendations] = useState(false);

    // Function to save activity to localStorage
    const saveActivityToLocalStorage = (checkinData: CheckinData) => {
        try {
            const activities = JSON.parse(localStorage.getItem('sora_recent_activities') || '[]');

            const newActivity = {
                id: `checkin_${Date.now()}`,
                type: 'checkin_completed',
                title: 'Daily Check-in Completed',
                description: `Completed daily wellness check-in with mood: ${checkinData.mood}/10, anxiety: ${checkinData.anxiety}/10, energy: ${checkinData.energy}/10`,
                timestamp: new Date().toISOString(),
                mood: checkinData.mood,
                anxiety: checkinData.anxiety,
                sensory: checkinData.sensory,
                executive: checkinData.executive,
                energy: checkinData.energy,
                notes: checkinData.notes,
                averageScore: Math.round(
                    ((checkinData.mood || 0) +
                        (10 - (checkinData.anxiety || 0)) +
                        (checkinData.sensory || 0) +
                        (checkinData.executive || 0) +
                        (checkinData.energy || 0)) /
                        5,
                ),
            };

            activities.unshift(newActivity);

            // Keep only the most recent 50 activities
            if (activities.length > 50) {
                activities.splice(50);
            }

            localStorage.setItem('sora_recent_activities', JSON.stringify(activities));
        } catch (error) {
            console.error('Error saving check-in activity:', error);
        }
    };

    const RatingScale = ({
        value,
        onChange,
        descriptions,
    }: {
        value: number | null;
        onChange: (value: number) => void;
        descriptions: string[];
    }) => (
        <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => onChange(num)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                            value === num
                                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 border-cyan-400 text-white shadow-lg'
                                : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-5 gap-3 mt-2">
                {[6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        onClick={() => onChange(num)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                            value === num
                                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 border-cyan-400 text-white shadow-lg'
                                : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
            {value && (
                <div className="text-center text-gray-300 mt-4 max-w-xs">
                    {descriptions[value - 1]}
                </div>
            )}
        </div>
    );

    const moodDescriptions = [
        'Below Neutral - Slightly off, not quite right',
        'Neutral - Okay, neither good nor bad',
        'Above Neutral - Feeling alright, slightly positive',
        'Good - Feeling pretty good overall',
        'Very Good - Feeling quite positive and content',
        'Great - Having a really good day',
        'Excellent - Feeling fantastic and energized',
        'Amazing - Everything feels wonderful',
        'Extreme - How positive or content are you feeling?',
        'Perfect - Absolutely incredible day',
    ];

    const anxietyDescriptions = [
        'Very Calm - Completely relaxed and peaceful',
        'Calm - Feeling quite relaxed',
        'Mostly Calm - Generally at ease',
        'Slightly Tense - A little worried',
        'Neutral - Some worry but manageable',
        'Somewhat Anxious - Noticeable worry',
        'Anxious - Feeling quite worried',
        'Very Anxious - High levels of worry',
        'Extremely Anxious - Overwhelming anxiety',
        'Panic Level - Severe anxiety or panic',
    ];

    const sensoryDescriptions = [
        'Not Sensitive - Sensory input feels comfortable',
        'Barely Noticeable - Slightly aware of sounds/lights',
        'Mild Awareness - Some sensory input noticed',
        'Somewhat Noticeable - Starting to feel aware',
        'Moderate - Sensory input is present but manageable',
        'Quite Noticeable - Definitely aware of sensory input',
        'High Sensitivity - Sensory input is bothersome',
        'Very High - Struggling with sensory input',
        'Overwhelming - Sensory input is very difficult',
        'Extreme Sensitivity - Cannot tolerate sensory input',
    ];

    const executiveDescriptions = [
        'Very Difficult - Cannot focus or organize at all',
        'Extremely Hard - Struggling with basic tasks',
        'Very Hard - Major difficulty focusing',
        'Quite Hard - Noticeable struggles with tasks',
        'Moderate - Some challenges but manageable',
        'Slightly Difficult - Minor focus issues',
        'Mostly Good - Generally able to focus',
        'Good - Focusing and organizing well',
        'Very Good - Excellent focus and organization',
        'Perfect - Complete clarity and organization',
    ];

    const energyDescriptions = [
        'Completely Exhausted - Can barely function',
        'Very Drained - Struggling to do basic tasks',
        'Low Energy - Tired, need lots of rest',
        'Below Normal - Feeling sluggish',
        'Moderate - Average energy, getting by',
        'Decent Energy - Feeling okay and capable',
        'Good Energy - Feeling decent and capable',
        'High Energy - Feeling energized and ready',
        'Very High Energy - Lots of energy for activities',
        'Unlimited Energy - Feel like I can do anything',
    ];

    const handleCompleteCheckin = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found in localStorage.');
                return;
            }

            const response = await fetch(`${API_BASE}/dailycheckin/checkins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(checkinData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Saved check-in:', data.checkin);

                // Save activity to localStorage for dashboard
                saveActivityToLocalStorage(checkinData);

                setShowRecommendations(true);
            } else {
                console.error('Failed to save check-in:', data.error);
            }
        } catch (error) {
            console.error('Error saving check-in:', error);

            // Still save to localStorage even if API fails
            saveActivityToLocalStorage(checkinData);
            setShowRecommendations(true);
        }
    };

    const getRecommendations = () => {
        const recommendations = [];

        if (checkinData.mood && checkinData.mood <= 4) {
            recommendations.push('feeling-low');
        }
        if (checkinData.sensory && checkinData.sensory >= 6) {
            recommendations.push('sensory-overwhelm');
        }
        if (checkinData.executive && checkinData.executive <= 4) {
            recommendations.push('focus-challenges');
        }

        return recommendations;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br via-gray-800 to-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-cyan-400 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                            Daily Check-in
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Take a moment to reflect on how you're feeling today. This helps build
                        self-awareness and track patterns over time.
                    </p>
                </div>

                {/* Main Check-in Card */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-cyan-400 text-center">
                            How are you feeling today?
                        </CardTitle>
                        <p className="text-gray-400 text-center">
                            Rate each area from 1 (very low/difficult) to 10 (very high/easy). There
                            are no right or wrong answers - just be honest about how you're feeling
                            right now.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-12">
                        {/* Mood/Positivity */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="text-4xl mr-3">😊</div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Mood/Positivity
                                        </h3>
                                        <p className="text-gray-400">
                                            How positive or content are you feeling?
                                        </p>
                                    </div>
                                </div>
                                <RatingScale
                                    value={checkinData.mood}
                                    onChange={(value) =>
                                        setCheckinData({ ...checkinData, mood: value })
                                    }
                                    descriptions={moodDescriptions}
                                />
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {moodDescriptions.map((desc, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-300 text-sm py-1 border-b border-gray-700 last:border-b-0"
                                    >
                                        <span className="text-cyan-400 font-medium">
                                            {index + 1}:
                                        </span>{' '}
                                        {desc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Anxiety Level */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="text-4xl mr-3">😰</div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Anxiety Level
                                        </h3>
                                        <p className="text-gray-400">
                                            How anxious or worried are you feeling?
                                        </p>
                                    </div>
                                </div>
                                <RatingScale
                                    value={checkinData.anxiety}
                                    onChange={(value) =>
                                        setCheckinData({ ...checkinData, anxiety: value })
                                    }
                                    descriptions={anxietyDescriptions}
                                />
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {anxietyDescriptions.map((desc, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-300 text-sm py-1 border-b border-gray-700 last:border-b-0"
                                    >
                                        <span className="text-cyan-400 font-medium">
                                            {index + 1}:
                                        </span>{' '}
                                        {desc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sensory Sensitivity */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Hand className="w-8 h-8 text-cyan-400 mr-3" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Sensory Sensitivity
                                        </h3>
                                        <p className="text-gray-400">
                                            How overwhelming do sounds, lights, textures, or crowds
                                            feel?
                                        </p>
                                    </div>
                                </div>
                                <RatingScale
                                    value={checkinData.sensory}
                                    onChange={(value) =>
                                        setCheckinData({ ...checkinData, sensory: value })
                                    }
                                    descriptions={sensoryDescriptions}
                                />
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {sensoryDescriptions.map((desc, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-300 text-sm py-1 border-b border-gray-700 last:border-b-0"
                                    >
                                        <span className="text-cyan-400 font-medium">
                                            {index + 1}:
                                        </span>{' '}
                                        {desc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Executive Function */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <List className="w-8 h-8 text-cyan-400 mr-3" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Executive Function
                                        </h3>
                                        <p className="text-gray-400">
                                            How easy is it to focus, organize, and complete tasks?
                                        </p>
                                    </div>
                                </div>
                                <RatingScale
                                    value={checkinData.executive}
                                    onChange={(value) =>
                                        setCheckinData({ ...checkinData, executive: value })
                                    }
                                    descriptions={executiveDescriptions}
                                />
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {executiveDescriptions.map((desc, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-300 text-sm py-1 border-b border-gray-700 last:border-b-0"
                                    >
                                        <span className="text-cyan-400 font-medium">
                                            {index + 1}:
                                        </span>{' '}
                                        {desc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Energy Level */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="text-4xl mr-3">🔋</div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            Energy Level
                                        </h3>
                                        <p className="text-gray-400">
                                            How much energy do you have for activities?
                                        </p>
                                    </div>
                                </div>
                                <RatingScale
                                    value={checkinData.energy}
                                    onChange={(value) =>
                                        setCheckinData({ ...checkinData, energy: value })
                                    }
                                    descriptions={energyDescriptions}
                                />
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {energyDescriptions.map((desc, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-300 text-sm py-1 border-b border-gray-700 last:border-b-0"
                                    >
                                        <span className="text-cyan-400 font-medium">
                                            {index + 1}:
                                        </span>{' '}
                                        {desc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-3">📝</div>
                                <h3 className="text-xl font-semibold text-white">
                                    Additional Notes (Optional)
                                </h3>
                            </div>
                            <p className="text-gray-400">
                                Share anything specific about today - what went well, what was
                                challenging, or anything else on your mind.
                            </p>
                            <Textarea
                                value={checkinData.notes}
                                onChange={(e) =>
                                    setCheckinData({ ...checkinData, notes: e.target.value })
                                }
                                placeholder="Today was... I noticed that... I'm grateful for... I struggled with..."
                                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 min-h-24"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={handleCompleteCheckin}
                                className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                                disabled={
                                    !checkinData.mood ||
                                    !checkinData.anxiety ||
                                    !checkinData.sensory ||
                                    !checkinData.executive ||
                                    !checkinData.energy
                                }
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Complete Check-in
                            </Button>
                            <Button
                                variant="outline"
                                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 px-8 py-3 text-lg bg-transparent"
                            >
                                <TrendingUp className="w-5 h-5 mr-2" />
                                View My Progress
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recommendations Based on Check-in */}
                {showRecommendations && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-cyan-400 text-center mb-6">
                            Based on Your Check-in
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-700/50 hover:border-red-600 transition-colors">
                                <CardContent className="p-6 text-center">
                                    <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Feeling Low?
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Get support and coping strategies for difficult days
                                    </p>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => navigate('/app/immediate-support')}
                                    >
                                        Get Support
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Card 2 */}
                            <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-700/50 hover:border-orange-600 transition-colors">
                                <CardContent className="p-6 text-center">
                                    <Hand className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Sensory Overwhelm?
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Find calming strategies and sensory regulation tools
                                    </p>
                                    <Button
                                        className="bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() => navigate('/app/sensory')}
                                    >
                                        Sensory Tools
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Card 3 */}
                            <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border-cyan-700/50 hover:border-cyan-600 transition-colors">
                                <CardContent className="p-6 text-center">
                                    <List className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Focus Challenges?
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Get help organizing tasks and building routines
                                    </p>
                                    <Button
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                                        onClick={() => navigate('/app/executive')}
                                    >
                                        Executive Tools
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Making the Most of Your Check-ins */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-2xl text-cyan-400 flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 mr-2" />
                            Making the Most of Your Check-ins
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                                <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Same Time Daily
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Try to check in at the same time each day to build a helpful
                                    routine.
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                                <Heart className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-white mb-2">Be Honest</h3>
                                <p className="text-gray-300 text-sm">
                                    There's no judgment here. Honest ratings help you understand
                                    your patterns.
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                                <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Look for Patterns
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Over time, you'll start to see patterns that can guide your
                                    self-care.
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                                <Star className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Celebrate Progress
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Notice improvements, even small ones. Every step forward
                                    matters.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DailyCheckin;
