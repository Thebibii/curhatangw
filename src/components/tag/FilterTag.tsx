import { useGetTags } from "@/hooks/reactQuery/tags/useGetTags";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import LoadingState from "../state/LoadingState";
import { Skeleton } from "../ui/skeleton";

export default function FilterTag({ search }: { search: string | null }) {
  const router = useRouter();
  const { data, refetch: refetchTag } = useGetTags({
    tag_ids: search?.split(" ") || [],
    tag_names: "",
    isFetch: true,
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          router.push(`/`);
        }}
        size="icon"
      >
        <Icons.XIcon />
      </Button>

      <div className="w-full  no-scrollbar flex gap-2 items-center">
        <LoadingState
          data={data?.data}
          loadingFallback={<Skeleton className="w-32 shadow-shadow h-10" />}
        >
          {data?.data?.map((tag: any, idx: number) => (
            <Button
              onClick={() => {
                const updatedTagFilter = search
                  ?.split(" ")
                  .filter((tagId) => tagId !== tag.name.toString())
                  .join(" ");

                if (!updatedTagFilter?.trim()) {
                  router.push(`/`);
                  refetchTag();
                } else {
                  router.push(`/tag?s=${updatedTagFilter}`);
                  refetchTag();
                }
              }}
              key={idx}
              variant="neutral"
              className="w-max hover:bg-muted cursor-pointer flex items-center gap-4"
            >
              <span>#{tag.name}</span>
              <Icons.XIcon className="w-4 h-4" />
            </Button>
          ))}
        </LoadingState>
      </div>
    </div>
  );
}
