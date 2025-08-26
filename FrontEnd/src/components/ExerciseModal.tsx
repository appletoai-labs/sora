import React, { FC, useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle, Pause, Play, RotateCcw, X } from "lucide-react";

interface Exercise {
  title: string;
  description: string;
  steps: string[];
}

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
}

const ExerciseModal: FC<ExerciseModalProps> = ({ isOpen, onClose, exercise }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  React.useEffect(() => {
    console.log("ExerciseModal props:", { isOpen, exercise });
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
    setTimeLeft(exercise.title.includes("Progressive Muscle Relaxation") ? 10 : 5); // Custom timing for PMR
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(0);
  };

  const handleExerciseComplete = () => {
    const activity = {
      type: "exercise_completed",
      title: `Completed: ${exercise.title}`,
      description: `Successfully completed quick exercise`,
      exerciseName: exercise.title,
    };
    console.log("Exercise completed:", activity);
    onClose();
    resetExercise();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-teal-500/20 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-teal-400">{exercise.title}</h3>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-gray-300 mb-6">{exercise.description}</p>

        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {exercise.steps.length}
              </span>
              {timeLeft > 0 && (
                <span className="text-2xl font-bold text-teal-400">{timeLeft}</span>
              )}
            </div>
            <p className="text-white">{exercise.steps[currentStep]}</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={isActive ? () => setIsActive(false) : startExercise}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-black"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" onClick={resetExercise} className="border-teal-500 text-teal-400">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            {currentStep === exercise.steps.length - 1 && !isActive && (
              <Button onClick={handleExerciseComplete} className="bg-green-600 hover:bg-green-700">
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

export default ExerciseModal;