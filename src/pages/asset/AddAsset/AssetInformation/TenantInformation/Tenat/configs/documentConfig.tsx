import { FormFieldConfig } from "@/components/UseForm/ControllerMap";
import { TENANT_TYPE } from "@/constants/global";
import { useFormContext } from "react-hook-form";
import {useParams} from "react-router-dom";

export const documentConfig = (index: number): FormFieldConfig[] => {
  const { control } = useFormContext();
    const { id } = useParams();


  return [
    {
      type: "file",
      name: `tenants.${index}.agreement`,
      control,
      label: "Upload Agreement ",
      fullWidth: true,
      accept: ["PDF", "DOC", "DOCX"],
      meta: {
        refId: id || '',
        belongsTo: 'asset',
        isPublic: true,
      },
    },
    {
      type: "image",
      name: `tenants.${index}.logo`,
      control,
      label: "Upload Logo",
      accept: ["jpg", "jpeg", "png", "webp", "svg"],
      fullWidth: true,
         meta: {
        refId: id || '',
        belongsTo: 'asset',
        isPublic: true,
      },
    },
  ];
};
