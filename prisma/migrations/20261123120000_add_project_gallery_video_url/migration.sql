-- Extra listing media on the admin Projects form: additional gallery photos
-- and an optional video URL (URL only — video files are never uploaded).
ALTER TABLE "Project" ADD COLUMN "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN "videoUrl" TEXT;
