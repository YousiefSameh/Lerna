"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";



interface ExamResultProps {
  score: number;
  passed: boolean;
  attemptsUsed: number;
  maxAttempts: number;
  onRetry: () => void;
}

export function ExamResult({ score, passed, attemptsUsed, maxAttempts, onRetry }: ExamResultProps) {
  const canRetry = attemptsUsed < maxAttempts;
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    if (passed) {
      triggerConfetti();
    }
  }, [passed, triggerConfetti]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <Card className={cn(
        "border-2 shadow-2xl overflow-hidden",
        passed ? "border-green-500/30" : "border-red-500/30"
      )}>
        <div className={cn(
          "h-2 w-full",
          passed ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-400 to-red-600"
        )} />
        
        <CardHeader className={cn(
          "text-center pb-6 pt-12",
          passed 
            ? "bg-gradient-to-br from-green-50 to-background dark:from-green-950/20" 
            : "bg-gradient-to-br from-red-50 to-background dark:from-red-950/20"
        )}>
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "rounded-full p-4 animate-in zoom-in duration-500",
              passed ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            )}>
              {passed ? (
                <Trophy className="size-16 text-green-600 dark:text-green-400" />
              ) : (
                <Target className="size-16 text-red-600 dark:text-red-400" />
              )}
            </div>
            
            <CardTitle className="text-3xl font-bold">
              {passed ? "Congratulations!" : "Keep Trying!"}
            </CardTitle>
            
            <p className={cn(
              "text-lg font-medium",
              passed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            )}>
              {passed 
                ? "You passed the exam!" 
                : "You didn't pass this time, but don't give up!"}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 pb-12 space-y-8">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className={cn(
                "text-7xl font-bold tabular-nums",
                passed 
                  ? "bg-gradient-to-br from-green-600 to-green-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-br from-red-600 to-red-400 bg-clip-text text-transparent"
              )}>
                {score}%
              </div>
              <div className="absolute -top-2 -right-8">
                {passed ? (
                  <CheckCircle2 className="size-8 text-green-500 animate-in zoom-in duration-700 delay-300" />
                ) : (
                  <XCircle className="size-8 text-red-500 animate-in zoom-in duration-700 delay-300" />
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Your Score
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Card className={cn(
              "border-2",
              passed ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20" : "border-border"
            )}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {attemptsUsed}/{maxAttempts}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Attempts Used
                </div>
              </CardContent>
            </Card>
            
            <Card className={cn(
              "border-2",
              score >= 50 ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20" : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
            )}>
              <CardContent className="pt-6 text-center">
                <div className={cn(
                  "text-3xl font-bold mb-1",
                  score >= 50 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  50%
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Passing Score
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 max-w-md mx-auto pt-4">
            {canRetry && !passed && (
              <Button 
                onClick={onRetry} 
                size="lg" 
                className="w-full h-14 text-base font-semibold shadow-lg"
              >
                <RotateCcw className="size-5 mr-2" />
                Try Again ({maxAttempts - attemptsUsed} {maxAttempts - attemptsUsed === 1 ? 'attempt' : 'attempts'} left)
              </Button>
            )}
            
            {!canRetry && !passed && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You've used all available attempts. Please contact your instructor for help.
                </p>
              </div>
            )}
            
            {passed && (
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-900">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Great job! You can now proceed to the next lesson.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
