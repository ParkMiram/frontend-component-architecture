export type AlertType = {
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  title: string;
} | null;

export type TopAlertType = {
  open: boolean;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  title: string;
  onClose: () => void;
  duration?: number | null;
};
