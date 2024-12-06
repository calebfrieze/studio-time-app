import { format } from "date-fns";
import { Session } from "../../../../api/src/entity";
import { getSessionsByUserId as getSessionsByUserId } from "../../../actions/getSessions";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { deleteSessionById } from "../../../actions/deleteSession";
import { getUserById } from "../../../actions/getUsers";
import { revalidatePath } from "next/cache";

export default async function MySessions() {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    return redirect("/login?redirect=/account");
  }

  const user = await getUserById(userId);
  const sessions = await getSessionsByUserId(userId);

  return (
    <div className="flex flex-col gap-4 max-w-sm lg:max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{user.displayName}</h1>
      <form
        action={async () => {
          "use server";
          cookies().delete("userId");
          redirect("/");
        }}
      >
        <Button size="sm" type="submit">
          Logout
        </Button>
      </form>
      <h2 className="text-sm">{user.email}</h2>

      <h3 className="text-lg font-bold">My Sessions</h3>
      <div className="flex flex-col gap-4">
        {sessions ? (
          sessions.map((session: Session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>{session.engineer.displayName}</CardTitle>
                <CardDescription>Start: {session.startTime}</CardDescription>
                <CardDescription>End: {session.endTime}</CardDescription>
                <CardDescription>
                  Studio: {session.studio.displayName}
                </CardDescription>
                <CardDescription>
                  {format(new Date(session.date), "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              {user.userType === "engineer" ? (
                <CardFooter>
                  <form
                    action={async () => {
                      "use server";
                      await deleteSessionById(session.id);

                      revalidatePath("/", "layout");
                    }}
                  >
                    <Button type="submit">Delete</Button>
                  </form>
                </CardFooter>
              ) : null}
            </Card>
          ))
        ) : (
          <p>No sessions</p>
        )}
      </div>
      <Link href="/sessions/book">
        <Button>Book Another Session</Button>
      </Link>
    </div>
  );
}
