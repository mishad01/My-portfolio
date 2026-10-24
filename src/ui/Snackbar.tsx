/** M3 snackbar: short message with an optional action. */
export function Snackbar({ message, action }: { message: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div role="status" className="fixed bottom-7 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-4 rounded-xl bg-inverse pr-2 pl-5 text-sm text-on-inverse shadow-[0_4px_12px_rgba(0,0,0,.3)]">
      <span className="py-3">{message}</span>
      {action && (
        <button type="button" onClick={action.onClick} className="flex h-9 items-center rounded-[18px] border-0 bg-transparent px-3 font-semibold text-inverse-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}
