import { format } from "date-fns";
import { getSessionById } from "../../../../actions/getSessions";
import { times } from "../book/time";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

export default async function Success({
  searchParams,
}: {
  searchParams: { sessionId: string };
}) {
  const session = await getSessionById(searchParams.sessionId);
  const date = format(session.date, "MMM d, yyyy");

  // TODO: Handle Time better
  const startTime = times.find(
    (t) => t.value === session.startTime.slice(0, 5),
  );
  const endTime = times.find((t) => t.value === session.endTime.slice(0, 5));

  return (
    <div className="flex flex-col max-w-sm lg:max-w-xl mx-auto gap-4">
      <h1 className="text-2xl font-bold">You're All Set!</h1>
      <div className="flex flex-col gap-6 w-full">
        <h2 className="text-lg font-bold">Session Details</h2>
        <div>
          <h3 className="text-md font-bold">Engineer</h3>
          <p>{session.engineer.displayName}</p>
        </div>
        <div>
          <h3 className="text-md font-bold">Studio</h3>
          <p>{session.studio.displayName}</p>
        </div>
        <div>
          <h3 className="text-md font-bold">Date</h3>
          <p>{date}</p>
        </div>
        <div>
          <h3 className="text-md font-bold">Time</h3>
          <p>
            {startTime?.label} - {endTime?.label}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Link href={`/sessions/book`} className="w-full">
          <Button className="w-full">Book Another Session</Button>
        </Link>
        <Link href={`/account`} className="w-full">
          <Button variant="secondary" className="w-full">
            My Sessions
          </Button>
        </Link>
      </div>
    </div>
  );
}
