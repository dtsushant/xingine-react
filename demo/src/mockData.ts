// Mock data for the commissars API endpoint - using the structure from user's example
import {LAYOUT_MAP} from "@/components/layouts/layout.map.ts";

export const mockCommissarsData = Object.entries(LAYOUT_MAP).map(([key, layout]) => layout);
