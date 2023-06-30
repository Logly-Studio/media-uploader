import Preview from "./components/Preview";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { Media } from "@/components/MediaUploads/media-types";

interface Props {
  id: string;
  media: { primary_media: any; secondary_media: any };
}

export default function MediaUploads({ media }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<any[] | null>(
    media?.primary_media ? [media.primary_media] : null
  );
  // This function is called when the user taps the edit button, it opens the editor and returns the modified file when done
  const editImage = (image: any, done: any) => {
    const imageFile = image.pintura ? image.pintura.file : image;
    const imageState = image.pintura ? image.pintura.data : {};

    const editor = openDefaultEditor({
      src: imageFile,
      imageState,
      enableUtils: false,
      // Enforce widescreen 16:9 aspect ratio
      imageCropAspectRatio: 16 / 9,
    });

    editor.on("close", () => {});

    editor.on("process", ({ dest, imageState }) => {
      Object.assign(dest, {
        pintura: { file: imageFile, data: imageState },
      });
      done(dest);
    });
  };

  // step 1: upload files to dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/*", "video/*"],
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      const videos = acceptedFiles.filter((file) =>
        file.type.includes("video")
      );
      const images = acceptedFiles.filter((file) =>
        file.type.includes("image")
      );

      const fileToEdit = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (videos.length > 0) {
        videos.map((video) => handleFileUpload(video));
      }

      if (images.length > 0) {
        editImage(fileToEdit[0], (output: never) => {
          // revoke preview URL for old image
          if (fileToEdit[0].preview) URL.revokeObjectURL(fileToEdit[0].preview);

          // set new preview URL
          Object.assign(output, {
            preview: URL.createObjectURL(output),
          });
          handleFileUpload(output);
        });
      }
    },
  });

  useEffect(() => {
    uploadedMedia &&
      uploadedMedia.forEach((file: any) => URL.revokeObjectURL(file.url));
  }, [uploadedMedia]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    // First pass the file to cloudinary
    await Promise.resolve(processCloudinaryFile(file)).then(
      async (response: any) => {
        if (!response) return "error";

        let primary_media = media ? media.primary_media : {};
        let secondary_media = media ? media.secondary_media : [];

        if (
          response.type === "image" &&
          (!primary_media || Object.entries(primary_media).length === 0)
        ) {
          primary_media = { ...response };
        } else {
          secondary_media.push({ ...response });
        }

        const uploaded_media = { primary_media, secondary_media };

        if (error) {
          setUploading(false);
        }
        if (data) {
        }
        setUploading(false);

        setUploadedMedia([
          {
            ...response,
          },
        ]);
      }
    );
  };

  return (
    <div>
      <label
        className="text-lg font-bold mb-1 flex flex-col lg:flex-row lg:justify-between"
        htmlFor="altText"
      >
        Media Uploads
      </label>
      <p>
        Your primary media upload will be the thumbnail and first image that
        represents this artifact or experience in your guides. It is outlined in
        yellow, and you set a new primary media at any time.
      </p>

      <div className="flex flex-col">
        <div
          {...getRootProps({
            className: "dropzone bg-white my-8 rounded-md relative h-40",
          })}
        >
          <div className="flex justify-center absolute top-1 bottom-1 left-1 right-1 items-center border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  {!uploading ? (
                    <>
                      <span className="text-base font-bold">
                        <strong className="underline">Click to upload</strong>{" "}
                        or drag & drop files here.
                      </span>
                      <input {...getInputProps()} className="sr-only" />
                    </>
                  ) : (
                    <span className="text-base font-bold">Uploading...</span>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500">
                video & images supported. PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <Preview media={media} />
      </div>
    </div>
  );
}
