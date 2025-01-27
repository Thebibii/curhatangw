import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type UploadImageProps = {
  imageUrl: string | null;
  fileChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFile: (file: File | null) => void;
  setImageUrl: (url: string | null) => void;
  isDisabled: boolean | undefined;
};

export default function UploadImage({
  imageUrl,
  fileChangeHandler,
  setFile,
  setImageUrl,
  isDisabled,
}: UploadImageProps) {
  return (
    <div
      className={`mt-2 bg-bw flex flex-col group  items-center overflow-hidden  justify-center rounded-lg border border-dashed border-border px-6 py-10 text-center relative ${
        imageUrl && `h-80 bg-contain bg-center bg-no-repeat`
      }`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
      tabIndex={0}
    >
      {imageUrl && (
        <div className="absolute inset-0 bg-black/60 hidden transition-all flex items-center group-hover:flex justify-center">
          <Button
            variant="noShadow"
            onClick={() => {
              setFile(null);
              setImageUrl("");
            }}
            disabled={isDisabled}
          >
            Hapus
          </Button>
        </div>
      )}
      <Icons.cloudUpload
        className={`mx-auto mb-8 block size-8 align-middle ${
          imageUrl && "hidden"
        }`}
      />

      <Label
        htmlFor="image"
        className={`absolute mt-4 w-full h-full flex cursor-pointer items-center justify-center text-sm font-semibold leading-6  hover:text-blue-500  ${
          imageUrl && "hidden"
        }`}
      >
        Choose a file for image
      </Label>
      <input
        className="hidden"
        accept="image/*"
        type="file"
        onChange={fileChangeHandler}
        multiple={false}
        id="image"
      />
      <div
        className={`m-0 h-[1.25rem] text-xs leading-5 text-secondaryBlack/70   ${
          imageUrl && "hidden"
        }`}
        data-ut-element="allowed-content"
        data-state="ready"
      >
        Image (4MB)
      </div>
    </div>
  );
}
