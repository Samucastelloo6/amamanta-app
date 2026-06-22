export interface CollaborateCopyItem {
  label: string;
  value: string;
  copyText: string;
  buttonText: string;
}

export interface CollaborateOption {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  url?: string;
  extraInfo?: string[];
  copyItems?: CollaborateCopyItem[];
}
