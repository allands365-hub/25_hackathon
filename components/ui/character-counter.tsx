import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max: number;
  min?: number;
  className?: string;
}

export function CharacterCounter({ 
  current, 
  max, 
  min = 0, 
  className 
}: CharacterCounterProps) {
  const isOverLimit = current > max;
  const isUnderMin = min > 0 && current < min;
  const isNearLimit = current > max * 0.9;
  const isValid = !isOverLimit && !isUnderMin;

  const getStatusColor = () => {
    if (isOverLimit || isUnderMin) return 'text-red-500';
    if (isNearLimit) return 'text-amber-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (isOverLimit) return 'Over limit';
    if (isUnderMin) return `Need ${min - current} more characters`;
    if (isNearLimit) return 'Approaching limit';
    return 'Valid';
  };

  return (
    <div className={cn('flex items-center justify-between text-sm', className)}>
      <span className={getStatusColor()}>
        {current} / {max}
      </span>
      <span className={cn('text-xs', getStatusColor())}>
        {getStatusText()}
      </span>
    </div>
  );
}
