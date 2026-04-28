import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import Head from "next/head";

export default function CategoriesPage() {
  return (
    <>
      <Head><title>Categories</title></Head>
      <DashboardLayout title="Categories" description="Backend migration in progress">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Categories admin is being migrated. Re-prompt this page in a new session for full implementation.</p>
        </Card>
      </DashboardLayout>
    </>
  );
}
