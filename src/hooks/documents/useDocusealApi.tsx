"use client";
import { useState, useCallback } from "react";
import api from "@/lib/httpClient";

export interface DocumentTemplate {
  _id: string;
  assetId: string;
  templateName: string;
  templateType: string;
  provider: string;
  providerTemplateId: string;
  createdAt: string;
  updatedAt: string;
}

export function useDocumentTemplates(assetId?: string) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET all templates for asset
  const fetchTemplates = useCallback(async () => {
    if (!assetId) return;
    try {
      setIsLoading(true);
      const res = await api.get<{ data: DocumentTemplate[] }>(
        `/document-template?assetId=${assetId}`
      );
      setTemplates(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  }, [assetId]);

  // POST new template
  const createTemplate = useCallback(
    async (payload: {
      providerTemplateId: string;
      templateName: string;
      provider?: string;
    }) => {
      if (!assetId) throw new Error("AssetId is required");
      try {
        setIsLoading(true);
        const res = await api.post<{ data: DocumentTemplate }>(
          `/document-template?assetId=${assetId}`,
          {
            ...payload,
            provider: payload.provider || "docuseal",
          }
        );
        setTemplates((prev) => [...prev, res.data.data]);
        setError(null);
        return res.data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create template");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [assetId]
  );

  // PUT update template
  const updateTemplateById = useCallback(
    async (
      templateId: string,
      payload: Partial<Pick<DocumentTemplate, "templateName" | "providerTemplateId">>
    ) => {
      if (!templateId) throw new Error("TemplateId is required");
      try {
        setIsLoading(true);
        const res = await api.put<{ data: DocumentTemplate }>(
          `/document-template/${templateId}`,
          payload
        );
        setTemplates((prev) =>
          prev.map((t) => (t._id === templateId ? res.data.data : t))
        );
        setError(null);
        return res.data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update template");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // DELETE template
  const deleteTemplateById = useCallback(
    async (templateId: string) => {
      if (!templateId) return;
      try {
        setIsLoading(true);
        await api.delete(`/document-template/${templateId}`);
        setTemplates((prev) => prev.filter((t) => t._id !== templateId));
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete template");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplateById,
    deleteTemplateById,
  };
}
