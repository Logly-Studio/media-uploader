export type Media = {
  id: string;
  url: string;
  caption?: string;
  alt_text?: string;
  type: "image" | "video";
  thumbnail: string;
  filename: string;
};
