'use client';

import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Heart,
    MessageCircle,
    Briefcase,
    TrendingUp,
    LifeBuoy,
    Phone,
    MessageSquare,
    AlertTriangle,
    Brain,
    Scale,
    Leaf,
    X,
    Play,
    Pause,
    RotateCcw,
    ChevronDown,
    Star,
    Clock,
    Users,
    Loader2,
    CheckCircle,
    Timer,
} from 'lucide-react';

// UI Components
interface CardProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

interface ButtonProps {
    className?: string;
    variant?: 'ghost' | 'outline' | 'destructive' | 'default';
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}

interface SliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    max: number;
    min: number;
    step: number;
    className?: string;
}

const Card: FC<CardProps> = ({ className, children, onClick }) => (
    <div className={`rounded-lg shadow-lg ${className}`} onClick={onClick}>
        {children}
    </div>
);

const Button: FC<ButtonProps> = ({
    className,
    variant = 'default',
    onClick,
    children,
    disabled,
}) => {
    const baseStyles =
        'px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2';
    const variantStyles =
        variant === 'ghost'
            ? 'bg-transparent hover:bg-gray-700'
            : variant === 'outline'
            ? 'bg-transparent border border-sora-teal text-sora-teal hover:bg-sora-teal hover:text-sora-dark'
            : variant === 'destructive'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-sora-teal hover:bg-sora-teal/80 text-sora-dark';

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const Select: FC<SelectProps> = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="w-full bg-sora-muted border border-sora-teal/30 text-white p-3 rounded-lg flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || 'Select your primary emotion...'}</span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-sora-muted border border-sora-teal/30 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                    {React.Children.map(children, (child) => child)}
                </div>
            )}
        </div>
    );
};

const SelectItem: FC<{
    value: string;
    children: React.ReactNode;
    onSelect: (value: string) => void;
}> = ({ value, children, onSelect }) => (
    <button
        className="w-full text-left p-3 hover:bg-sora-teal hover:text-sora-dark text-white transition-colors"
        onClick={() => onSelect(value)}
    >
        {children}
    </button>
);

const Slider: FC<SliderProps> = ({ value, onValueChange, max, min, step, className }) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;

    return (
        <div className={`relative ${className}`}>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Intense</span>
            </div>
            <div className="relative h-3 bg-gray-600 rounded-full">
                <div
                    className="absolute h-full bg-sora-teal rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={(e) => onValueChange([Number.parseInt(e.target.value)])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            <div className="text-center mt-2">
                <span className="text-2xl font-bold text-sora-teal">{value[0]}</span>
            </div>
        </div>
    );
};

// Cookie utility functions
const saveToRecentActivities = (activity: any) => {
    try {
        const existingActivities = JSON.parse(
            localStorage.getItem('sora_recent_activities') || '[]',
        );
        const newActivity = {
            ...activity,
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
        };
        const updatedActivities = [newActivity, ...existingActivities.slice(0, 9)]; // Keep only 10 most recent
        localStorage.setItem('sora_recent_activities', JSON.stringify(updatedActivities));
        console.log('Activity saved to localStorage:', newActivity);
    } catch (error) {
        console.error('Error saving to recent activities:', error);
    }
};

// Strategy Execution Modal Component
interface StrategyExecutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    strategy: {
        id: string;
        title: string;
        description: string;
        steps: string[];
        timeNeeded: string;
        difficulty: string;
        emotion?: string;
    };
}

