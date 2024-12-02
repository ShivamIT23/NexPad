export default function ButtonTool({
  children,
  onClick
}: {
  children: React.ReactNode,
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="icon-button-medium p-3 bg-transparent border-none rounded-md cursor-pointer hover:bg-neutral-300 transition"
    >
      {children}
    </button>
  );
}