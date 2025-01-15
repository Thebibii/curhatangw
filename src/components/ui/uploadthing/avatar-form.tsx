"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Plus } from "lucide-react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export default function AvatarChange() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file.size > 1024 * 3000) {
        return alert("Ukuran file terlalu besar");
      }

      setFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const fileUploadHandler = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await uploadFiles("imageUploader", {
      files: [file],
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Foto</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div
          className="w-full aspect-square bg-muted relative bg-cover bg-center group"
          style={{
            backgroundImage: `url(${filePreview})`,
          }}
        >
          {filePreview && (
            <div className="absolute inset-0 bg-black/80 hidden transition-all flex items-center group-hover:flex justify-center">
              <Button
                variant="neutral"
                onClick={() => {
                  setFile(null);
                  setFilePreview("");
                }}
              >
                Hapus
              </Button>
            </div>
          )}
          <label
            htmlFor="pp"
            className={`absolute inset-0 flex items-center justify-center cursor-pointer ${
              filePreview && "hidden"
            }`}
          >
            <Plus />
          </label>
          <input
            type="file"
            accept="image/*"
            id="pp"
            multiple={false}
            className="hidden"
            onChange={fileChangeHandler}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={fileUploadHandler}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
