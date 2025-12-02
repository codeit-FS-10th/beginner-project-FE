import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@assets": "/src/assets",
            "@img": "/src/assets/Img",
            "@styles": "/src/styles",
            "@atoms": "/src/components/atoms",
            "@molecule": "/src/components/molecule",
            "@pages": "/src/pages",
            "@hooks": "/src/hooks",
            "@mocks": "/src/mocks",
            "@utils": "/src/utils",
            "@api": "/src/api",
        },
    },
});
