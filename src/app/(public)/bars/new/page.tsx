import { CreateBarForm } from "@/components/forms/create-bar-form";

export default function NewBarPage() {
  return (
    <div className="bg-muted min-h-svh p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <CreateBarForm />
      </div>
    </div>
  );
}
