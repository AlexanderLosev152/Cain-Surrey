import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import fs from "fs-extra";
import { glob } from "glob";

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      jpg: { quality: 70 },
      png: { quality: 70 },
    }),
    {
      name: "convert-and-cleanup",
      async writeBundle() {
        // Конвертируем в WebP
        await imagemin(["public/images/*.{jpg,png}"], {
          destination: "dist/images",
          plugins: [imageminWebp({ quality: 50 })],
        });
        console.log("✅ Images converted to WebP");

        // Удаляем оригинальные JPG/PNG
        const filesToDelete = await glob("dist/images/*.{jpg,png}");
        await Promise.all(filesToDelete.map((file) => fs.remove(file)));
        console.log("🧹 Original JPG/PNG files removed");
      },
    },
  ],
});
