import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSession } from "../../../../actions/createSession";
import { getEngineersByAvailability } from "../../../../actions/getEngineers";
import { getStudios } from "../../../../actions/getStudios";
import { times } from "../book/time";
import { cookies } from "next/headers";
import { Button } from "@repo/ui/components/ui/button";

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: { start: string; end: string; date: string; studioId: string };
}) {
  if (
    !searchParams.studioId ||
    !searchParams.start ||
    !searchParams.end ||
    !searchParams.date
  ) {
    return <div className="text-red-500">Invalid booking info</div>;
  }

  const studios = await getStudios();
  const studio = studios.find((s) => s.id === searchParams.studioId);

  const engineers = await getEngineersByAvailability({
    start: searchParams.start,
    end: searchParams.end,
    date: searchParams.date,
    studioId: searchParams.studioId,
  }).catch(e => console.error(e.cause));

  const start = times.find((time) => time.value === searchParams.start)?.label;
  const end = times.find((time) => time.value === searchParams.end)?.label;
  const date = `${format(new Date(searchParams.date), "MM/dd/yyyy")} `;

  const userId = cookies().get("userId")?.value;

  if (!userId) {
    return redirect("/login?redirect=/sessions/availability");
  }

  return (
    <div className="flex flex-col w-full p-6 items-center justify-between gap-4 lg:max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-12">
        Available Engineers at {studio?.displayName}
      </h1>
      <Link
        href={`/sessions/book?date=${searchParams.date}`}
        className="flex justify-between gap-12"
      >
        <p>{date}</p>{" "}
        <p>
          {start} - {end}
        </p>
      </Link>
      {engineers && engineers.length > 0 ? (
        engineers.map((engineer) => (
          <form
            key={engineer.id}
            className="w-full"
            action={async () => {
              "use server";
              const userId = cookies().get("userId")?.value;
              if (!userId) {
                return redirect("/login?redirect=/sessions/availability");
              }

              const created = await createSession({
                start: searchParams.start,
                end: searchParams.end,
                date: searchParams.date,
                engineerId: engineer.id,
                studioId: searchParams.studioId,
                customerId: userId,
              });

              redirect(`/sessions/success?sessionId=${created.id}`);
            }}
          >
            <Card className="hover:bg-gray-100">
              <button type="submit" className="text-left">
                <CardHeader>
                  <CardTitle>{engineer.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <p>
                      {engineer.studios.map((s) => s.displayName).join(", ")}
                    </p>
                    <p>{engineer.email}</p>
                  </CardDescription>
                </CardContent>
              </button>
            </Card>
          </form>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p>No engineers available</p>
          <Link href="/sessions/book">
            <Button>Go Back</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
