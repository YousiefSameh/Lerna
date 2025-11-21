"use client";

import { ExamSchemaType, examSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useTransition } from "react";
import { createExam, updateExam, deleteExam } from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ExamBuilderProps {
  lessonId: string;
  initialData?: ExamSchemaType & { id?: string };
}

export function ExamBuilder({ lessonId, initialData }: ExamBuilderProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ExamSchemaType>({
    resolver: zodResolver(examSchema),
    defaultValues: initialData || {
      title: "",
      lessonId,
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (values: ExamSchemaType) => {
    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateExam(values, initialData.id);
      } else {
        result = await createExam(values);
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this exam?")) return;
    
    startTransition(async () => {
      const result = await deleteExam(initialData.id!);
      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
        form.reset({ title: "", lessonId, questions: [] });
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Exam Configuration
              </CardTitle>
              <CardDescription className="mt-1">
                Create comprehensive exams to test your students
              </CardDescription>
            </div>
            {initialData?.id && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={pending}>
                <Trash2 className="size-4 mr-2" />
                Delete Exam
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Exam Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Final Assessment, Chapter Quiz" 
                        className="text-base h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-lg font-semibold">Questions</h3>
                    <p className="text-sm text-muted-foreground">Build your exam questions</p>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => append({ 
                      text: "", 
                      type: "MULTIPLE_CHOICE", 
                      options: ["", "", "", ""], 
                      answer: "0", 
                      position: fields.length + 1 
                    })}
                    className="shadow-md"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <QuestionItem key={field.id} index={index} form={form} remove={remove} />
                  ))}
                  
                  {fields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">No questions yet. Click "Add Question" to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={pending} size="lg" className="w-full shadow-lg">
                {pending ? (
                  <>
                    <Loader2 className="animate-spin size-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-5 mr-2" />
                    Save Exam
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionItem({ 
  index, 
  form, 
  remove 
}: { 
  index: number; 
  form: any; 
  remove: (index: number) => void 
}) {
  const type = useWatch({
    control: form.control,
    name: `questions.${index}.type`,
  });

  const options = useWatch({
    control: form.control,
    name: `questions.${index}.options`,
  }) || [];

  return (
    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0 mt-1">
                {index + 1}
              </div>
              <FormField
                control={form.control}
                name={`questions.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-base font-semibold">Question</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your question here" 
                        className="text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`questions.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Question Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True / False</SelectItem>
                      <SelectItem value="FILL_IN_BLANK">Fill in Blank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "MULTIPLE_CHOICE" && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                <FormLabel className="font-semibold text-base">Options</FormLabel>
                <FormField
                  control={form.control}
                  name={`questions.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <RadioGroup 
                        value={field.value} 
                        onValueChange={(val: string) => field.onChange(val)}
                        className="space-y-3"
                      >
                        {[0, 1, 2, 3].map((optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3 bg-background p-3 rounded-md border hover:border-primary/50 transition-colors">
                            <RadioGroupItem 
                              value={optionIndex.toString()} 
                              id={`q${index}-opt${optionIndex}`}
                              className="shrink-0"
                            />
                            <Label 
                              htmlFor={`q${index}-opt${optionIndex}`}
                              className="sr-only"
                            >
                              Correct answer
                            </Label>
                            <FormField
                              control={form.control}
                              name={`questions.${index}.options.${optionIndex}`}
                              render={({ field: optField }) => (
                                <FormItem className="flex-1 space-y-0">
                                  <FormControl>
                                    <Input 
                                      placeholder={`Option ${optionIndex + 1}`}
                                      {...optField}
                                      className={cn(
                                        "border-none shadow-none focus-visible:ring-0",
                                        field.value === optionIndex.toString() && "font-semibold"
                                      )}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            {field.value === optionIndex.toString() && (
                              <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground mt-2">
                        Select the radio button next to the correct answer
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {type === "TRUE_FALSE" && (
              <FormField
                control={form.control}
                name={`questions.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Correct Answer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === "FILL_IN_BLANK" && (
              <FormField
                control={form.control}
                name={`questions.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Correct Answer</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the correct answer" 
                        {...field} 
                        className="max-w-md"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Answer comparison is case-insensitive
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => remove(index)}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
