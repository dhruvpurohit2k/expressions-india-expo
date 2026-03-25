import { createContext, useContext, useState } from "react";
import { ImageSourcePropType } from "react-native";

type AppImage = string | ImageSourcePropType | null;

type ImageContextType = {
  image: AppImage;
  setImage: React.Dispatch<React.SetStateAction<AppImage>>;
};

export const ImageContext = createContext<ImageContextType | null>(null);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<AppImage>(null);
  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used inside ImageProvider");
  }
  return context;
};
