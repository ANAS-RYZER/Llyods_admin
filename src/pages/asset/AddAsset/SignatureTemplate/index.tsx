import { useNavigate, useParams } from "react-router-dom";
import { Suspense, lazy, memo, useEffect, useState } from "react";
import { ASSET_STEPS_TABS } from "@/constants/global";
import Loading from "@/components/ui/Loading";
const SignatureInvestor = lazy(() => import("./SignatureTable"));
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SignatureDialog from "./SignatureDialog";
import DeleteDialog from "./DeleteDialog";
import { useDocumentTemplates } from "@/hooks/documents/useDocusealApi";

interface Props {
  tab: string;
  step: string;
}

const COMPONENT_MAP = {
  location: (
    <Suspense fallback={<Loading />}>
      <div>Location Component Placeholder</div>
    </Suspense>
  ),
} as const;

const SignatureInvestors = memo(({ tab, step }: Props) => {
  const { id } = useParams<{ id?: string }>();
  const [index, setIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const handleAdd = () => {
    setIndex(-1);
  };
  const isOpen = index !== null;
  const isEdit = index !== -1;

  const onOpenChange = () => {
    const previousValues = index !== null ? fields[index] : {};
    if (index !== null) {
      update(index, previousValues);
    }
    setIndex(null);
  };

  const {
    watch,
    control,
    getValues: formGetValues,
    clearErrors,
    trigger,
  } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "signatureDocuments",
    keyName: "signatureDocuments_id",
  });

  const { templates, isLoading, error, deleteTemplateById, createTemplate, updateTemplateById } =
    useDocumentTemplates(id);

  // Get templates when component mounts


  const onSubmit = async () => {
    try {
      const newTemplate = {
        providerTemplateId: formGetValues(
          "signatureDocuments.providerTemplateId"
        ) as string,
        templateName: formGetValues("signatureDocuments.templateName"),
      };

      // create on backend
      const savedTemplate = await createTemplate(newTemplate);

      // push to fieldArray immediately
      append(savedTemplate);

      setIndex(null);
    } catch (err) {
      console.error("Failed to add template:", err);
    }
  };
  const handleOnDelete = async () => {
  if (deleteIndex !== null) {
    console.log('deleting')
    const values = formGetValues().signatureDocuments[deleteIndex];
    remove(deleteIndex); // remove from form
    await deleteTemplateById(values._id); // remove from backend
    setDeleteIndex(null);
  }
};
const handleOnUpdate = async (index: number, payload: { templateName: string; providerTemplateId: string }) => {
  const values = fields[index];
  await updateTemplateById(values.signatureDocuments_id, payload);
  update(index, { ...values, ...payload }); // update form values
};

  return (
    <Suspense fallback={<div>Location Information...</div>}>
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-lg font-semibold text-black">
          Document For Investors
        </h1>
        <Button type="button" onClick={handleAdd}>
          <span className="text-lg">+</span>
          <span>Investors</span>
        </Button>
      </div>
      <div className="mt-4">
        <SignatureInvestor
          fields={fields}
          actionHandlers={{
            onEdit: (item: any) => {
              const findIndex = fields.findIndex(
                (field) => field.signatureDocuments_id === item.signatureDocuments_id
              );
              setIndex(findIndex);
            },
            onDelete: (item: any) => {
              const findIndex = fields.findIndex(
                (field) => field.signatureDocuments_id === item.signatureDocuments_id
              );
              setDeleteIndex(findIndex);
            },
          }}
          update={update}
        />
      </div>

      <SignatureDialog
        isOpen={isOpen}
        isEdit={isEdit}
        index={index}
        initialValues={index !== null ? fields[index] : null}
        onClose={onOpenChange}
        onSubmit={onSubmit}
      />
      <DeleteDialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onDelete={handleOnDelete}
      />
    </Suspense>
  );
});

SignatureInvestors.displayName = "Investors Signature";

export default SignatureInvestors;
