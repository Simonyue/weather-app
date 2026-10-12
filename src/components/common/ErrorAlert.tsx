import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = '天气数据加载失败',
  message,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-500/20 bg-red-950/20 backdrop-blur-xl p-6 text-red-200 shadow-xl shadow-red-950/30 space-y-4"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-white text-base">{title}</h3>
          <p className="text-sm text-red-300/90 leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <div className="flex justify-end pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            isLoading={isRetrying}
            className="border-red-500/30 hover:bg-red-900/30 text-red-200"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            重新加载
          </Button>
        </div>
      )}
    </div>
  );
};
