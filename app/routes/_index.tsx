import { MetaFunction } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import { tasks } from "~/db/schema";

import { Task } from "~/types";

export const loader: LoaderFunction = async () => {
  const data = await db.select().from(tasks).execute();
  return data;
};

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  const data = useLoaderData<Task[]>();

  return (
    <div className="font-sans p-4">
      <h1 className="font-bold text-5xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {data.map((task) => (
          <li key={task.id}>
            <span>
              {task.code}: {task.title} ({task.status})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
