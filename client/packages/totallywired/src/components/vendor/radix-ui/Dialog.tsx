import * as RDialog from "@radix-ui/react-dialog";
import "./Dialog.css";

type DialogProps = React.PropsWithChildren & {
  open?: boolean;
  className?: string;
};

export function Dialog({ children, open, className }: DialogProps) {
  return (
    <RDialog.Root open={open}>
      <RDialog.Portal>
        <RDialog.Content className={`DialogContent ${className}`}>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
