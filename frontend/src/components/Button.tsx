export interface ButtonProps {
  callback: () => void;
  variant?: keyof typeof colors;
  text: string;
}

const colors = {
  gray: "border border-gray-500 hover:bg-gray-500 text-gray-900",
  red: "border border-red-500 hover:bg-red-500 text-red-900",
} as const;

export default function Button({
  callback,
  variant = "gray",
  text,
}: ButtonProps) {
  return (
    <button
      className={`bg-transparent px-5 py-3 hover:border-transparent rounded ${colors[variant]}`}
      onClick={callback}
    >
      {text}
    </button>
  );
}
