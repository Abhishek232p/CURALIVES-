import { useEffect, useState } from "react";
import { useCuraLivesStore } from "@/lib/curalives/store";
import { createAIService, type IntakeResult } from "@/lib/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIDisclaimer } from "@/components/curalives/ai-disclaimer";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  CalendarClock,
  UserCheck,
  ClipboardList,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const CHRONIC_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart disease",
  "Thyroid",
  "None of these",
] as const;

const DURATION_OPTIONS = [
  "<1 day",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  ">2 weeks",
  "Chronic/repeating",
] as const;

const GENDER_OPTIONS = ["Female", "Male", "Other", "Prefer not to say"] as const;

export function IntakePage() {
  const setTempSelectedSpecialty = useCuraLivesStore((s) => s.setTempSelectedSpecialty);

  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [result, setResult] = useState<IntakeResult | null>(null);

  const formValid =
    symptoms.trim().length >= 10 &&
    duration.length > 0 &&
    age.length > 0 &&
    Number(age) >= 0 &&
    Number(age) <= 120 &&
    gender.length > 0;

  const toggleCondition = (cond: string) => {
    setConditions((prev) => {
      if (cond === "None of these") {
        return prev.includes(cond) ? [] : [cond];
      }
      const withoutNone = prev.filter((c) => c !== "None of these");
      return withoutNone.includes(cond)
        ? withoutNone.filter((c) => c !== cond)
        : [...withoutNone, cond];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || isLoading) return;

    setIsLoading(true);
    setResult(null);

    const loaderTimeout = setTimeout(() => setShowSkeleton(true), 100);

    try {
      const ai = createAIService();
      const resp = await ai.intakeSymptoms(symptoms, {
        age: Number(age),
        gender,
        conditions: conditions.filter((c) => c !== "None of these"),
        duration,
      });

      await new Promise((r) => setTimeout(r, 500));

      setResult(resp);
    } finally {
      clearTimeout(loaderTimeout);
      setShowSkeleton(false);
      setIsLoading(false);
    }
  };

  const handleBookSpecialist = () => {
    if (result?.suggestedSpecialty) {
      setTempSelectedSpecialty(result.suggestedSpecialty);
    }
  };

  useEffect(() => {
    return () => setTempSelectedSpecialty(null);
  }, [setTempSelectedSpecialty]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="mint" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-assisted
          </Badge>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy">
          AI-assisted health intake
        </h1>
        <p className="text-slate mt-2 text-sm sm:text-base">
          Tell us what you're experiencing — we'll organize it and suggest a next step. Your doctor reviews everything.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <AIDisclaimer variant="intake" />
      </div>

      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Tell us about your symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="symptoms" className="mb-1.5 flex items-center gap-1">
                Describe your symptoms
                <span className="text-emergency">*</span>
              </Label>
              <Textarea
                id="symptoms"
                placeholder="E.g. intermittent headaches with mild fever for the past three days, worse in the evenings, accompanied by fatigue and slight body ache..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                minLength={10}
                required
                className="min-h-[140px]"
              />
              <p className="text-xs text-slate mt-1.5">
                {symptoms.trim().length}/10 min characters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="mb-1.5 block">
                  Duration <span className="text-emergency">*</span>
                </Label>
                <Select value={duration} onValueChange={setDuration} required>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age" className="mb-1.5 block">
                  Age <span className="text-emergency">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  max={120}
                  placeholder="0-120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">
                Gender <span className="text-emergency">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={cn(
                      "h-11 px-3 rounded-xl border-2 font-semibold text-sm transition-all min-h-[44px]",
                      gender === g
                        ? "border-primary bg-blue-tint text-primary"
                        : "border-grey bg-white text-slate hover:border-primary/40 hover:bg-blue-tint/40"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Chronic conditions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CHRONIC_CONDITIONS.map((c) => {
                  const isActive = conditions.includes(c);
                  const noneSelected = conditions.includes("None of these");
                  const disabled =
                    c !== "None of these" && noneSelected;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      disabled={disabled && !isActive}
                      className={cn(
                        "flex items-center gap-2.5 h-11 px-4 rounded-xl border-2 font-medium text-sm text-left transition-all min-h-[44px]",
                        isActive
                          ? "border-primary bg-blue-tint text-primary"
                          : disabled
                          ? "border-grey bg-page text-slate/50 cursor-not-allowed"
                          : "border-grey bg-white text-navy hover:border-primary/40 hover:bg-blue-tint/40"
                      )}
                    >
                      <span
                        className={cn(
                          "h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors",
                          isActive
                            ? "border-primary bg-primary text-white"
                            : "border-grey bg-white"
                        )}
                      >
                        {isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </span>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!formValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing symptoms...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showSkeleton && (
        <div className="space-y-4 sm:space-y-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="h-5 w-1/3 bg-page rounded-md animate-pulse mb-3" />
                <div className="h-4 w-full bg-page rounded-md animate-pulse mb-2" />
                <div className="h-4 w-5/6 bg-page rounded-md animate-pulse mb-2" />
                <div className="h-4 w-4/6 bg-page rounded-md animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result && !showSkeleton && (
        <div className="space-y-4 sm:space-y-5 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-teal" />
                What you told us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.organized.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy">
                    <CheckCircle2 className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
                {result.organized.duration && result.organized.duration !== "Not specified" && (
                  <li className="flex items-start gap-2 text-sm text-navy pt-1 border-t border-grey mt-2">
                    <CalendarClock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      <span className="font-semibold">Duration:</span> {result.organized.duration}
                    </span>
                  </li>
                )}
                {result.organized.age && (
                  <li className="flex items-start gap-2 text-sm text-navy">
                    <UserCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      <span className="font-semibold">Age:</span> {result.organized.age}
                      {result.organized.gender ? ` · ${result.organized.gender}` : ""}
                    </span>
                  </li>
                )}
                {result.organized.conditions?.length > 0 && (
                  <li className="flex items-start gap-2 text-sm text-navy">
                    <Stethoscope className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Existing conditions:</span>{" "}
                      {result.organized.conditions.join(", ")}
                    </div>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-blue-tint/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Suggested next step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate mb-3">
                Based on what you described, we recommend consulting a:
              </p>
              <div className="mb-4">
                <Badge variant="primary" className="text-base px-4 py-2 font-semibold">
                  {result.suggestedSpecialty}
                </Badge>
              </div>
              <Link to="/book-appointment" onClick={handleBookSpecialist}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Book this specialist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal" />
                Questions your doctor may ask
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.followUpQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-mint-bg text-teal text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Possible care pathway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {result.carePathways.map((cp, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all",
                      cp.recommended
                        ? "border-teal bg-mint-bg"
                        : "border-grey bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          cp.recommended ? "text-teal" : "text-navy"
                        )}
                      >
                        {cp.title}
                      </p>
                      {cp.recommended && (
                        <Badge variant="success" className="text-[10px]">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate leading-relaxed">{cp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AIDisclaimer variant="intake" />
    </div>
  );
}
