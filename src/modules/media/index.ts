// API pública del módulo de medios del frontend. Importar solo desde aquí.

export { MediaPicker } from "./components/MediaPicker";
export type { MediaPickerProps } from "./components/MediaPicker";
export { MediaPickerField } from "./components/MediaPickerField";
export type { MediaPickerFieldProps } from "./components/MediaPickerField";
export { listMedia, uploadMedia, deleteMedia } from "./media.client";
export type { ListMediaParams } from "./media.client";
export { MEDIA_ACCEPT, MEDIA_CLIENT_LIMITS } from "./types";
export type {
    MediaFolder,
    MediaKind,
    TMedia,
    TMediaListResponse,
    TMediaUploadResult,
} from "./types";
