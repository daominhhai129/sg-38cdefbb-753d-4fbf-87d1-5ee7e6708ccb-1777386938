import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import Head from "next/head";

export default function ShopInfoPage() {
  return (
    <>
      <Head><title>Shop Info</title></Head>
      <DashboardLayout title="Shop Info" description="Backend migration in progress">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Shop info admin is being migrated. Re-prompt this page in a new session for full implementation.</p>
        </Card>
      </DashboardLayout>
    </>
  );
}
