import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTag } from "@/hooks/reactQuery/tags/useCreateTags";
import { useGetTags } from "@/hooks/reactQuery/tags/useGetTags";
import { Tag, TagApiResponse } from "@/types/tag";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  tags: Tag[];
  setTags: (value: React.SetStateAction<Tag[]>) => void;
  tagInput: string;
  setTagInput: (value: React.SetStateAction<string>) => void;
};

export default function InputTags(props: Props) {
  const [openTagSearch, setOpenTagSearch] = useState(false);
  const queryClient = useQueryClient();
  const { data: tagsResponse, isLoading } = useGetTags();
  const filterTags = props.tags.map((tag: Tag) => tag.id);

  const filteredTags = tagsResponse?.data?.filter(
    (tag: Tag) =>
      !filterTags.includes(tag.id) &&
      tag.name.toLowerCase().includes(props.tagInput.toLowerCase())
  );

  const { mutate: createNewTag, isPending } = useCreateTag({
    onSuccess: async ({ data }: { data: Tag }) => {
      setOpenTagSearch(false);
      props.setTagInput("");
      props.setTags((prevTags) => [...prevTags, data]);
      queryClient.invalidateQueries({ queryKey: ["get.tags"] });
      /* const queryKey: QueryKey = ["get.tags"]; // untuk memperbarui cache
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, (oldData: TagApiResponse) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: [...oldData.data, data],
          };
        }
      }); */
    },
  });

  const handleCrateNewTag = () => {
    createNewTag({ name: props.tagInput });
  };
  return (
    <>
      <Popover open={openTagSearch} onOpenChange={setOpenTagSearch}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="neutral"
            className="justify-between gap-4"
            onClick={() => {
              setOpenTagSearch(!openTagSearch);
            }}
          >
            Tambahin Tag (Opsional)
            <Icons.PlusIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full  p-0 border-none">
          <Command className="bg-bw w-full sm:w-[400px] lg:w-[300px] xl:w-[400px]">
            <CommandInput
              value={props.tagInput}
              onValueChange={(searchTag) => {
                const sanitizedTag = searchTag.replace(/\s/g, ""); // Menghapus spasi

                if (!sanitizedTag.includes("#")) {
                  props.setTagInput(sanitizedTag);
                }
              }}
              placeholder="Cari tag..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty className="p-4 ">
                {!isLoading && (
                  <Button
                    onClick={handleCrateNewTag}
                    size="sm"
                    variant="neutral"
                    className="w-full justify-between gap-2"
                    disabled={isPending || !props.tagInput}
                  >
                    {isPending ? "Proses..." : "Bikin tag baru"}
                    <Icons.TagsIcon className="w-4 h-4" />
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup
                className={`${filteredTags?.length === 0 && "p-0"}`}
              >
                {filteredTags?.map((tag: Tag, idx: number) => (
                  <CommandItem
                    value={tag.name}
                    key={idx}
                    onSelect={() => {
                      props.setTags((prevTags) => [...prevTags, tag]);
                      setOpenTagSearch(false);
                    }}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap items-center gap-2 max-w-xs">
        {props.tags.map((tag: Tag, idx: number) => (
          <Button
            key={idx}
            variant="neutral"
            className="justify-between gap-2"
            type="button"
            size={"sm"}
            onClick={() => {
              props.setTags((prevTags) =>
                prevTags.filter((prevTag) => prevTag.id !== tag.id)
              );
            }}
          >
            <span>#{tag.name}</span>
            <Icons.XIcon className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </>
  );
}
