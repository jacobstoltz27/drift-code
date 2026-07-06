// Peregrine's mark — a simple, recognizable falcon in flight: sleek body,
// small head, and swept, pointed wings. Filled silhouette, uses currentColor.
export default function Falcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 6c-1 0-1.8.7-2.1 1.7l-1.3 4.6C21.5 8 12.7 5.6 3.5 8.2c8.7 2.2 16.4 6.2 22.6 11.9.9.8 1.6 1.8 2 3l1.1 3.3-3.3-1.4c-1.2-.5-2.5-.7-3.8-.6l-6.5.4 4.6 2.2c1.5.7 2.6 2 3.1 3.6l1.4 4.4c.3 1 1.1 1.7 2.1 1.7h1.5c1 0 1.9-.7 2.1-1.7l1.4-4.4c.5-1.6 1.6-2.9 3.1-3.6l4.6-2.2-6.5-.4c-1.3-.1-2.6.1-3.8.6l-.6.2 1.1-3.3c.4-1.2 1.1-2.2 2-3C44.1 14.4 51.8 10.4 60.5 8.2 51.3 5.6 42.5 8 35.4 12.3l-1.3-4.6C33.8 6.7 33 6 32 6z"
        fillRule="evenodd"
      />
    </svg>
  );
}
