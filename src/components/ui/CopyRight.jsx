import { clsx } from "clsx";

export function CopyRight({ internal }) {
  return (
    <div
      className={clsx(
        "flex w-full flex-row gap-1 text-sm items-center justify-center",
        internal ? "text-dark-200" : null
      )}
    >
      <span>Copyright © Icog Labs</span>
      <span>{new Date().getFullYear()}</span>
    </div>
  );
}
