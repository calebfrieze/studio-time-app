import { Button } from "@repo/ui/components/ui/button";
import { Logo } from "@repo/ui/components/logo";
import Link from "next/link";
import { cookies } from "next/headers";

export default function Page() {
  const customer_id = cookies().get("customerId")?.value;
  return (
    <main>
      <div className="flex flex-col justify-around items-center py-48 gap-12">
        <div className="flex flex-col items-center gap-6">
          <div className="size-32">
            <Logo />
          </div>
          <h1 className="brand text-6xl">STUDIO TIME</h1>
          <p className="px-6 text-center">
            Book your next studio session with the top engineers of the nation
          </p>
        </div>
        <div>
          {customer_id ? (
            <Link href="/sessions/book">
              <Button size={"lg"}>Book Now</Button>
            </Link>
          ) : (
            <Link href="/login?redirect=/sessions/book">
              <Button size={"lg"}>Login to Book Now</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
