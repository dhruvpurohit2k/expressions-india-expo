import { z } from "zod";

const RegistrationSchema = z.object({
  name: z.string(),
  institution: z.string(),
  mobile: z.string(),
  email: z.string(),
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

export async function submitRegistration(
  data: RegistrationData
): Promise<void> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/enquiry`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.mobile,
        subject: `Registration - ${data.institution}`,
        message: `Registration submitted from ${data.institution}`,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Registration failed");
  }
}
