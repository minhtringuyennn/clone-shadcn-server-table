import { type SQL } from "drizzle-orm";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}

export type DrizzleWhere<T> = SQL<unknown> | ((aliases: T) => SQL<T> | undefined) | undefined;

export interface Task {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  label: "bug" | "feature" | "improvement";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}
