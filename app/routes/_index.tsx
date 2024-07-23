// app/routes/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import { tasks } from "~/db/schema";
import { Task } from "~/types";
import { Suspense } from "react";
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton";
import { Shell } from "~/components/shell";
import { TasksTable } from "~/components/tasks-table";
import { TasksTableProvider } from "~/components/tasks-table-provider";

export const loader: LoaderFunction = async () => {
  const data = await db.select().from(tasks).execute();
  return data as unknown as Task[];
};

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  const tasks = useLoaderData<Task[]>();

  console.log("tasks", tasks);

  return (
    <Shell className="gap-2">
      <TasksTableProvider>
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <TasksTable data={tasks} pageCount={0} />
        </Suspense>
      </TasksTableProvider>
    </Shell>
  );
}
