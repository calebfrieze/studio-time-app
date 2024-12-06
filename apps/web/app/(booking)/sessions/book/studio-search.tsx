import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { getStudios } from "../../../../actions/getStudios";

export async function StudioSearch({ name }: { name: string }) {
  const studios = await getStudios();

  if (!studios || studios.length === 0) {
    return <p>No studios found</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="studio">
        Studio
      </label>
      <Select name={name}>
        <SelectTrigger>
          <SelectValue id="studio" placeholder="Select a studio" />
        </SelectTrigger>
        <SelectContent>
          {studios.map((studio) => (
            <SelectItem key={studio.id} value={studio.id}>
              {studio.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
