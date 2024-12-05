import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { createCustomer } from "../../actions/createCustomer";
import { redirect } from "next/navigation";
import { getCustomersByEmail } from "../../actions/getCustomers";
import { cookies } from "next/headers";

export default function Login({
  searchParams,
}: {
  searchParams: { redirect: string };
}) {
  return (
    <main className="flex flex-col items-center justify-center max-w-sm lg:max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-12 text-center">
        We need a little info to get started
      </h1>
      <form
        className="flex flex-col gap-4 w-full"
        action={async (formData: FormData) => {
          "use server";
          const name = formData.get("name") as string;
          const email = formData.get("email") as string;
          const existingCustomer = (await getCustomersByEmail(email)).find(
            (customer) => customer.id,
          );
          if (existingCustomer) {
            // Prevent duplicate customers
            cookies().set("customerId", existingCustomer.id, {
              path: "/",
              httpOnly: true,
              secure: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
              sameSite: "strict",
            });

            // redirect to the last page
            return redirect(searchParams.redirect || "/");
          }
          const customer = await createCustomer({ name, email });
          // store customer id in cookies
          cookies().set("customerId", customer.id, {
            path: "/",
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            sameSite: "strict",
          });

          return redirect(searchParams.redirect || "/");
        }}
      >
        <label htmlFor="name">Name</label>
        <Input type="text" name="name" placeholder="Name" />
        <label htmlFor="email">Email</label>
        <Input type="email" name="email" placeholder="Email" />
        <Button type="submit">Login</Button>
      </form>
    </main>
  );
}
