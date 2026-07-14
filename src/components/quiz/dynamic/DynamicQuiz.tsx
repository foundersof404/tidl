import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchPrxEncounterTypeSchema,
  fetchPrxEncounterTypes,
  prxStatusLabel,
  submitPrxDynamicIntake,
  type PrxDynamicIntakeResult,
  type PrxEncounterTypeSchema,
  type PrxEncounterTypeSummary,
  type PrxSchemaField,
  type PrxSchemaStep,
} from "@/lib/prescribe-rx";
import { usePrxEncounterStatus } from "@/hooks/use-prx-encounter-status";
import "../quiz.css";
import "./dynamic-quiz.css";

/** PRX field-type ids (from GET /telehealth/encounter-types/{id}/schema). */
const FIELD_TYPE = {
  TEXT: 1,
  EMAIL: 2,
  PHONE: 4,
  DATE: 5,
  TEXTAREA: 6,
  DROPDOWN: 10,
  RADIO_GROUP: 12,
  RADIO_STYLED: 13,
  YES_NO: 16,
  TOGGLE_GROUP: 17,
  FILE: 21,
  ALLERGY_SEARCH: 30,
  MEDICATION_SEARCH: 31,
  CONDITION_SEARCH: 32,
  HEIGHT: 40,
  WEIGHT: 41,
  BMI: 42,
  ADDRESS: 44,
} as const;

/** Only these step types collect patient answers (form + Q&A). The rest are
 * product selection, consent, checkout, identity, and provider/staff stages. */
const PATIENT_STEP_TYPES = new Set<number>([1, 2]);

/** Single-choice fields advance automatically once picked — no Continue needed. */
const AUTO_ADVANCE = new Set<number>([
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.RADIO_STYLED,
]);

/** Sentinel meaning "patient reported none" for allergy/medication/condition
 * search fields. Filtered out before submission so it never becomes an entry. */
const NONE_TOKEN = "__none__";

/** "I have none" affordance label per search field type. */
const SEARCH_NONE_LABEL: Record<number, string> = {
  [FIELD_TYPE.ALLERGY_SEARCH]: "No known allergies",
  [FIELD_TYPE.MEDICATION_SEARCH]: "I'm not taking any medications",
  [FIELD_TYPE.CONDITION_SEARCH]: "No medical conditions",
};

type AnswerValue =
  | string
  | number
  | string[]
  | { feet: number | null; inches: number | null }
  | { street: string; city: string; state: string; zip: string };

type Answers = Record<string, AnswerValue | undefined>;

/** A flattened screen: a grouped form step, or one Q&A question at a time. */
type Screen =
  | { kind: "group"; step: PrxSchemaStep }
  | { kind: "single"; step: PrxSchemaStep; field: PrxSchemaField };

function yesNoValues(field: PrxSchemaField) {
  const opts = field.options ?? [];
  const yes =
    opts.find((o) => o.value.toLowerCase() === "yes" || /^y/i.test(o.label))?.value ?? "Yes";
  const no =
    opts.find((o) => o.value.toLowerCase() === "no" || /^n/i.test(o.label))?.value ?? "No";
  return { yes, no };
}

/** Case-insensitive compare that also matches inside array answers (toggle groups). */
function answerMatches(answer: AnswerValue | undefined, showIf: string): boolean {
  const target = showIf.trim().toLowerCase();
  if (Array.isArray(answer)) return answer.some((v) => String(v).trim().toLowerCase() === target);
  if (answer === undefined || answer === null) return false;
  return String(answer).trim().toLowerCase() === target;
}

/** A field is visible unless its `depends_on` condition is unmet. Fail open on
 * unknown operators so we never hide a medical question by mistake. */
function isFieldVisible(field: PrxSchemaField, answers: Answers): boolean {
  const cond = field.depends_on;
  if (!cond) return true;
  const parent = answers[cond.depends_on];
  if (cond.operator === "equals") return answerMatches(parent, cond.show_if);
  return true;
}

function isFieldAnswered(field: PrxSchemaField, value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if ("feet" in value) return value.feet !== null && value.inches !== null;
  if ("street" in value) return Boolean(value.street && value.city && value.state && value.zip);
  return false;
}

