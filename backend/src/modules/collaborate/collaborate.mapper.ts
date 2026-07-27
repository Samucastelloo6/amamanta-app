import type { CollaborateHydratedDocument } from './collaborate.model.js';

export interface CollaborateResponse {
  options: {
    id: string;
    title: string;
    description: string;

    buttonText?: string;
    url?: string;

    extraInfo: string[];

    copyItems: {
      label: string;
      value: string;
      copyText: string;
      buttonText: string;
    }[];
  }[];
}

export function mapCollaborateToResponse(
  collaborate: CollaborateHydratedDocument,
): CollaborateResponse {
  return {
    options: collaborate.options.map((option) => ({
      id: option.id,
      title: option.title,
      description: option.description,

      ...(option.buttonText
        ? {
            buttonText: option.buttonText,
          }
        : {}),

      ...(option.url
        ? {
            url: option.url,
          }
        : {}),

      extraInfo: [...option.extraInfo],

      copyItems: option.copyItems.map((item) => ({
        label: item.label,
        value: item.value,
        copyText: item.copyText,
        buttonText: item.buttonText,
      })),
    })),
  };
}
