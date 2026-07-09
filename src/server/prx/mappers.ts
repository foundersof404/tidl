import type { CheckoutFormData } from "@/types/order";
import type { QuizFormData } from "@/types/quiz";
import type { Product } from "@/lib/products";

export type PrxCheckoutBody = {
  quiz: QuizFormData;
  checkout: CheckoutFormData;
  product: Pick<Product, "slug" | "name" | "monthlyPrice" | "dosage" | "goal">;
  idempotencyKey?: string;
};

export function mapQuizToPatientPayload(
  quiz: QuizFormData,
  checkout?: Partial<CheckoutFormData>,
) {
  const heightInchesTotal =
    quiz.heightFeet != null && quiz.heightInches != null
      ? quiz.heightFeet * 12 + quiz.heightInches
      : null;

  return {
    email: quiz.email,
    phone: checkout?.phone || quiz.phone,
    first_name: checkout?.firstName,
    last_name: checkout?.lastName,
    dob: quiz.age != null ? approximateDobFromAge(quiz.age) : undefined,
    sex: quiz.sex,
    height_inches: heightInchesTotal,
    weight_lbs: quiz.weightLbs,
    goal: quiz.goal,
    product_slug: quiz.productSlug,
    health_conditions: quiz.healthConditions,
    taking_medications: quiz.takingMedications,
    has_allergies: quiz.hasAllergies,
    exercise: quiz.exercise,
    sleep: quiz.sleep,
    eating_habits: quiz.eatingHabits,
    used_glp1_before: quiz.usedGlp1Before,
    previous_weight_loss_meds: quiz.previousWeightLossMeds,
    physician_notice_acknowledged: quiz.physicianNoticeAcknowledged,
    shipping: checkout
      ? {
          address_line1: checkout.addressLine1,
          address_line2: checkout.addressLine2 || undefined,
          city: checkout.city,
          state: checkout.state,
          zip: checkout.zip,
        }
      : undefined,
    intake_source: "tidl_quiz",
  };
}

export function mapCheckoutToOrderPayload(
  patient: unknown,
  body: PrxCheckoutBody,
  patientId?: string | number,
) {
  return {
    patient_id: patientId,
    patient,
    product_slug: body.product.slug,
    product_name: body.product.name,
    dosage: body.product.dosage,
    goal: body.product.goal,
    monthly_price: body.product.monthlyPrice,
    payment_method: body.checkout.paymentMethod,
    shipping: {
      first_name: body.checkout.firstName,
      last_name: body.checkout.lastName,
      address_line1: body.checkout.addressLine1,
      address_line2: body.checkout.addressLine2 || undefined,
      city: body.checkout.city,
      state: body.checkout.state,
      zip: body.checkout.zip,
      phone: body.checkout.phone,
    },
    quiz_snapshot: body.quiz,
    source: "tidl_checkout",
  };
}

function approximateDobFromAge(age: number): string {
  const year = new Date().getUTCFullYear() - age;
  return `${year}-01-01`;
}
