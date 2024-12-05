import { Button } from "@repo/ui/components/ui/button";
import { DatePicker } from "./date-picker";
import { StudioSearch } from "./studio-search";
import { TimePicker } from "./time-picker";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function NewSessionPage() {
  const customer_id = cookies().get("customerId")?.value;
  if (!customer_id) {
    return redirect("/login?redirect=/sessions/book");
  }

  return (
    <div className="max-w-sm lg:max-w- mx-auto">
      <form
        className="flex flex-col gap-4"
        action={async (formData: FormData) => {
          "use server";
          const start = formData.get("start-time");
          const end = formData.get("end-time");
          const date = formData.get("date");
          const studio = formData.get("studio");

          redirect(
            `/sessions/availability?start=${start}&end=${end}&date=${date}&studioId=${studio}`,
          );
        }}
      >
        <StudioSearch name="studio" />
        <DatePicker name="date" />
        <div className="flex flex-col gap-2">
          <label htmlFor="start-time">Start Time</label>
          <TimePicker name="start-time" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="end-time">End Time</label>
          <TimePicker name="end-time" />
        </div>
        <Button type="submit">Check Availability</Button>
      </form>
    </div>
  );
}