const StrategyExecutionModal: FC<StrategyExecutionModalProps> = ({ isOpen, onClose, strategy }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [effectiveness, setEffectiveness] = useState(0);
    const [notes, setNotes] = useState('');

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (currentStep < strategy.steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setIsCompleted(true);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, currentStep, strategy.steps.length]);

    const startStep = () => {
        setIsActive(true);
        // Set timer based on strategy type
        if (strategy.title.includes('4-7-8') || strategy.title.includes('Breathing')) {
            setTimeLeft(30); // 30 seconds for breathing exercises
        } else if (strategy.title.includes('Grounding')) {
            setTimeLeft(60); // 1 minute for grounding
        } else {
            setTimeLeft(45); // Default 45 seconds per step
        }
    };

    const nextStep = () => {
        if (currentStep < strategy.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setIsActive(false);
            setTimeLeft(0);
        } else {
            setIsCompleted(true);
        }
    };

    const resetStrategy = () => {
        setCurrentStep(0);
        setIsActive(false);
        setTimeLeft(0);
        setIsCompleted(false);
        setEffectiveness(0);
        setNotes('');
    };

    const handleComplete = () => {
        // Save to recent activities in localStorage
        const activity = {
            type: 'strategy_completed',
            title: `Completed: ${strategy.title}`,
            description: `Successfully completed coping strategy for ${
                strategy.emotion || 'emotional'
            } feelings`,
            emotion: strategy.emotion || 'unknown',
            effectiveness,
            notes,
            strategyName: strategy.title,
            difficulty: strategy.difficulty,
            timeNeeded: strategy.timeNeeded,
        };

        saveToRecentActivities(activity);
        console.log('Strategy completion saved:', activity);

        onClose();
        resetStrategy();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-sora-teal">{strategy.title}</h3>
                    <Button variant="ghost" onClick={onClose} className="p-2">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-gray-300 mb-6">{strategy.description}</p>

                {!isCompleted ? (
                    <div className="space-y-4">
                        <div className="bg-sora-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">
                                    Step {currentStep + 1} of {strategy.steps.length}
                                </span>
                                {timeLeft > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Timer className="w-4 h-4 text-sora-teal" />
                                        <span className="text-lg font-bold text-sora-teal">
                                            {timeLeft}s
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-white text-lg">{strategy.steps[currentStep]}</p>
                        </div>

                        <div className="flex gap-3">
                            {!isActive && timeLeft === 0 ? (
                                <Button onClick={startStep} className="flex-1">
                                    <Play className="w-4 h-4" />
                                    Start Step
                                </Button>
                            ) : (
                                <Button onClick={() => setIsActive(false)} className="flex-1">
                                    <Pause className="w-4 h-4" />
                                    Pause
                                </Button>
                            )}

                            <Button variant="outline" onClick={nextStep}>
                                {currentStep === strategy.steps.length - 1 ? 'Finish' : 'Next Step'}
                            </Button>

                            <Button variant="outline" onClick={resetStrategy}>
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </Button>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center gap-2 mb-2">
                                {strategy.steps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${
                                            index === currentStep
                                                ? 'bg-sora-teal'
                                                : index < currentStep
                                                ? 'bg-green-500'
                                                : 'bg-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">
                                Time needed: {strategy.timeNeeded} • Difficulty:{' '}
                                {strategy.difficulty}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">
                                Strategy Completed!
                            </h4>
                            <p className="text-gray-300">
                                How effective was this strategy for you?
                            </p>
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-3">
                                Rate Effectiveness (1-5 stars)
                            </label>
                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setEffectiveness(rating)}
                                        className="p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                rating <= effectiveness
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-3">
                                Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="How did this strategy work for you? Any observations or modifications?"
                                className="w-full bg-sora-muted border border-sora-teal/30 text-white placeholder-gray-400 p-3 rounded-lg min-h-[80px] resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleComplete}
                                className="flex-1"
                                disabled={effectiveness === 0}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Done
                            </Button>
                            <Button variant="outline" onClick={resetStrategy}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Exercise Modal Component
interface ExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercise: {
        title: string;
        description: string;
        steps: string[];
        duration?: string;
    };
}

const ExerciseModal: FC<ExerciseModalProps> = ({ isOpen, onClose, exercise }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (currentStep < exercise.steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, currentStep, exercise.steps.length]);

    const startExercise = () => {
        setIsActive(true);
        setTimeLeft(exercise.title.includes('4-7-8') ? 19 : 5); // 4+7+8 = 19 for breathing
    };

    const resetExercise = () => {
        setIsActive(false);
        setCurrentStep(0);
        setTimeLeft(0);
    };

    const handleExerciseComplete = () => {
        // Save exercise completion to recent activities
        const activity = {
            type: 'exercise_completed',
            title: `Completed: ${exercise.title}`,
            description: `Successfully completed quick exercise`,
            exerciseName: exercise.title,
        };

        saveToRecentActivities(activity);
        console.log('Exercise completion saved:', activity);
        onClose();
        resetExercise();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-sora-teal">{exercise.title}</h3>
                    <Button variant="ghost" onClick={onClose} className="p-2">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-gray-300 mb-6">{exercise.description}</p>

                <div className="space-y-4">
                    <div className="bg-sora-muted/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">
                                Step {currentStep + 1} of {exercise.steps.length}
                            </span>
                            {timeLeft > 0 && (
                                <span className="text-2xl font-bold text-sora-teal">
                                    {timeLeft}
                                </span>
                            )}
                        </div>
                        <p className="text-white">{exercise.steps[currentStep]}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={isActive ? () => setIsActive(false) : startExercise}
                            className="flex-1"
                        >
                            {isActive ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button variant="outline" onClick={resetExercise}>
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                        {currentStep === exercise.steps.length - 1 && !isActive && (
                            <Button
                                onClick={handleExerciseComplete}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Strategy Card Component
interface StrategyCardProps {
    strategy: {
        id: string;
        title: string;
        description: string;
        difficulty: string;
        effectiveness: number;
        steps: string[];
        timeNeeded: string;
        bestUsedWhen: string;
        category: string;
    };
    borderColor: string;
    iconColor: string;
    icon: React.ReactNode;
    onTryStrategy: (strategy: any) => void;
    emotion?: string;
}

const StrategyCard: FC<StrategyCardProps> = ({
    strategy,
    borderColor,
    iconColor,
    icon,
    onTryStrategy,
    emotion,
}) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
            />
        ));
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-500/20 text-green-400 border-green-400';
            case 'medium':
                return 'bg-orange-500/20 text-orange-400 border-orange-400';
            case 'hard':
                return 'bg-red-500/20 text-red-400 border-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-400';
        }
    };

    return (
        <Card
            className={`bg-gradient-to-br from-sora-card to-sora-muted border-l-4 ${borderColor} p-6`}
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center`}
                >
                    {icon}
                </div>
                <div
                    className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(
                        strategy.difficulty,
                    )}`}
                >
                    {strategy.difficulty} Difficulty
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{strategy.title}</h3>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-300 text-sm">Effectiveness:</span>
                <div className="flex gap-1">{renderStars(strategy.effectiveness)}</div>
            </div>

            <p className="text-gray-300 text-sm mb-6">{strategy.description}</p>

            <div className="space-y-4 mb-6">
                {strategy.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-sora-teal rounded-full flex items-center justify-center text-sora-dark text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                        </div>
                        <p className="text-white text-sm">{step}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sora-teal" />
                    <span className="text-white text-sm">
                        <strong>Time needed:</strong> {strategy.timeNeeded}
                    </span>
                </div>
                <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-sora-teal mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">
                        <strong>Best used when:</strong> {strategy.bestUsedWhen}
                    </span>
                </div>
            </div>

            <Button className="w-full" onClick={() => onTryStrategy({ ...strategy, emotion })}>
                <Play className="w-4 h-4" />
                Try This Strategy
            </Button>
        </Card>
    );
};

// Main Component
const EmotionalSupport: FC = () => {
    const { toast } = useToast()
    const navigate = useNavigate();
    const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`;

    const [activeView, setActiveView] = useState<'main' | 'strategies' | 'strategiesResult'>(
        'main',
    );
    const [selectedEmotion, setSelectedEmotion] = useState<string>('');
    const [intensity, setIntensity] = useState<number[]>([5]);
    const [triggers, setTriggers] = useState<string>('');
    const [showExerciseModal, setShowExerciseModal] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<any>(null);
    const [fromEmotionCard, setFromEmotionCard] = useState<boolean>(false);
    const [strategies, setStrategies] = useState<any[]>([]);
    const [quickAccessTools, setQuickAccessTools] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emotionalEntryId, setEmotionalEntryId] = useState<string>('');
    const [showStrategyModal, setShowStrategyModal] = useState<boolean>(false);
    const [selectedStrategy, setSelectedStrategy] = useState<any>(null);

    const emotions = [
        {
            id: 'anxious',
            label: 'Anxious',
            emoji: '😰',
            color: 'from-blue-500/20 to-blue-600/20 border-blue-400',
        },
        {
            id: 'sad',
            label: 'Sad',
            emoji: '😢',
            color: 'from-sora-teal/20 to-sora-teal/30 border-sora-teal',
        },
        {
            id: 'overwhelmed',
            label: 'Overwhelmed',
            emoji: '😵',
            color: 'from-purple-500/20 to-purple-600/20 border-purple-400',
        },
        {
            id: 'frustrated',
            label: 'Frustrated',
            emoji: '😤',
            color: 'from-orange-500/20 to-orange-600/20 border-orange-400',
        },
        {
            id: 'lonely',
            label: 'Lonely',
            emoji: '😔',
            color: 'from-gray-500/20 to-gray-600/20 border-gray-400',
        },
        {
            id: 'angry',
            label: 'Angry',
            emoji: '😡',
            color: 'from-red-500/20 to-red-600/20 border-red-400',
        },
    ];

    const exercises = [
        {
            title: '4-7-8 Breathing',
            description: 'Breathe in for 4, hold for 7, exhale for 8',
            steps: [
                'Breathe in through your nose for 4 seconds',
                'Hold your breath for 7 seconds',
                'Exhale through your mouth for 8 seconds',
                'Repeat this cycle 3-4 times',
            ],
        },
        {
            title: '5-4-3-2-1 Grounding',
            description: '5 things you see, 4 you hear, 3 you touch',
            steps: [
                'Notice 5 things you can see around you',
                'Notice 4 things you can hear',
                'Notice 3 things you can touch or feel',
                'Notice 2 things you can smell',
                'Notice 1 thing you can taste',
            ],
        },
        {
            title: 'Progressive Relaxation',
            description: 'Tense and release muscle groups',
            steps: [
                'Start with your toes - tense for 5 seconds, then relax',
                'Move to your calves - tense and relax',
                'Continue with thighs, abdomen, arms',
                'Finish with shoulders and face muscles',
                'Take deep breaths and notice the relaxation',
            ],
        },
    ];

    const handleEmotionClick = (emotionId: string) => {
        setSelectedEmotion(emotionId);
        setFromEmotionCard(true);
        setActiveView('strategies');

        // Save emotional check-in activity
        const activity = {
            type: 'emotion_selected',
            title: `Emotional Check-in: ${emotions.find((e) => e.id === emotionId)?.label}`,
            description: `Selected ${
                emotions.find((e) => e.id === emotionId)?.label
            } as current emotion`,
            emotion: emotions.find((e) => e.id === emotionId)?.label,
        };
        saveToRecentActivities(activity);
    };

    const handleGetStrategies = () => {
        setFromEmotionCard(false);
        setActiveView('strategies');
    };

    const handleStartExercise = (exercise: any) => {
        setSelectedExercise(exercise);
        setShowExerciseModal(true);
    };

    const handleTryStrategy = (strategy: any) => {
        setSelectedStrategy(strategy);
        setShowStrategyModal(true);
    };

    const handleGetPersonalizedStrategies = async () => {
        setIsLoading(true);
        try {
            const emotionLabel = fromEmotionCard
                ? emotions.find((e) => e.id === selectedEmotion)?.label || selectedEmotion
                : selectedEmotion;

            const token = localStorage.getItem('authToken');

            const response = await axios.post(
                `${API_BASE}/emotional-support/strategies`,
                {
                    emotion: emotionLabel,
                    intensity: intensity[0],
                    triggers: triggers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setStrategies(response.data.strategies);
            setQuickAccessTools(response.data.quickAccessTools);
            setEmotionalEntryId(response.data.emotionalEntryId);
            setActiveView('strategiesResult');

            // Save strategies generation activity
            const activity = {
                type: 'strategies_generated',
                title: `Generated Strategies for ${emotionLabel}`,
                description: `AI generated ${response.data.strategies.length} personalized coping strategies`,
                emotion: emotionLabel,
                intensity: intensity[0],
                strategiesCount: response.data.strategies.length,
            };
            saveToRecentActivities(activity);
        } catch (error) {
            console.error('Error fetching strategies:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch personalized strategies. Please try again later.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderMainView = () => (
        <div className="min-h-screen bg-gradient-to-br via-gray-900 to-sora-dark p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Heart className="w-8 h-8 text-sora-teal" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                            Emotional Support
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        AI-powered emotional support with therapeutic techniques designed for
                        neurodivergent minds.
                    </p>
                </div>

                {/* Crisis Alert */}
                <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg p-6 mb-8">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-red-400 text-xl font-semibold">
                            <AlertTriangle className="w-6 h-6" />
                            Need Immediate Help?
                        </div>
                        <p className="text-slate-300 mt-2">
                            If you're having thoughts of hurting yourself or others, please reach
                            out for immediate support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            className="h-14 bg-red-600 text-white border-red-500 hover:bg-red-800 font-medium flex items-center gap-2 justify-center transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Call 988
                        </Button>
                        <Button
                            variant="outline"
                            className="h-14 bg-red-600 text-white border-red-500 hover:bg-red-800 font-medium flex items-center gap-2 justify-center transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Text Home to 741741
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/app/immediate-support')}
                            className="h-14 bg-red-600 text-white border-red-500 hover:bg-red-800 font-medium flex items-center gap-2 justify-center transition-colors"
                        >
                            <LifeBuoy className="w-4 h-4" />
                            Crisis Resources
                        </Button>
                    </div>
                </div>

                {/* Emotion Selection */}
                <div className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">
                        How are you feeling right now?
                    </h2>
                    <p className="text-gray-300 text-center mb-8">
                        Select what best describes your current emotional state:
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {emotions.map((emotion) => (
                            <Card
                                key={emotion.id}
                                className={`bg-gradient-to-br ${emotion.color} p-6 text-center cursor-pointer hover:scale-105 transition-transform border`}
                                onClick={() => handleEmotionClick(emotion.id)}
                            >
                                <div className="text-4xl mb-3">{emotion.emoji}</div>
                                <h3 className="text-white font-semibold">{emotion.label}</h3>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Exercises */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {exercises.map((exercise, index) => (
                            <Card
                                key={index}
                                className="bg-sora-muted/50 border border-sora-teal/20 p-6"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {exercise.title}
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">{exercise.description}</p>
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() => handleStartExercise(exercise)}
                                >
                                    Start
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Main Action Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-sora-teal p-6">
                        <div className="w-12 h-12 bg-sora-teal rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-6 h-6 text-sora-dark" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Talk to SORA</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Chat with our AI therapist trained in CBT, DBT, and mindfulness
                            techniques. Get personalized emotional support and therapeutic guidance.
                        </p>
                        <Button onClick={() => navigate('/app/chat')} className="w-full">
                            <MessageCircle className="w-4 h-4" />
                            Start Conversation
                        </Button>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-green-400 p-6">
                        <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-sora-dark" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Coping Strategies</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Get personalized coping techniques based on your current emotions and
                            triggers. Evidence-based strategies adapted for neurodivergent minds.
                        </p>
                        <Button onClick={handleGetStrategies} className="w-full">
                            <Briefcase className="w-4 h-4" />
                            Get Strategies
                        </Button>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-purple-400 p-6">
                        <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-sora-dark" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Emotional Insights</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Track your emotional patterns and gain insights into your triggers,
                            coping patterns, and emotional growth over time for better mental and
                            emotional well-being.
                        </p>
                        <Button onClick={() => navigate('/app/dashboard')} className="w-full">
                            <TrendingUp className="w-4 h-4" />
                            View Insights
                        </Button>
                    </Card>

                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border-l-4 border-l-red-400 p-6">
                        <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mb-4">
                            <LifeBuoy className="w-6 h-6 text-sora-dark" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Crisis Support</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Access immediate crisis resources, support hotlines, and emergency help.
                            Available 24/7 whenever you need urgent care, safety, and assistance.
                        </p>
                        <Button
                            onClick={() => navigate('/app/immediate-support')}
                            variant="destructive"
                            className="w-full"
                        >
                            <Phone className="w-4 h-4" />
                            Get Help Now
                        </Button>
                    </Card>
                </div>

                {/* Evidence-Based Support */}
                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-8 h-8 text-sora-teal" />
                        <h2 className="text-2xl font-bold text-sora-teal">
                            Evidence-Based Support
                        </h2>
                    </div>
                    <p className="text-gray-300 mb-6">
                        SORA uses evidence-based therapeutic approaches adapted for neurodivergent
                        individuals:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Brain className="w-6 h-6 text-sora-teal mt-1" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">
                                    Cognitive Behavioral Therapy (CBT)
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Identify and challenge negative thought patterns, develop
                                    healthier thinking habits.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Scale className="w-6 h-6 text-sora-teal mt-1" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">
                                    Dialectical Behavior Therapy (DBT)
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Emotion regulation, distress tolerance, and mindfulness skills
                                    for intense emotions.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Leaf className="w-6 h-6 text-sora-teal mt-1" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">Mindfulness</h3>
                                <p className="text-gray-300 text-sm">
                                    Present-moment awareness and self-compassion practices adapted
                                    for neurodivergent minds.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Heart className="w-6 h-6 text-sora-teal mt-1" />
                            <div>
                                <h3 className="text-white font-semibold mb-1">
                                    Validation Therapy
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Feel truly heard and understood with deep emotional validation
                                    and support.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderStrategiesView = () => (
        <div className="relative min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 rounded-lg p-8 text-center">
                        <Loader2 className="w-8 h-8 text-sora-teal animate-spin mx-auto mb-4" />
                        <p className="text-white">Generating personalized strategies...</p>
                    </div>
                </div>
            )}

            <div className={`max-w-4xl mx-auto ${isLoading ? 'blur-sm' : ''}`}>
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView('main')}
                        className="text-sora-teal hover:text-sora-teal/80"
                    >
                        ← Back to Emotional Support
                    </Button>
                </div>

                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Briefcase className="w-8 h-8 text-sora-teal" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                            Personalized Coping Strategies
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Evidence-based techniques adapted for neurodivergent minds to help you
                        navigate challenging emotions.
                    </p>
                </div>

                <Card className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Tell Me How You're Feeling
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Share your current emotional state so I can suggest the most helpful
                        strategies for you right now.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-white font-medium mb-3">
                                What emotion are you experiencing most strongly?
                            </label>
                            {fromEmotionCard ? (
                                <div className="bg-sora-muted border border-sora-teal/30 text-white p-3 rounded-lg">
                                    {emotions.find((e) => e.id === selectedEmotion)?.label ||
                                        selectedEmotion}
                                </div>
                            ) : (
                                <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                                    <SelectItem value="" onSelect={setSelectedEmotion}>
                                        Select your primary emotion...
                                    </SelectItem>
                                    <SelectItem
                                        value="Anxious/Worried"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Anxious/Worried
                                    </SelectItem>
                                    <SelectItem value="Sad/Down" onSelect={setSelectedEmotion}>
                                        Sad/Down
                                    </SelectItem>
                                    <SelectItem
                                        value="Overwhelmed/Stressed"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Overwhelmed/Stressed
                                    </SelectItem>
                                    <SelectItem
                                        value="Angry/Frustrated"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Angry/Frustrated
                                    </SelectItem>
                                    <SelectItem
                                        value="Lonely/Isolated"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Lonely/Isolated
                                    </SelectItem>
                                    <SelectItem
                                        value="Confused/Uncertain"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Confused/Uncertain
                                    </SelectItem>
                                    <SelectItem
                                        value="Exhausted/Drained"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Exhausted/Drained
                                    </SelectItem>
                                    <SelectItem
                                        value="Rejected/Misunderstood"
                                        onSelect={setSelectedEmotion}
                                    >
                                        Rejected/Misunderstood
                                    </SelectItem>
                                </Select>
                            )}
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-3">
                                How intense is this feeling? (1-10)
                            </label>
                            <Slider
                                value={intensity}
                                onValueChange={setIntensity}
                                max={10}
                                min={1}
                                step={1}
                                className="mb-4"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-3">
                                What triggered this feeling? (optional)
                            </label>
                            <textarea
                                value={triggers}
                                onChange={(e) => setTriggers(e.target.value)}
                                placeholder="e.g., social interaction, work deadline, sensory overload, unexpected change..."
                                className="w-full bg-sora-muted border border-sora-teal/30 text-white placeholder-gray-400 p-3 rounded-lg min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                className="w-full max-w-xs"
                                onClick={handleGetPersonalizedStrategies}
                                disabled={!selectedEmotion || isLoading}
                            >
                                <Briefcase className="w-4 h-4" />
                                Get My Personalized Strategies
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderStrategiesResult = () => {
        const emotionLabel = fromEmotionCard
            ? emotions.find((e) => e.id === selectedEmotion)?.label || selectedEmotion
            : selectedEmotion;

        return (
            <div className="min-h-screen bg-gradient-to-br from-sora-dark via-gray-900 to-sora-dark p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveView('strategies')}
                            className="text-sora-teal hover:text-sora-teal/80"
                        >
                            ← Back to Form
                        </Button>
                    </div>

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Briefcase className="w-8 h-8 text-sora-teal" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-sora-teal to-sora-orange bg-clip-text text-transparent">
                                Personalized Coping Strategies
                            </h1>
                        </div>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Evidence-based techniques adapted for neurodivergent minds to help you
                            navigate challenging emotions.
                        </p>
                    </div>

                    {/* Personalized Banner */}
                    <div className="bg-gradient-to-r from-sora-teal to-sora-teal/80 rounded-lg p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6 text-sora-dark" />
                            <h2 className="text-xl font-bold text-sora-dark">
                                Strategies for {emotionLabel} Feelings
                            </h2>
                        </div>
                        <p className="text-sora-dark">
                            These techniques are specifically chosen for your current emotional
                            state. Start with the ones that feel most manageable.
                        </p>
                    </div>

                    {/* Quick Access Tools */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {quickAccessTools.map((tool, index) => (
                            <Card
                                key={index}
                                className="bg-sora-muted/50 border border-sora-teal/20 p-4 text-center"
                            >
                                <div className="w-10 h-10 bg-sora-teal rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg">{tool.icon}</span>
                                </div>
                                <h3 className="text-white font-semibold text-sm mb-1">
                                    {tool.title}
                                </h3>
                                <p className="text-gray-300 text-xs">{tool.description}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Detailed Strategies */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {strategies.map((strategy, index) => {
                            const borderColors = [
                                'border-l-green-400',
                                'border-l-blue-400',
                                'border-l-purple-400',
                                'border-l-orange-400',
                            ];
                            const iconColors = [
                                'bg-green-400',
                                'bg-blue-400',
                                'bg-purple-400',
                                'bg-orange-400',
                            ];
                            const icons = [
                                <Leaf key="leaf" className="w-6 h-6 text-sora-dark" />,
                                <Brain key="brain" className="w-6 h-6 text-sora-dark" />,
                                <Heart key="heart" className="w-6 h-6 text-sora-dark" />,
                                <Scale key="scale" className="w-6 h-6 text-sora-dark" />,
                            ];

                            return (
                                <StrategyCard
                                    key={strategy.id}
                                    strategy={strategy}
                                    borderColor={borderColors[index % borderColors.length]}
                                    iconColor={iconColors[index % iconColors.length]}
                                    icon={icons[index % icons.length]}
                                    onTryStrategy={handleTryStrategy}
                                    emotion={emotionLabel}
                                />
                            );
                        })}
                    </div>

                    {/* Need More Support */}
                    <Card className="bg-gradient-to-br from-sora-card to-sora-muted border border-sora-teal/20 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-sora-teal" />
                            <h2 className="text-2xl font-bold text-sora-teal">
                                Need More Support?
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-sora-teal rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-6 h-6 text-sora-dark" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">Talk to SORA</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Personalized emotional support and guidance
                                </p>
                                <Button onClick={() => navigate('/app/chat')} className="w-full">
                                    Chat Now
                                </Button>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-sora-teal rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-6 h-6 text-sora-dark" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">Track Patterns</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Understand your emotional trends over time
                                </p>
                                <Button
                                    onClick={() => navigate('/app/dashboard')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    View Insights
                                </Button>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-sora-teal rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-sora-dark" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">Community Support</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Connect with others who understand
                                </p>
                                <Button variant="outline" className="w-full bg-transparent">
                                    Join Community
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {(() => {
                switch (activeView) {
                    case 'strategies':
                        return renderStrategiesView();
                    case 'strategiesResult':
                        return renderStrategiesResult();
                    default:
                        return renderMainView();
                }
            })()}

            <ExerciseModal
                isOpen={showExerciseModal}
                onClose={() => setShowExerciseModal(false)}
                exercise={selectedExercise || exercises[0]}
            />

            <StrategyExecutionModal
                isOpen={showStrategyModal}
                onClose={() => setShowStrategyModal(false)}
                strategy={
                    selectedStrategy || {
                        id: '',
                        title: '',
                        description: '',
                        steps: [],
                        timeNeeded: '',
                        difficulty: '',
                    }
                }
            />
        </div>
    );
};

export default EmotionalSupport;
