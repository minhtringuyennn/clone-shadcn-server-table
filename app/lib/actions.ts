"use server";

import { db } from "~/db/index";
import { tasks, type Task } from "~/db/schema";
import { takeFirstOrThrow } from "~/db/utils";
import { asc, count, eq, inArray, not } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { getErrorMessage } from "~/lib/handle-error";

import type { CreateTaskSchema, UpdateTaskSchema } from "./validations";

export async function createTask(input: CreateTaskSchema) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(tasks)
        .values({
          code: `TASK-${customAlphabet("0123456789", 4)()}`,
          title: input.title,
          status: input.status,
          label: input.label,
          priority: input.priority
        })
        .returning({
          id: tasks.id
        });
    });

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  try {
    await db
      .update(tasks)
      .set({
        title: input.title,
        label: input.label,
        status: input.status,
        priority: input.priority
      })
      .where(eq(tasks.id, input.id));

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function updateTasks(input: {
  ids: string[];
  label?: Task["label"];
  status?: Task["status"];
  priority?: Task["priority"];
}) {
  try {
    await db
      .update(tasks)
      .set({
        label: input.label,
        status: input.status,
        priority: input.priority
      })
      .where(inArray(tasks.id, input.ids));

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function deleteTask(input: { id: string }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(eq(tasks.id, input.id));
    });
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function deleteTasks(input: { ids: string[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(inArray(tasks.id, input.ids));
    });

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function getChunkedTasks(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000;

    const totalTasks = await db
      .select({
        count: count()
      })
      .from(tasks)
      .then(takeFirstOrThrow);

    const totalChunks = Math.ceil(totalTasks.count / chunkSize);

    let chunkedTasks;

    for (let i = 0; i < totalChunks; i++) {
      chunkedTasks = await db
        .select()
        .from(tasks)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((tasks) =>
          tasks.map((task) => ({
            ...task,
            createdAt: task.createdAt.toString(),
            updatedAt: task.updatedAt?.toString()
          }))
        );
    }

    return {
      data: chunkedTasks,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}
