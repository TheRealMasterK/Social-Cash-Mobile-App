export const notNull = <T>(obj: T | null | undefined): obj is T => obj != null;
