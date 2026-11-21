-- Web-parity display fields the relational columns do not cover (Bengali texts,
-- image gallery, summary, amenities, badges, 3D/360/video flags, completion note
-- and the project label/slug) so the public catalogue can be served from the DB.
ALTER TABLE "Property" ADD COLUMN "webFields" JSONB;

-- Stable catalogue ordering shared by the public site and the admin panel.
ALTER TABLE "Property" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
