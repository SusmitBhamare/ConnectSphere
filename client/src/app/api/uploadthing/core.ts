import useUserStore from "@/app/zustand/store";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();


export const ourFileRouter = {

  imageUploader: f({ image: { maxFileSize: "16MB" } , pdf : { maxFileSize : "16MB" } , text : { maxFileSize : "16MB" } })

    .middleware(async ({  }) => {
      const token = cookies().get("token");
      if(!token){
        throw new Error("Unauthorized");
      }
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const fileExt = file.name.split(".").pop();
      return {
        url : file.url,
        name : file.name,
        type : file.type,
        size : file.size,
        extension : fileExt
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;