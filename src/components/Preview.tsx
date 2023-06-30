import { X, FileImage, Info, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Media } from "@/components/MediaUploads/media-types";

type Props = {
  media: { primary_media: Media; secondary_media: Media[] };
  id: string;
  pageType: "artifacts" | "experiences" | "pages";
};

export default function Preview({ media, id, pageType }: Props) {
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<Media>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Media>();

  const handleDeleteMediaItem = async (item: any) => {
    setDeleteDialogOpen(true);
    setEditDialogOpen(false);
    setItemToDelete(item);
  };

  const handleEditMediaItem = async (item: any) => {
    setEditDialogOpen(true);
    setItemToEdit(item);
  };
  return (
    <>
      <div className="mt-2 grid grid-cols-3 gap-10">
        <div key={1}>
          <div className="mt-4 relative flex flex-col p-2 border-2 border-slate-200 bg-slate-200 rounded-md">
            {media && media.primary_media.url && (
              <div className="flex justify-between absolute -top-3 -left-3 -right-3">
                <MoreHorizontal
                  onClick={() => handleEditMediaItem(media.primary_media)}
                  className="w-6 h-6 border border-slate-200 fill-current cursor-pointer bg-white rounded-full"
                />
                <X
                  className="w-6 h-6 border border-slate-200 text-red-500 cursor-pointer p-1 bg-white rounded-full"
                  onClick={() => handleDeleteMediaItem(media.primary_media)}
                />
              </div>
            )}
            <div className="mt-2">
              {(!media || !media?.primary_media?.url) && (
                <div className="mt-8 flex flex-row justify-center space-x-2 items-center">
                  <FileImage size={30} />
                  <p className="w-2/3 items-center">
                    Upload an image to set the primary media.
                  </p>
                </div>
              )}
              {media && media.primary_media.url && (
                <>
                  <img
                    src={media.primary_media.thumbnail}
                    className="aspect-video"
                    width={250}
                    height={150}
                    alt={"file.name"}
                  />
                </>
              )}
            </div>
            <strong className="mt-2 mx-auto">
              Primary Media
              <Tooltip.Provider>
                <Tooltip.Root delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    <Info className="inline ml-1 mb-1" size={16} />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="w-[250px] data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                      sideOffset={5}
                    >
                      <p>
                        This will serve as the thumbnail on related artifacts &
                        experiences. To change it select the edit button on
                        another uploaded image and click the Set as Primary
                        Media.
                      </p>
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </strong>
          </div>
        </div>
        {media &&
          media.secondary_media &&
          media.secondary_media.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                className="mt-4 relative flex flex-col place-content-center p-2 bg-white rounded-md"
              >
                <div className="flex justify-between absolute -top-3 -left-3 -right-3">
                  <MoreHorizontal
                    onClick={() => handleEditMediaItem(item)}
                    className="w-6 h-6 border border-slate-200 fill-current cursor-pointer bg-white rounded-full"
                  />
                  <X
                    className="w-6 h-6 border border-slate-200 text-red-500 cursor-pointer p-1 bg-white rounded-full"
                    onClick={() => handleDeleteMediaItem(item)}
                  />
                </div>
                <img
                  src={item.thumbnail}
                  className="aspect-video"
                  width={250}
                  height={150}
                  alt={item.filename}
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
