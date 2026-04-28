import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import Head from "next/head";

export default function PostsPage() {
  return (
    <>
      <Head><title>Posts</title></Head>
      <DashboardLayout title="Posts" description="Backend migration in progress">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Posts admin is being migrated. Re-prompt this page in a new session for full implementation.</p>
        </Card>
      </DashboardLayout>
    </>
  );
}
