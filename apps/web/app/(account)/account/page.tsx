import { format } from "date-fns";
import { Session } from "../../../../api/src/entity";
import { getCustomerById } from "../../../actions/getCustomers";
import { getSessionsByCustomerId } from "../../../actions/getSessions";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

export default async function MySessions() {
  const customer_id = cookies().get("customerId")?.value;
  if (!customer_id) {
    return redirect("/login?redirect=/account");
  }
  const customer = await getCustomerById(customer_id);
  const sessions = await getSessionsByCustomerId(customer_id);

  return (
    <div className="flex flex-col gap-4 max-w-sm lg:max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{customer.displayName}</h1>
      <form
        action={async () => {
          "use server";
          cookies().delete("customerId");
          redirect("/");
        }}
      >
        <Button size="sm" type="submit">
          Logout
        </Button>
      </form>
      <h2 className="text-sm">{customer.email}</h2>

      <h3 className="text-lg font-bold">My Sessions</h3>
      <div className="flex flex-col gap-4">
        {sessions.map((session: Session) => (
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
          </Card>
        ))}
      </div>
      <Link href="/sessions/book">
        <Button>Book Another Session</Button>
      </Link>
    </div>
  );
}
