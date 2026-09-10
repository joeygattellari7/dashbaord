import { CLIENTS } from "@/lib/clients";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const clients = CLIENTS.map(({ slug, name, platforms }) => ({ slug, name, platforms }));
  return <Dashboard clients={clients} />;
}
