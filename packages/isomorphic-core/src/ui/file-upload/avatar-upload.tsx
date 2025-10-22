"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import UploadIcon from "../../components/shape/upload";
import { FieldError, Loader, Text } from "rizzui";
import cn from "../../utils/class-names";
import { PiPencilSimple } from "react-icons/pi";
import { LoadingSpinner } from "../../ui/file-upload/upload-zone";
import { baseApiClient, handleApiError } from "../../../../../apps/isomorphic/src/libs/axios";
import api from "../../../../../apps/isomorphic/src/libs/endpoints";
import { UploadedFile, addToUploadHistory } from "../../utils/upload-history";
import { getCdnUrl } from "../../utils/cdn-url";

interface UploadZoneProps {
  name: string;
  getValues?: any;
  setValue?: any;
  className?: string;
  error?: string;
  category?: string; // File category for backend (default: 'avatar')
  accept?: string; // File types to accept (default: 'image/*')
}

export default function AvatarUpload({
  name,
  error,
  className,
  getValues,
  setValue,
  category = "avatar",
  accept = "image/*",
}: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formValue = getValues(name);

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", filesToUpload[0]);
      formData.append("category", category);

      const response = await baseApiClient.post(api.fileUpload.single, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.data) {
        const uploadedFile: UploadedFile = {
          path: response.data.data.path,
          url: response.data.data.path, // Store path, will be prefixed with CDN when displayed
          size: response.data.data.size,
          mimetype: response.data.data.mimetype,
          originalName: response.data.data.originalName,
          uploadedAt: new Date().toISOString(),
        };

        // Add to history
        addToUploadHistory(uploadedFile);

        // Update form value
        if (setValue) {
          setValue(name, uploadedFile);
        }

        toast.success(
          <Text as="b" className="font-semibold">
            Avatar updated
          </Text>
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      setFiles([]);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newFiles = [
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ];
      setFiles(newFiles);
      handleUpload(newFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: accept === 'image/*' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] }
      : { [accept]: [] },
    maxFiles: 1,
  });

  return (
    <div className={cn("grid gap-5", className)}>
      <div
        className={cn("relative grid h-40 w-40 place-content-center rounded-full border-[1.8px]")}
      >
        {formValue ? (
          <>
            <figure className="absolute inset-0 rounded-full">
              <Image
                fill
                alt="user avatar"
                src={getCdnUrl(formValue?.url)}
                className="rounded-full"
              />
            </figure>
            <div
              {...getRootProps()}
              className={cn("absolute inset-0 grid place-content-center rounded-full bg-black/70")}
            >
              {isUploading ? <LoadingSpinner /> : <PiPencilSimple className="h-5 w-5 text-white" />}

              <input {...getInputProps()} />
            </div>
          </>
        ) : (
          <div
            {...getRootProps()}
            className={cn("absolute inset-0 z-10 grid cursor-pointer place-content-center")}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12" />

            {isUploading ? (
              <Loader
                variant="spinner"
                className="justify-center"
              />
            ) : (
              <Text className="font-medium">Drop or select file</Text>
            )}
          </div>
        )}
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
}
