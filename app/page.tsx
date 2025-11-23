import FlowBuilder from "@/components/flow/FlowBuilder";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch devices from Supabase
  const { data: devices, error } = await supabase.from("devices").select("*");

  if (error) {
    console.error("Error fetching devices:", error);
  }

  return (
    <main className="h-screen w-full overflow-hidden">
      <FlowBuilder initialDevices={devices || []} />
    </main>
  );
}
