type Props = {
  className?: string;
  value?: string;
};

export default function LabelFieldGroup({ className = '', value = '' }: Props) {
  return (
    <div className={className}>
      <span>{value}</span>
    </div>
  );
}
