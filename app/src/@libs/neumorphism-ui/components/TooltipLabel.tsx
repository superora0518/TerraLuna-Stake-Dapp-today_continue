import { ClickAwayListener } from '@material-ui/core';
import { isTouchDevice } from '@libs/is-touch-device';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Label } from './Label';
import { Tooltip, TooltipProps } from './Tooltip';

export interface TooltipLabelProps extends Omit<TooltipProps, 'children'> {
  children: ReactNode;
}

export function TooltipLabel(props: TooltipLabelProps) {
  const touchDevice = useMemo(() => isTouchDevice(), []);

  return touchDevice ? (
    <TouchTooltip {...props} />
  ) : (
    <PointerTooltip {...props} />
  );
}

export function PointerTooltip({
  children,
  title,
  style,
  className,
  placement = 'top',
  ...tooltipProps
}: TooltipLabelProps) {
  return (
      <Label style={style} className={className}>
        {children}
      </Label>
  );
}

export function TouchTooltip({
  children,
  title,
  style,
  className,
  placement = 'top',
  ...tooltipProps
}: TooltipLabelProps) {
  const [open, setOpen] = useState<boolean>(false);

  const tooltipOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const tooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={tooltipClose}>
      <Label style={style} className={className} onClick={tooltipOpen}>
          <span>{children}</span>
      </Label>
    </ClickAwayListener>
  );
}
