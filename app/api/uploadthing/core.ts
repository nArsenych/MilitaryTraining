import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
  };

export const ourFileRouter = {
    courseBanner: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
    sectionVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
    sectionResource: f(["text", "image", "video", "audio", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  } satisfies FileRouter;
  
  export type OurFileRouter = typeof ourFileRouter;