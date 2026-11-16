import { test } from "node:test";
import assert from "node:assert/strict";
import { mediaURL } from "../src/lib/media-url";
test("Payload image originals and derivatives stay on the current deployment and retain storage prefixes", () => {
  assert.equal(
    mediaURL(
      "https://old.netlify.app/api/media/file/image-480x270.png?prefix=lumiere-index%2Fpreview",
    ),
    "/api/media/file/image-480x270.png?prefix=lumiere-index%2Fpreview",
  );
  assert.equal(
    mediaURL("/api/media/file/image.png"),
    "/api/media/file/image.png",
  );
  assert.equal(
    mediaURL("https://images.example.com/photo.jpg"),
    "https://images.example.com/photo.jpg",
  );
  assert.equal(mediaURL("javascript:alert(1)"), undefined);
  assert.equal(mediaURL("//evil.example.com/image.png"), undefined);
});
