/**
 * Text monogram for an operator. Deliberately not the operator's logo —
 * swap in official logos from the recharge provider's brand kit if allowed.
 */
export default function OperatorBadge({ operator, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs rounded-lg",
    md: "h-11 w-11 text-sm rounded-xl",
    lg: "h-14 w-14 text-base rounded-2xl",
  };
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center font-display font-bold ${operator.accent.bg} ${operator.accent.text} ${sizes[size]} ${className}`}
    >
      {operator.short}
    </span>
  );
}
