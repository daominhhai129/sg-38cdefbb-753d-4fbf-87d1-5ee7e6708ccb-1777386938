import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import Head from "next/head";

export default function OrdersPage() {
  return (
    <>
      <Head><title>Orders</title></Head>
      <DashboardLayout title="Orders" description="Backend migration in progress">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Orders admin is being migrated. Re-prompt this page in a new session for full implementation.</p>
        </Card>
      </DashboardLayout>
    </>
  );
}
