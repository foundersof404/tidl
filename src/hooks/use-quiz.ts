import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { validateQuizStep } from "@/lib/quiz-schema";
import { savePrxIntake } from "@/lib/prescribe-rx/browse-api";
import {
  clearQuizState,
  readQuizState,
  writeQuizState,
} from "@/lib/quiz-storage";
import { getGoalFromProduct } from "@/lib/products";
import {
  DEFAULT_QUIZ_DATA,
  QUIZ_TOTAL_STEPS,
  type GoalId,
  type ProductSlug,
  type QuizFormData,
} from "@/types/quiz";

export interface UseQuizOptions {
  noNavigation?: boolean;
  initialStep?: number;
  initialProduct?: ProductSlug;
  initialGoal?: GoalId;
  onStepChange?: (step: number) => void;
}

export function useQuiz(options: UseQuizOptions = {}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<QuizFormData>(DEFAULT_QUIZ_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readQuizState();
    let nextData = { ...DEFAULT_QUIZ_DATA, ...(stored?.data ?? {}) };
    let nextStep = stored?.currentStep ?? 1;

    if (options.initialProduct) {
      nextData.productSlug = options.initialProduct;
      const derivedGoal = getGoalFromProduct(options.initialProduct);
      if (derivedGoal) nextData.goal = derivedGoal;
    }
    if (options.initialGoal) {
      nextData.goal = options.initialGoal;
    }
    if (options.initialStep) {
      nextStep = options.initialStep;
    } else if (stored && !options.initialProduct && !options.initialGoal) {
      nextStep = stored.currentStep;
    }

    setData(nextData);
    setCurrentStep(Math.min(Math.max(nextStep, 1), QUIZ_TOTAL_STEPS));
    setHydrated(true);
  }, [options.initialGoal, options.initialProduct, options.initialStep]);

  useEffect(() => {
    if (!hydrated) return;
    writeQuizState({ currentStep, data });
  }, [currentStep, data, hydrated]);

  const intakeSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (intakeSyncRef.current) clearTimeout(intakeSyncRef.current);
    intakeSyncRef.current = setTimeout(() => {
      void savePrxIntake(data, currentStep).catch(() => {
        // Keep local quiz progress even if PRX intake sync is unavailable.
      });
    }, 600);
    return () => {
      if (intakeSyncRef.current) clearTimeout(intakeSyncRef.current);
    };
  }, [currentStep, data, hydrated]);

  const progress = useMemo(
    () => Math.round((currentStep / QUIZ_TOTAL_STEPS) * 100),
    [currentStep],
  );

  const updateData = useCallback((partial: Partial<QuizFormData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      if ("goal" in partial && partial.goal !== prev.goal) {
        next.productSlug = null;
      }
      return next;
    });
    setErrors({});
  }, []);

  const validateCurrent = useCallback(() => {
    const result = validateQuizStep(currentStep, data);
    if (!result.success) {
      setErrors(result.errors);
      return false;
    }
    setErrors({});
    return true;
  }, [currentStep, data]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => {
      const next = Math.max(1, s - 1);
      options.onStepChange?.(next);
      return next;
    });
    setErrors({});
  }, [options]);

  const goNext = useCallback(() => {
    if (!validateCurrent()) return false;
    if (currentStep >= QUIZ_TOTAL_STEPS) return true;
    const next = currentStep + 1;
    setCurrentStep(next);
    setErrors({});
    options.onStepChange?.(next);
    return true;
  }, [currentStep, options, validateCurrent]);

  const goToStep = useCallback(
    (step: number) => {
      const clamped = Math.min(Math.max(step, 1), QUIZ_TOTAL_STEPS);
      setCurrentStep(clamped);
      options.onStepChange?.(clamped);
      setErrors({});
    },
    [options],
  );

  const resetQuiz = useCallback(() => {
    clearQuizState();
    setData(DEFAULT_QUIZ_DATA);
    setCurrentStep(1);
    setErrors({});
    options.onStepChange?.(1);
  }, [options]);

  const completeAndCheckout = useCallback(() => {
    if (!validateQuizStep(8, data).success && currentStep < 8) {
      if (!validateCurrent()) return;
    }
    for (let step = 1; step <= 7; step++) {
      const result = validateQuizStep(step, data);
      if (!result.success) {
        setCurrentStep(step);
        setErrors(result.errors);
        return;
      }
    }
    setCurrentStep(8);
    writeQuizState({ currentStep: 8, data });
    if (!options.noNavigation) {
      navigate({ to: "/checkout" });
    }
  }, [currentStep, data, navigate, options.noNavigation, validateCurrent]);

  return {
    currentStep,
    data,
    errors,
    progress,
    hydrated,
    totalSteps: QUIZ_TOTAL_STEPS,
    updateData,
    goBack,
    goNext,
    goToStep,
    completeAndCheckout,
    resetQuiz,
    validateCurrent,
    canGoBack: currentStep > 1,
  };
}

export type QuizController = ReturnType<typeof useQuiz>;