function fieldIsComplete(field: PrxSchemaField, answers: Answers): boolean {
  if (!field.is_required || field.field_type === FIELD_TYPE.BMI) return true;
  return isFieldAnswered(field, answers[field.slug]);
}

function stepIsComplete(step: PrxSchemaStep, answers: Answers): boolean {
  return step.fields
    .filter((f) => isFieldVisible(f, answers))
    .every((f) => fieldIsComplete(f, answers));
}

/**
 * Allergy / medication / condition search (PRX field types 30–32). These are
 * always optional in the sandbox, so we offer a clear "None" toggle plus a
 * tag-style entry — nobody has to type "no" to move on. The `maps_to` chart
 * field (allergies/medications/conditions) still comes straight from the schema.
 */
function SearchTagsField({
  field,
  value,
  onChange,
  showHelp,
}: {
  field: PrxSchemaField;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue | undefined) => void;
  showHelp: boolean;
}) {
  const [draft, setDraft] = useState("");
  const raw = Array.isArray(value) ? value : [];
  const noneSelected = raw.includes(NONE_TOKEN);
  const entries = raw.filter((v) => v !== NONE_TOKEN);
  const noneLabel = SEARCH_NONE_LABEL[field.field_type] ?? "None";

  const commit = (text: string) => {
    const parts = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    onChange(Array.from(new Set([...entries, ...parts])));
    setDraft("");
  };

  const removeEntry = (entry: string) => {
    const next = entries.filter((e) => e !== entry);
    onChange(next.length > 0 ? next : undefined);
  };

  const toggleNone = () => {
    setDraft("");
    onChange(noneSelected ? undefined : [NONE_TOKEN]);
  };

  return (
    <div className="mb-5">
      {showHelp && field.help_text ? (
        <span className="mb-2 block text-xs text-[var(--quiz-muted)]">{field.help_text}</span>
      ) : null}

      <button
        type="button"
        className={`dq-none-toggle${noneSelected ? " is-selected" : ""}`}
        onClick={toggleNone}
        aria-pressed={noneSelected}
      >
        <span className="dq-none-check" aria-hidden="true" />
        {noneLabel}
      </button>

      {!noneSelected ? (
        <div className="dq-tagfield">
          {entries.length > 0 ? (
            <div className="dq-tags">
              {entries.map((entry) => (
                <span key={entry} className="dq-tag">
                  {entry}
                  <button
                    type="button"
                    onClick={() => removeEntry(entry)}
                    aria-label={`Remove ${entry}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <input
            className="tidl-input"
            placeholder={field.placeholder ?? "Type one and press Enter"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                commit(draft);
              } else if (e.key === "Backspace" && draft === "" && entries.length > 0) {
                removeEntry(entries[entries.length - 1]);
              }
            }}
            onBlur={() => commit(draft)}
          />
        </div>
      ) : null}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  hideLabel = false,
}: {
  field: PrxSchemaField;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue | undefined) => void;
  hideLabel?: boolean;
}) {
  const label = hideLabel ? null : (
    <span className="mb-1.5 block text-sm font-medium">
      {field.label}
      {field.is_required ? <span className="dq-req"> *</span> : null}
    </span>
  );
  const hint =
    !hideLabel && field.help_text ? (
      <span className="mb-2 block text-xs text-[var(--quiz-muted)]">{field.help_text}</span>
    ) : null;

  switch (field.field_type) {
    case FIELD_TYPE.TEXTAREA:
      return (
        <label className="mb-5 block">
          {label}
          {hint}
          <textarea
            className="tidl-input"
            rows={4}
            placeholder={field.placeholder ?? ""}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );

    case FIELD_TYPE.DROPDOWN:
      return (
        <label className="mb-5 block">
          {label}
          {hint}
          <select
            className="tidl-input"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value || undefined)}
          >
            <option value="">{field.placeholder ?? "Select…"}</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      );

    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.RADIO_STYLED:
      return (
        <div className="mb-5">
          {label}
          {hint}
          <div className="grid gap-2">
            {(field.options ?? []).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`quiz-option-card w-full${value === opt.value ? " is-selected" : ""}`}
                onClick={() => onChange(opt.value)}
              >
                <span className="quiz-option-card-label">{opt.label}</span>
                <span className="quiz-option-radio" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      );

    case FIELD_TYPE.YES_NO: {
      const { yes, no } = yesNoValues(field);
      return (
        <div className="mb-5">
          {label}
          {hint}
          <div className="flex gap-2">
            <button
              type="button"
              className={`quiz-yesno-btn${value === yes ? " is-selected" : ""}`}
              onClick={() => onChange(yes)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`quiz-yesno-btn${value === no ? " is-selected" : ""}`}
              onClick={() => onChange(no)}
            >
              No
            </button>
          </div>
        </div>
      );
    }

    case FIELD_TYPE.TOGGLE_GROUP: {
      const selected = Array.isArray(value) ? value : [];
      const toggle = (onValue: string) => {
        onChange(
          selected.includes(onValue)
            ? selected.filter((v) => v !== onValue)
            : [...selected, onValue],
        );
      };
      return (
        <div className="mb-5">
          {label}
          {hint}
          <div className="grid gap-2">
            {(field.options ?? []).map((opt) => {
              const onValue = opt.on_value ?? opt.value;
              const active = selected.includes(onValue);
              return (
                <button
                  key={onValue}
                  type="button"
                  className={`quiz-option-card w-full${active ? " is-selected" : ""}`}
                  onClick={() => toggle(onValue)}
                >
                  <span className="quiz-option-card-label">{opt.label}</span>
                  <span className="quiz-option-radio" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case FIELD_TYPE.HEIGHT: {
      const h =
        value && typeof value === "object" && "feet" in value
          ? value
          : { feet: null, inches: null };
      return (
        <div className="mb-5">
          {label}
          {hint}
          <div className="flex gap-2">
            <input
              className="tidl-input"
              type="number"
              inputMode="numeric"
              placeholder="ft"
              value={h.feet ?? ""}
              onChange={(e) =>
                onChange({
                  feet: e.target.value === "" ? null : Number(e.target.value),
                  inches: h.inches,
                })
              }
            />
            <input
              className="tidl-input"
              type="number"
              inputMode="numeric"
              placeholder="in"
              value={h.inches ?? ""}
              onChange={(e) =>
                onChange({
                  feet: h.feet,
                  inches: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      );
    }

    case FIELD_TYPE.WEIGHT:
      return (
        <label className="mb-5 block">
          {label}
          {hint}
          <input
            className="tidl-input"
            type="number"
            inputMode="numeric"
            placeholder="lbs"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </label>
      );

    case FIELD_TYPE.BMI:
      return (
        <div className="mb-5 rounded-2xl border border-dashed border-[var(--quiz-border)] p-3 text-xs text-[var(--quiz-muted)]">
          {field.label} — calculated automatically from height and weight.
        </div>
      );

    case FIELD_TYPE.ADDRESS: {
      const a =
        value && typeof value === "object" && "street" in value
          ? value
          : { street: "", city: "", state: "", zip: "" };
      const set = (patch: Partial<typeof a>) => onChange({ ...a, ...patch });
      return (
        <div className="mb-5">
          {label}
          {hint}
          <div className="grid gap-2">
            <input
              className="tidl-input"
              placeholder="Street address"
              value={a.street}
              onChange={(e) => set({ street: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                className="tidl-input"
                placeholder="City"
                value={a.city}
                onChange={(e) => set({ city: e.target.value })}
              />
              <input
                className="tidl-input"
                placeholder="State"
                value={a.state}
                onChange={(e) => set({ state: e.target.value })}
              />
              <input
                className="tidl-input"
                placeholder="ZIP"
                value={a.zip}
                onChange={(e) => set({ zip: e.target.value })}
              />
            </div>
          </div>
        </div>
      );
    }

    case FIELD_TYPE.ALLERGY_SEARCH:
    case FIELD_TYPE.MEDICATION_SEARCH:
    case FIELD_TYPE.CONDITION_SEARCH:
      return (
        <div>
          {label}
          <SearchTagsField
            field={field}
            value={value}
            onChange={onChange}
            showHelp={!hideLabel}
          />
        </div>
      );

    case FIELD_TYPE.EMAIL:
    case FIELD_TYPE.PHONE:
    case FIELD_TYPE.DATE:
    case FIELD_TYPE.TEXT:
    default: {
      const inputType =
        field.field_type === FIELD_TYPE.EMAIL
          ? "email"
          : field.field_type === FIELD_TYPE.PHONE
            ? "tel"
            : field.field_type === FIELD_TYPE.DATE
              ? "date"
              : "text";
      return (
        <label className="mb-5 block">
          {label}
          {hint}
          <input
            className="tidl-input"
            type={inputType}
            placeholder={field.placeholder ?? ""}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );
    }
  }
}

export function DynamicQuiz({
  initialSlug,
  onClose,
}: {
  initialSlug?: string;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<PrxEncounterTypeSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [schema, setSchema] = useState<PrxEncounterTypeSchema | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [screenIndex, setScreenIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<PrxDynamicIntakeResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { encounter: liveEncounter } = usePrxEncounterStatus(submitResult?.encounterId ?? null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setTypesLoading(true);
        const list = await fetchPrxEncounterTypes();
        if (cancelled) return;
        setTypes(list.data);
        if (initialSlug) {
          const match = list.data.find((t) => t.slug === initialSlug);
          if (match) setSelectedId(match.id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load encounter types");
        }
      } finally {
        if (!cancelled) setTypesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialSlug]);

  useEffect(() => {
    if (!selectedId) {
      setSchema(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setAnswers({});
        setScreenIndex(0);
        setDone(false);
        setSubmitResult(null);
        setSubmitError(null);
        const res = await fetchPrxEncounterTypeSchema(selectedId);
        if (cancelled) return;
        setSchema(res.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load schema");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  // Slide the sheet up from the bottom on mount.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Close the assessment picker on outside click / Escape.
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  const screens = useMemo<Screen[]>(() => {
    const patientSteps = (schema?.steps ?? [])
      .filter((s) => PATIENT_STEP_TYPES.has(s.step_type) && s.fields.length > 0)
      .sort((a, b) => a.display_order - b.display_order);

    const out: Screen[] = [];
    for (const step of patientSteps) {
      if (step.step_type === 2) {
        // Q&A: one screen per question, skipping conditional follow-ups whose
        // gating answer isn't satisfied yet.
        for (const field of step.fields) {
          if (isFieldVisible(field, answers)) out.push({ kind: "single", step, field });
        }
      } else if (step.fields.some((f) => isFieldVisible(f, answers))) {
        out.push({ kind: "group", step });
      }
    }
    return out;
  }, [schema, answers]);

  const screen = screens[screenIndex];
  const progress = screens.length ? ((screenIndex + 1) / screens.length) * 100 : 0;

  // If a conditional question disappears and leaves us past the end, clamp back.
  useEffect(() => {
    if (!done && screens.length > 0 && screenIndex > screens.length - 1) {
      setScreenIndex(screens.length - 1);
    }
  }, [screens.length, screenIndex, done]);

  const goNext = () => {
    setScreenIndex((i) => {
      if (i < screens.length - 1) return i + 1;
      setDone(true);
      return i;
    });
  };

  const goBack = () => {
    if (screenIndex === 0) {
      setSelectedId(null);
      return;
    }
    setScreenIndex((i) => Math.max(0, i - 1));
  };

  const setValue = (slug: string, value: AnswerValue | undefined) =>
    setAnswers((prev) => ({ ...prev, [slug]: value }));

  const handleSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Drop answers for fields hidden by an unmet condition (e.g. alcohol
      // frequency when the patient said they don't drink).
      const fieldBySlug = new Map<string, PrxSchemaField>();
      for (const step of schema?.steps ?? []) {
        for (const field of step.fields) fieldBySlug.set(field.slug, field);
      }
      const visibleAnswers: Answers = {};
      for (const [slug, value] of Object.entries(answers)) {
        const field = fieldBySlug.get(slug);
        if (!field || isFieldVisible(field, answers)) visibleAnswers[slug] = value;
      }
      const result = await submitPrxDynamicIntake(selectedId, visibleAnswers);
      setSubmitResult(result);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit intake");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSingleChange = (field: PrxSchemaField, value: AnswerValue | undefined) => {
    setValue(field.slug, value);
    if (AUTO_ADVANCE.has(field.field_type) && value !== undefined) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(goNext, 240);
    }
  };

  const needsContinue =
    screen?.kind === "group" || (screen?.kind === "single" && !AUTO_ADVANCE.has(screen.field.field_type));

  const canContinue =
    screen?.kind === "group"
      ? stepIsComplete(screen.step, answers)
      : screen?.kind === "single"
        ? fieldIsComplete(screen.field, answers)
        : false;

  const showQuiz = Boolean(selectedId) && !loading && !error && !done && screen;
  // Encounter type has no patient-facing questions configured in PRX.
  const isEmptySchema =
    Boolean(selectedId) && !loading && !error && !done && Boolean(schema) && screens.length === 0;
  const canGoBack = Boolean(selectedId) && !loading && !error;

  const handleBack = () => {
    if (done) {
      setDone(false);
      return;
    }
    goBack();
  };

  // Slide the sheet back down, then let the parent unmount / navigate.
  const requestClose = () => {
    if (!onClose) return;
    setOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`quiz-modal-backdrop${open ? " is-open" : ""}`}
        onClick={requestClose}
        aria-hidden={!open}
      />
      <div className={`quiz-modal-stage${open ? " is-open" : ""}`}>
        <div
          className={`quiz-modal-sheet quiz-root${open ? " is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Assessment"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {onClose ? (
            <button
              type="button"
              className="quiz-modal-close-fab"
              onClick={requestClose}
              aria-label="Close assessment"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}

          <div className="quiz-modal-progress">
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${showQuiz ? progress : done ? 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="quiz-modal-header">
            <button
              type="button"
              className="quiz-modal-header-btn"
              onClick={canGoBack ? handleBack : undefined}
              disabled={!canGoBack}
              aria-label={canGoBack ? "Go back" : undefined}
            >
              {canGoBack ? (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : null}
            </button>
            <span className="quiz-modal-step-counter dq-counter">
              {showQuiz ? (
                <>
                  <b>{String(screenIndex + 1).padStart(2, "0")}</b> /{" "}
                  {String(screens.length).padStart(2, "0")}
                </>
              ) : null}
            </span>
            <span className="quiz-modal-header-spacer" aria-hidden="true" />
          </div>

          <div className="quiz-modal-content">
            {/* Intro — choose an assessment (dropdown starts empty) */}
            {!selectedId && !error ? (
              <div className="dq-intro dq-screen">
                <span className="dq-kicker">TIDL Assessment</span>
                <h1 className="dq-title">Which assessment would you like to start?</h1>
                <p className="dq-lead">
                  Pick a program below. The questions are pulled live from your clinical intake so
                  they always stay in sync.
                </p>
                <div className="dq-select-wrap" ref={pickerRef}>
                  <button
                    type="button"
                    className="dq-select-btn"
                    disabled={typesLoading}
                    aria-haspopup="listbox"
                    aria-expanded={pickerOpen}
                    onClick={() => setPickerOpen((o) => !o)}
                  >
                    <span className="dq-placeholder">
                      {typesLoading ? "Loading assessments…" : "Select an assessment…"}
                    </span>
                    <span className={`dq-chevron${pickerOpen ? " is-open" : ""}`} aria-hidden="true" />
                  </button>
                  {pickerOpen ? (
                    <ul className="dq-menu" role="listbox">
                      {types.map((t) => (
                        <li key={t.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selectedId === t.id}
                            className="dq-option"
                            onClick={() => {
                              setSelectedId(t.id);
                              setPickerOpen(false);
                            }}
                          >
                            {t.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ) : null}

            {loading ? (
              <p className="text-sm text-[var(--quiz-muted)]">Loading questions…</p>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {/* Finish */}
            {selectedId && !loading && !error && done ? (
              <div className="dq-screen">
                {submitResult ? (
                  <>
                    <span className="dq-done-badge">Encounter created</span>
                    <h2 className="dq-title">Sent to PrescribeRx</h2>
                    <p className="dq-lead mt-1">
                      Your answers created a patient and encounter in the sandbox.
                    </p>
                    <div className="dq-result">
                      <div className="dq-result-row">
                        <span>Encounter</span>
                        <b>{submitResult.encounterNumber ?? submitResult.encounterId ?? "—"}</b>
                      </div>
                      <div className="dq-result-row">
                        <span>Patient</span>
                        <b>{submitResult.patientNumber ?? "—"}</b>
                      </div>
                      {liveEncounter ? (
                        <div className="dq-result-row">
                          <span>Live status</span>
                          <b className="dq-live-status">
                            <span className="dq-live-dot" aria-hidden="true" />
                            {prxStatusLabel(liveEncounter)}
                          </b>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="dq-done-badge">Assessment complete</span>
                    <h2 className="dq-title">You're all set</h2>
                    <p className="dq-lead mt-1">
                      Collected {Object.keys(answers).length} answers, keyed by field slug. Submit to
                      create the patient and encounter in PrescribeRx.
                    </p>
                    {submitError ? (
                      <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {submitError}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="tidl-btn mt-4 w-full"
                      disabled={submitting}
                      style={{ opacity: submitting ? 0.6 : 1 }}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Submitting…" : "Submit to PrescribeRx"}
                    </button>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs text-[var(--quiz-muted)]">
                        View collected answers
                      </summary>
                      <pre className="dq-answers">{JSON.stringify(answers, null, 2)}</pre>
                    </details>
                  </>
                )}
              </div>
            ) : null}

            {/* Grouped form step */}
            {showQuiz && screen.kind === "group" ? (
              <div className="dq-screen" key={`g-${screenIndex}`}>
                <h2 className="dq-question">{screen.step.step_name}</h2>
                {screen.step.step_description ? (
                  <p className="dq-help">{screen.step.step_description}</p>
                ) : null}
                {screen.step.fields
                  .filter((field) => isFieldVisible(field, answers))
                  .map((field) => (
                    <FieldRenderer
                      key={field.slug}
                      field={field}
                      value={answers[field.slug]}
                      onChange={(v) => setValue(field.slug, v)}
                    />
                  ))}
              </div>
            ) : null}

            {/* Single question */}
            {showQuiz && screen.kind === "single" ? (
              <div className="dq-screen" key={`s-${screenIndex}`}>
                <h2 className="dq-question">
                  {screen.field.label}
                  {screen.field.is_required ? <span className="dq-req"> *</span> : null}
                </h2>
                {screen.field.help_text ? <p className="dq-help">{screen.field.help_text}</p> : null}
                <FieldRenderer
                  field={screen.field}
                  value={answers[screen.field.slug]}
                  onChange={(v) => handleSingleChange(screen.field, v)}
                  hideLabel
                />
              </div>
            ) : null}

            {/* Empty schema — no patient-facing questions configured in PRX */}
            {isEmptySchema ? (
              <div className="dq-screen dq-empty">
                <span className="dq-empty-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 8v5m0 3h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2 className="dq-title">No questions yet</h2>
                <p className="dq-lead mt-1">
                  This assessment doesn't have any intake questions set up in PrescribeRx yet, so
                  there's nothing to fill out. Pick a different program to continue.
                </p>
                <button
                  type="button"
                  className="tidl-btn mt-5 w-full"
                  onClick={() => setSelectedId(null)}
                >
                  Choose another assessment
                </button>
              </div>
            ) : null}
          </div>

          {showQuiz && needsContinue ? (
            <div className="quiz-modal-footer">
              <button
                type="button"
                className="tidl-btn w-full"
                disabled={!canContinue}
                style={{ opacity: canContinue ? 1 : 0.5 }}
                onClick={goNext}
              >
                {screenIndex < screens.length - 1 ? "Continue" : "Finish"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
