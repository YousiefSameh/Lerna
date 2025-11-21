"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { submitExam } from "@/app/dashboard/[slug]/[lessonId]/actions";
import { toast } from "sonner";
import { Loader2, Send, BookOpen } from "lucide-react";
import { ExamResult } from "./ExamResult";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  text: string;
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "FILL_IN_BLANK";
  options: string[];
  position: number;
}

interface ExamRunnerProps {
  examId: string;
  questions: Question[];
  initialAttemptsUsed: number;
}

export function ExamRunner({ examId, questions, initialAttemptsUsed }: ExamRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ score: number; passed: boolean; attemptsUsed: number } | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(initialAttemptsUsed);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      toast.error(`Please answer all questions (${answeredCount}/${questions.length} answered)`);
      return;
    }

    startTransition(async () => {
      const response = await submitExam(examId, answers);
      if (response.status === "success" && response.data) {
        setResult(response.data);
        setAttemptsUsed(response.data.attemptsUsed);
        if (response.data.passed) {
          toast.success("Congratulations! You passed!");
        } else {
          toast.error("You did not pass this time.");
        }
      } else {
        toast.error(response.message || "Failed to submit exam");
      }
    });
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;

  if (result) {
    return (
      <ExamResult
        score={result.score}
        passed={result.passed}
        attemptsUsed={result.attemptsUsed}
        maxAttempts={3}
        onRetry={handleRetry}
      />
    );
  }

  if (attemptsUsed >= 3) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 border-2 border-destructive/20">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <div className="size-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <BookOpen className="size-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-destructive">No Attempts Remaining</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You have used all 3 attempts for this exam. Please contact your instructor if you need assistance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Final Exam
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Answer all questions to the best of your ability
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">Attempt</div>
              <div className="text-2xl font-bold text-primary">
                {attemptsUsed + 1} / 3
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {Object.keys(answers).length} / {questions.length} answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>
      
      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const isAnswered = !!answers[question.id];
          
          return (
            <Card 
              key={question.id} 
              className={cn(
                "border-2 transition-all duration-200",
                isAnswered 
                  ? "border-primary/30 shadow-md bg-primary/5" 
                  : "border-border hover:border-primary/20"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex items-center justify-center size-10 rounded-full font-bold text-lg shrink-0",
                    isAnswered 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg font-semibold leading-relaxed pt-1">
                    {question.text}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {question.type === "MULTIPLE_CHOICE" && (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(val: string) => handleAnswerChange(question.id, val)}
                    className="space-y-3"
                  >
                    {question.options.map((option, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50",
                          answers[question.id] === i.toString()
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        )}
                      >
                        <RadioGroupItem 
                          value={i.toString()} 
                          id={`${question.id}-${i}`}
                          className="shrink-0"
                        />
                        <Label 
                          htmlFor={`${question.id}-${i}`} 
                          className="flex-1 cursor-pointer text-base leading-relaxed"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "TRUE_FALSE" && (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(val: string) => handleAnswerChange(question.id, val)}
                    className="space-y-3"
                  >
                    {["true", "false"].map((value) => (
                      <div 
                        key={value}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50",
                          answers[question.id] === value
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        )}
                      >
                        <RadioGroupItem 
                          value={value} 
                          id={`${question.id}-${value}`}
                          className="shrink-0"
                        />
                        <Label 
                          htmlFor={`${question.id}-${value}`} 
                          className="flex-1 cursor-pointer text-base capitalize"
                        >
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "FILL_IN_BLANK" && (
                  <Input
                    placeholder="Type your answer here..."
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-base h-12"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background sticky bottom-4 shadow-xl">
        <CardContent className="pt-6">
          <Button 
            onClick={handleSubmit} 
            className="w-full h-14 text-lg font-semibold shadow-lg" 
            disabled={pending}
            size="lg"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 size-5" />
                Submit Exam
              </>
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Make sure you've answered all questions before submitting
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
